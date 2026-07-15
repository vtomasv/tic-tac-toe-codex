import assert from 'node:assert/strict';
import test from 'node:test';

import { validateSnapshot } from './verify-traceability.mjs';

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
