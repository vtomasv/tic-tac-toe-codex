# Traceability Verifier Contract

## Command

`npm run verify:traceability` executes:

```text
node scripts/verify-traceability.mjs --phase=final
```

The verifier is read-only, deterministic, offline and exits with status 1 for any failed rule.

## Canonical Inputs

- `specs/001-tres-en-raya-web/spec.md`
- `specs/001-tres-en-raya-web/traceability.md`
- `specs/001-tres-en-raya-web/tasks.md`
- `src/**/*.test.ts`
- `src/**/*.test.tsx`
- `tests/e2e/**/*.spec.ts`
- `git log --format=%H%x09%s --all`

## Required Checks

### Specification

- Extract AC-IDs only from anchored acceptance-criterion bullet lines.
- Reject malformed or duplicate IDs.
- Treat this set as authoritative; never infer or rewrite criteria.

### Traceability ledger

- Parse columns by header name.
- Require exactly one row per specification AC and no unknown AC.
- Require planned test level, file and exact test name containing the AC-ID.
- In final mode, reject `PENDING`, absent RED evidence and status other than `VERIFIED`.

### Tasks

- Parse unique `Tnnn` IDs.
- Require one or more `[RED]` and one or more `[GREEN]` tasks per AC.
- Require every user-story task to list its AC-IDs explicitly.
- Require ledger task IDs to exist and reference the same AC.
- Permit criteria from different stories to share a `[SHARED]` GREEN task only when they describe the same
  observable behavior, every related RED is in the immediately preceding cohesive block, and the
  task declares every related AC-ID.
- Reject an unrelated RED block that starts before the current block reaches its mapped GREEN.
- Require every foundational tooling task to declare a stable `GATE-ID`, with RED before GREEN and a
  matching gate row in `traceability.md`.

### Tests

- Inspect declarations in allowed test files, not comments.
- Require every AC in at least one `test` or `it` title.
- Reject unknown AC-IDs in test titles.
- Require each ledger file and exact test name to exist.

### Git history and TDD order

- Accept test subjects only as `test(USn): Tnnn description [AC-ID ...]`.
- Accept implementation subjects only as `feat(USn): ...` or `fix(USn): ...` in the same format.
- Require task and AC references to agree with `tasks.md` and the ledger.
- Require each test commit to be an ancestor of its implementation commit.
- Require persisted RED command/output evidence; Git chronology alone is insufficient.
- Accept foundational tooling subjects only as
  `test(tooling): Tnnn description [GATE-ID ...]` followed by `feat(tooling): ...` or
  `fix(tooling): ...`; reject fabricated US or AC references on those commits.

## Optional Diagnostic Phases

- `--phase=plan`: validates spec, ledger coverage and planned AC-named tests; permits pending tasks,
  evidence and commits.
- `--phase=tasks`: additionally requires complete RED/GREEN tasks; permits pending execution evidence
  and commits.
- `--phase=final`: requires the complete chain and is the only phase exposed by the npm script.

## Output

Errors are sorted and grouped by `spec`, `ledger`, `tasks`, `tests` and `git`. Success reports counts
for ACs, RED tasks, GREEN tasks, tests, test commits and implementation commits.
