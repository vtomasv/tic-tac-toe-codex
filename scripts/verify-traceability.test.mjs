import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import * as verifier from './verify-traceability.mjs';

const { validateSnapshot } = verifier;

const spec = `
- **AC-US1-DOMINIO-001** — **EARS: Event-driven**: Cuando ocurre A, el sistema DEBE mostrar A.
- **AC-US1-INTERACCION-002** — **EARS: Event-driven**: Cuando ocurre B, el sistema DEBE mostrar B.
`;

const tasks = `
- [ ] T001 [GATE:GATE-TRACEABILITY-001] [RED] Add test in \`scripts/verify-traceability.test.mjs\`; Expected commit: \`test(tooling): T001 test gate [GATE-TRACEABILITY-001]\`
- [ ] T002 [GATE:GATE-TRACEABILITY-001] [GREEN] Add verifier in \`scripts/verify-traceability.mjs\`; Expected commit: \`feat(tooling): T002 implement gate [GATE-TRACEABILITY-001]\`
- [ ] T003 [US1] [AC:AC-US1-DOMINIO-001] [RED] Add test in \`src/domain/a.test.ts\`; Expected commit: \`test(US1): T003 test A [AC-US1-DOMINIO-001]\`
- [ ] T005 [US1] [AC:AC-US1-DOMINIO-001] [GREEN] Implement in \`src/domain/a.ts\`; Expected commit: \`feat(US1): T005 implement A [AC-US1-DOMINIO-001]\`
- [ ] T004 [US1] [AC:AC-US1-INTERACCION-002] [RED] Add test in \`src/components/a.test.tsx\`; Expected commit: \`test(US1): T004 test B [AC-US1-INTERACCION-002]\`
- [ ] T006 [US1] [AC:AC-US1-INTERACCION-002] [GREEN] Implement in \`src/components/a.tsx\`; Expected commit: \`feat(US1): T006 implement B [AC-US1-INTERACCION-002]\`
`;

const ledger = `
| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---------|----------|------------|-----------|--------------|-------------|-----------------------|--------|
| GATE-TRACEABILITY-001 | T001 | T002 | \`scripts/verify-traceability.test.mjs\` | PENDING | PENDING | PENDING | PLANNED |
| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |
|-------|----------|------------|---------------|-----------|-------------------------|--------------|-------------|-----------------------|--------|
| AC-US1-DOMINIO-001 | T003 | T005 | Domain | \`src/domain/a.test.ts\` | \`AC-US1-DOMINIO-001 test A\` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-INTERACCION-002 | T004 | T006 | Component | \`src/components/a.test.tsx\` | \`AC-US1-INTERACCION-002 test B\` | PENDING | PENDING | PENDING | PLANNED |
`;

function messages(overrides = {}) {
  return validateSnapshot({ spec, tasks, ledger, phase: 'tasks', ...overrides }).errors.join('\n');
}

test('GATE-TRACEABILITY-001 accepts a complete planned snapshot', () => {
  assert.equal(messages(), '');
});

test('GATE-TRACEABILITY-001 rejects malformed criterion IDs', () => {
  assert.match(messages({ spec: `${spec}\n- **AC-US1-DOMINIO-01** — invalid` }), /malformed AC-ID/);
});

test('GATE-TRACEABILITY-001 rejects duplicate criterion IDs', () => {
  assert.match(messages({ spec: `${spec}\n- **AC-US1-DOMINIO-001** — duplicate` }), /duplicate AC-ID/);
});

test('GATE-TRACEABILITY-001 rejects missing GREEN coverage', () => {
  assert.match(messages({ tasks: tasks.replace(/^.*T005.*\n/m, '') }), /missing GREEN task.*AC-US1-DOMINIO-001/);
});

test('GATE-TRACEABILITY-001 rejects unknown criterion references', () => {
  const unknown = tasks.replace(
    '[AC:AC-US1-DOMINIO-001] [RED]',
    '[AC:AC-US1-DOMINIO-999] [RED]',
  );
  assert.match(messages({ tasks: unknown }), /unknown AC-ID AC-US1-DOMINIO-999/);
});

test('GATE-TRACEABILITY-001 rejects GREEN before RED', () => {
  const lines = tasks.split('\n');
  const redIndex = lines.findIndex((line) => line.includes('T003 [US1]'));
  const greenIndex = lines.findIndex((line) => line.includes('T005 [US1]'));
  [lines[redIndex], lines[greenIndex]] = [lines[greenIndex], lines[redIndex]];
  assert.match(messages({ tasks: lines.join('\n') }), /GREEN precedes RED.*AC-US1-DOMINIO-001/);
});

