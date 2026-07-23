import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = readFileSync(path.join(root, 'scripts', 'swarm.sh'), 'utf8');
const gitignore = readFileSync(path.join(root, '.gitignore'), 'utf8');
const domainPrompt = readFileSync(
  path.join(root, '.prompts', '09-speckit-implement-domain.md'),
  'utf8',
);
const interfacePrompt = readFileSync(
  path.join(root, '.prompts', '10-speckit-implement-interfaz.md'),
  'utf8',
);

test('GATE-SWARM-001 resolves launch-parallel prompts from the versioned root', () => {
  assert.match(script, /PROMPT_ROOT="\$ROOT\/\.prompts"/);
  assert.doesNotMatch(script, /PROMPT_ROOT="\$ROOT\/prompts"/);
  assert.equal(
    existsSync(path.join(root, '.prompts', '09-speckit-implement-domain.md')),
    true,
  );
  assert.equal(
    existsSync(path.join(root, '.prompts', '10-speckit-implement-interfaz.md')),
    true,
  );
});

test('GATE-SWARM-001 prepares self-contained worktrees with explicit boundaries', () => {
  assert.match(script, /link_dependencies\(\)/);
  assert.match(script, /ln -s "\$ROOT\/node_modules" "\$path\/node_modules"/);
  for (const role of ['domain', 'interfaz', 'e2e']) {
    assert.ok(script.includes(`link_dependencies "$WT_ROOT/${role}"`));
  }
  for (const prompt of [domainPrompt, interfacePrompt]) {
    assert.match(prompt, /node scripts\/verify-traceability\.mjs --phase=tasks/);
    assert.match(prompt, /git diff --name-only/);
  }
  assert.match(domainPrompt, /src\/domain\/\*\*/);
  assert.match(interfacePrompt, /src\/components\/\*\*/);
});

test('GATE-SWARM-001 uses supported non-interactive Codex CLI options', () => {
  assert.doesNotMatch(script, /--ask-for-approval/);
  assert.match(script, /--ephemeral/);
  assert.match(script, /--sandbox "\$sandbox"/);
  assert.match(script, /-c 'approval_policy="never"'/);
});

test('GATE-SWARM-001 rejects nounset-unsafe dependent local declarations', () => {
  assert.doesNotMatch(
    script,
    /local role="\$1" branch="swarm\/\$\{FEATURE_SLUG\}-\$\{role\}" path="\$WT_ROOT\/\$role"/,
  );
  assert.match(
    script,
    /local role="\$1"\n\s+local branch="swarm\/\$\{FEATURE_SLUG\}-\$\{role\}"\n\s+local path="\$WT_ROOT\/\$role"/,
  );
});

test('GATE-SWARM-001 grants linked worktree writes and propagates blocked handoffs', () => {
  assert.match(script, /--add-dir "\$ROOT\/\.git"/);
  assert.match(script, /--add-dir "\$ROOT\/node_modules"/);
  assert.match(script, /REQUEST_ORCHESTRATOR/);
  assert.match(gitignore, /^node_modules$/m);
  assert.doesNotMatch(gitignore, /^node_modules\/$/m);
});

test('GATE-SWARM-001 preserves success for an unblocked handoff under errexit', () => {
  const functionSource = script.match(/reject_blocked_handoff\(\)\{[\s\S]*?\n\}/)?.[0];
  assert.ok(functionSource, 'reject_blocked_handoff must exist');

  const logRoot = mkdtempSync(path.join(tmpdir(), 'swarm-handoff-'));
  try {
    writeFileSync(path.join(logRoot, 'domain.out'), 'READY_FOR_ORCHESTRATOR\n');
    const result = spawnSync(
      'bash',
      [
        '-c',
        [
          'set -e',
          'fail(){ exit 1; }',
          'LOG_ROOT="$1"',
          functionSource,
          'reject_blocked_handoff domain',
        ].join('\n'),
        'swarm-handoff-test',
        logRoot,
      ],
      { encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(logRoot, { recursive: true, force: true });
  }
});
