import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = readFileSync(path.join(root, 'scripts', 'swarm.sh'), 'utf8');
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