test('GATE-TRACEABILITY-001 rejects an unrelated RED before a shared GREEN closes its block', () => {
  const lines = tasks.split('\n');
  const firstGreen = lines.findIndex((line) => line.includes('T005 [US1]'));
  const unrelatedRed = lines.findIndex((line) => line.includes('T004 [US1]'));
  const [line] = lines.splice(unrelatedRed, 1);
  lines.splice(firstGreen, 0, line);
  assert.match(messages({ tasks: lines.join('\n') }), /unrelated RED block/);
});

test('GATE-TRACEABILITY-001 rejects tooling commits that fabricate US0', () => {
  const fabricated = tasks.replace(
    'test(tooling): T001 test gate [GATE-TRACEABILITY-001]',
    'test(US0): T001 test gate [GATE-TRACEABILITY-001]',
  );
  assert.match(messages({ tasks: fabricated }), /invalid tooling commit subject/);
});

function featureFixture({
  number,
  slug,
  phase = 'Planned',
  ac = `AC-US${number}-DOMINIO-001`,
  gate = `GATE-FEATURE${number}-001`,
  start = number * 10,
  pending = true,
} = {}) {
  const red = `T${String(start).padStart(3, '0')}`;
  const green = `T${String(start + 1).padStart(3, '0')}`;
  const gateRed = `T${String(start + 2).padStart(3, '0')}`;
  const gateGreen = `T${String(start + 3).padStart(3, '0')}`;
  const evidence = pending ? 'PENDING' : '`red.txt`';
  const testCommit = pending ? 'PENDING' : 'TEST_SHA';
  const implementationCommit = pending ? 'PENDING' : 'IMPLEMENTATION_SHA';
  const status = pending ? 'PENDING' : 'VERIFIED';
  return {
    slug: `${String(number).padStart(3, '0')}-${slug}`,
    spec: `- **${ac}** — **EARS: Event-driven**: Cuando ocurre A, el sistema DEBE mostrar A.\n`,
    tasks: [
      `- [ ] ${gateRed} [OWNER:orchestrator] [GATE:${gate}] [RED] Add gate test; Expected commit: \`test(tooling): ${gateRed} test gate [${gate}]\``,
      `- [ ] ${gateGreen} [OWNER:orchestrator] [GATE:${gate}] [GREEN] Add gate implementation; Expected commit: \`feat(tooling): ${gateGreen} implement gate [${gate}]\``,
      `- [ ] ${red} [US${number}] [OWNER:domain] [AC:${ac}] [RED] Add product test; Expected commit: \`test(US${number}): ${red} test behavior [${ac}]\``,
      `- [ ] ${green} [US${number}] [OWNER:domain] [AC:${ac}] [GREEN] Add product implementation; Expected commit: \`feat(US${number}): ${green} implement behavior [${ac}]\``,
      '',
    ].join('\n'),
    ledger: [
      `**Phase**: ${phase}`,
      '',
      '| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |',
      '|---|---|---|---|---|---|---|---|',
      `| ${gate} | ${gateRed} | ${gateGreen} | \`scripts/gate.test.mjs\` | ${evidence} | ${testCommit} | ${implementationCommit} | ${status} |`,
      '',
      '| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |',
      '|---|---|---|---|---|---|---|---|---|---|',
      `| ${ac} | ${red} | ${green} | Domain | \`src/a.test.ts\` | \`${ac} test behavior\` | ${evidence} | ${testCommit} | ${implementationCommit} | ${status} |`,
      '',
    ].join('\n'),
  };
}

function writeFeature(root, fixture, omissions = []) {
  const directory = path.join(root, 'specs', fixture.slug);
  mkdirSync(directory, { recursive: true });
  for (const [name, content] of [
    ['spec.md', fixture.spec],
    ['tasks.md', fixture.tasks],
    ['traceability.md', fixture.ledger],
  ]) {
    if (!omissions.includes(name)) writeFileSync(path.join(directory, name), content);
  }
}

function createRepository(t, fixtures, active = fixtures[0].slug) {
  const root = mkdtempSync(path.join(tmpdir(), 'traceability-gate-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, '.specify'), { recursive: true });
  writeFileSync(
    path.join(root, '.specify', 'feature.json'),
    `${JSON.stringify({ feature_directory: `specs/${active}` }, null, 2)}\n`,
  );
  mkdirSync(path.join(root, 'scripts'), { recursive: true });
  mkdirSync(path.join(root, 'src'), { recursive: true });
  writeFileSync(path.join(root, 'scripts', 'gate.test.mjs'), "test('gate', () => {});\n");
  writeFileSync(path.join(root, 'src', 'a.test.ts'), "test('placeholder', () => {});\n");
  writeFileSync(
    path.join(root, 'package.json'),
    `${JSON.stringify({ scripts: { 'verify:traceability': 'node scripts/verify-traceability.mjs --phase=final' } }, null, 2)}\n`,
  );
  for (const fixture of fixtures) writeFeature(root, fixture);
  return root;
}

function captureCli(args) {
  const output = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...values) => output.push(values.join(' '));
  console.error = (...values) => output.push(values.join(' '));
  try {
    return { status: verifier.runCli(args), output: output.join('\n') };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

function initializeGit(root) {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Traceability Test',
    GIT_AUTHOR_EMAIL: 'traceability@example.test',
    GIT_COMMITTER_NAME: 'Traceability Test',
    GIT_COMMITTER_EMAIL: 'traceability@example.test',
  };
  for (const args of [
    ['init', '-q'],
    ['add', '.'],
    ['commit', '-q', '-m', 'fixture'],
  ]) {
    const result = spawnSync('git', args, { cwd: root, env, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  return env;
}

test('GATE-MULTIFEATURE-001 discovers every complete feature independently of the active selector', (t) => {
  const first = featureFixture({ number: 1, slug: 'first', start: 10 });
  const second = featureFixture({ number: 2, slug: 'second', start: 20 });
  second.tasks = second.tasks.replace('[AC:AC-US2-DOMINIO-001]', '[AC:AC-US2-DOMINIO-999]');
  const root = createRepository(t, [first, second], first.slug);

  const result = captureCli(['--phase=tasks', `--root=${root}`]);

  assert.equal(result.status, 1);
  assert.match(result.output, /\[feature:002-second\].*unknown AC-ID AC-US2-DOMINIO-999/s);
});

for (const [kind, mutate, pattern] of [
  ['AC-ID', (fixture) => ({ ac: fixture.ac }), /global duplicate AC-ID/],
  ['GATE-ID', (fixture) => ({ gate: fixture.gate }), /global duplicate GATE-ID/],
  ['Task ID', () => ({ start: 10 }), /global duplicate Task ID/],
]) {
  test(`GATE-MULTIFEATURE-001 rejects a ${kind} duplicated across features`, (t) => {
    const first = featureFixture({ number: 1, slug: 'first', start: 10 });
    const second = featureFixture({
      number: 2,
      slug: 'second',
      start: 20,
      ...mutate(first),
    });
    const root = createRepository(t, [first, second]);

    const result = captureCli(['--phase=tasks', `--root=${root}`]);

    assert.equal(result.status, 1);
    assert.match(result.output, pattern);
  });
}

test('GATE-MULTIFEATURE-001 validates git log against the union of tasks in all lifecycle phases', (t) => {
  const first = featureFixture({ number: 1, slug: 'verified', phase: 'Planned', start: 10 });
  const second = featureFixture({ number: 2, slug: 'planned', phase: 'Implementing', start: 20 });
  const root = createRepository(t, [first, second], first.slug);
  const env = initializeGit(root);
  const subject = 'test(US2): T020 test behavior [AC-US2-DOMINIO-001]';
  const commit = spawnSync('git', ['commit', '--allow-empty', '-q', '-m', subject], {
    cwd: root,
    env,
    encoding: 'utf8',
  });
  assert.equal(commit.status, 0, commit.stderr);

  const result = captureCli(['--phase=final', `--root=${root}`]);

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /2 features/);
});

test('GATE-MULTIFEATURE-001 reports partial numbered features during final validation', (t) => {
  const complete = featureFixture({ number: 1, slug: 'complete', start: 10 });
  const partial = featureFixture({ number: 2, slug: 'partial', start: 20 });
  const root = createRepository(t, [complete]);
  writeFeature(root, partial, ['tasks.md']);

  const result = captureCli(['--phase=final', `--root=${root}`]);

  assert.equal(result.status, 1);
  assert.match(result.output, /\[feature:002-partial\].*missing tasks\.md/s);
});

test('GATE-MULTIFEATURE-001 accepts all lifecycle phases case-insensitively and rejects an unknown phase', (t) => {
  const fixtures = [
    featureFixture({ number: 1, slug: 'planned', phase: 'planned', start: 10 }),
    featureFixture({ number: 2, slug: 'implementing', phase: 'IMPLEMENTING', start: 20 }),
    featureFixture({ number: 3, slug: 'candidate', phase: 'Release_Candidate', start: 30 }),
    featureFixture({ number: 4, slug: 'verified', phase: 'Verified', start: 40 }),
  ];
  const root = createRepository(t, fixtures);
  const accepted = captureCli(['--phase=tasks', `--root=${root}`]);
  assert.equal(accepted.status, 0, accepted.output);

  fixtures[1].ledger = fixtures[1].ledger.replace('IMPLEMENTING', 'DRAFT');
  writeFeature(root, fixtures[1]);
  const rejected = captureCli(['--phase=tasks', `--root=${root}`]);
  assert.equal(rejected.status, 1);
  assert.match(rejected.output, /\[feature:002-implementing\].*unsupported ledger phase DRAFT/s);
});

test('GATE-MULTIFEATURE-001 allows PENDING in final for planned work but rejects it for release maturity', (t) => {
  const planned = featureFixture({ number: 1, slug: 'planned', phase: 'Planned', start: 10 });
  const root = createRepository(t, [planned]);
  initializeGit(root);
  const plannedResult = captureCli(['--phase=final', `--root=${root}`]);
  assert.equal(plannedResult.status, 0, plannedResult.output);

  planned.ledger = planned.ledger.replace('**Phase**: Planned', '**Phase**: Release_Candidate');
  writeFeature(root, planned);
  const candidateResult = captureCli(['--phase=final', `--root=${root}`]);
  assert.equal(candidateResult.status, 1);
  assert.match(candidateResult.output, /\[feature:001-planned\].*missing (RED evidence|test commit|implementation commit)/s);
});

test('GATE-MULTIFEATURE-001 emits deterministic feature-ordered diagnostics and binary exit codes', (t) => {
  const first = featureFixture({ number: 1, slug: 'zeta', phase: 'DRAFT', start: 10 });
  const second = featureFixture({ number: 2, slug: 'alpha', phase: 'DRAFT', start: 20 });
  const root = createRepository(t, [second, first], second.slug);

  const left = captureCli(['--phase=tasks', `--root=${root}`]);
  const right = captureCli(['--phase=tasks', `--root=${root}`]);

  assert.equal(left.status, 1);
  assert.equal(right.status, 1);
  assert.equal(left.output, right.output);
  assert.ok(left.output.indexOf('[feature:001-zeta]') < left.output.indexOf('[feature:002-alpha]'));
  assert.ok([0, 1].includes(left.status));
});

test('GATE-MULTIFEATURE-001 preserves feature 001 while aggregating the active feature 002', () => {
  assert.equal(typeof verifier.validateRepository, 'function');
  const result = verifier.validateRepository({ root: process.cwd(), phase: 'tasks' });
  assert.deepEqual(result.features.map((feature) => feature.slug), [
    '001-tres-en-raya-web',
    '002-undo',
  ]);
  assert.equal(result.counts.acceptanceCriteria, 76);
  assert.equal(result.counts.gates, 2);
  assert.deepEqual(result.errors, []);
});

test('GATE-MULTIFEATURE-001 represents supplemental RED GREEN pairs without losing block order', () => {
  const supplementalTasks = `
- [ ] T001 [GATE:GATE-TRACEABILITY-001] [RED] Add test; Expected commit: \`test(tooling): T001 test gate [GATE-TRACEABILITY-001]\`
- [ ] T002 [GATE:GATE-TRACEABILITY-001] [GREEN] Add implementation; Expected commit: \`feat(tooling): T002 implement gate [GATE-TRACEABILITY-001]\`
- [ ] T003 [US1] [OWNER:e2e] [AC:AC-US1-DOMINIO-001] [RED] Add unit evidence; Expected commit: \`test(US1): T003 test unit [AC-US1-DOMINIO-001]\`
- [ ] T004 [US1] [OWNER:e2e] [AC:AC-US1-DOMINIO-001] [RED] Add integration evidence; Expected commit: \`test(US1): T004 test integration [AC-US1-DOMINIO-001]\`
- [ ] T005 [US1] [OWNER:e2e] [AC:AC-US1-DOMINIO-001] [GREEN] Implement domain; Expected commit: \`feat(US1): T005 implement domain [AC-US1-DOMINIO-001]\`
- [ ] T006 [US1] [OWNER:e2e] [AC:AC-US1-DOMINIO-001] [GREEN] Compose domain; Expected commit: \`feat(US1): T006 compose domain [AC-US1-DOMINIO-001]\`
`;
  const supplementalLedger = `
**Phase**: Implementing
| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---|---|---|---|---|---|---|---|
| GATE-TRACEABILITY-001 | T001 | T002 | \`scripts/gate.test.mjs\` | PENDING | PENDING | PENDING | PENDING |
| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |
|---|---|---|---|---|---|---|---|---|---|
| AC-US1-DOMINIO-001 | T003 | T005 | Domain | \`src/a.test.ts\` | \`AC-US1-DOMINIO-001 unit\` | PENDING | PENDING | PENDING | PENDING |
| AC-US1-DOMINIO-001 | T004 | T006 | Integration | \`src/a.integration.test.ts\` | \`AC-US1-DOMINIO-001 integration\` | PENDING | PENDING | PENDING | PENDING |
`;

  const result = validateSnapshot({
    spec: '- **AC-US1-DOMINIO-001** — criterion\n',
    tasks: supplementalTasks,
    ledger: supplementalLedger,
    phase: 'tasks',
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.model.acRows.get('AC-US1-DOMINIO-001').length, 2);
});
