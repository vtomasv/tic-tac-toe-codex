# Research: Tres en Raya web local

**Date**: 2026-07-14

## Exact Resolved Versions

Versions were resolved from official Node.js release information and npm package metadata on
2026-07-14. `package.json` must pin these exact versions without `^` or `~`, and the generated
`package-lock.json` must be committed separately with setup artifacts.

| Runtime or package | Exact version | Role and compatibility |
|--------------------|---------------|------------------------|
| Node.js | 24.18.0 LTS | LTS runtime; satisfies Vite, Vitest, jsdom and Playwright engines |
| `react` | 19.2.7 | Client component runtime |
| `react-dom` | 19.2.7 | Must match React exactly |
| `typescript` | 7.0.2 | Strict static typing |
| `vite` | 8.1.4 | Development server and production build |
| `@vitejs/plugin-react` | 6.0.3 | Official React integration for Vite 8 |
| `vitest` | 4.1.10 | Unit and component test runner; compatible with Vite 8 |
| `jsdom` | 29.1.1 | DOM environment; supports Node 24 |
| `@testing-library/react` | 16.3.2 | React component testing; supports React 19 |
| `@testing-library/dom` | 10.4.1 | Required peer dependency for RTL 16 |
| `@testing-library/user-event` | 14.6.1 | User-level pointer and keyboard interactions |
| `@testing-library/jest-dom` | 6.9.1 | DOM assertions through its Vitest entry point |
| `@playwright/test` | 1.61.1 | Browser end-to-end tests |
| `@types/react` | 19.2.17 | React types for strict TypeScript |
| `@types/react-dom` | 19.2.3 | React DOM types for strict TypeScript |

Primary sources:

- Node.js 24.18.0 LTS: <https://nodejs.org/en/blog/release/v24.18.0>
- Node.js release status: <https://nodejs.org/en/about/previous-releases>
- React and React DOM: <https://www.npmjs.com/package/react?activeTab=versions> and
  <https://www.npmjs.com/package/react-dom?activeTab=versions>
- TypeScript: <https://www.npmjs.com/package/typescript?activeTab=versions>
- Vite and plugin: <https://www.npmjs.com/org/vitejs?activeTab=packages> and
  <https://www.npmjs.com/package/%40vitejs/plugin-react?activeTab=versions>
- Vitest: <https://www.npmjs.com/package/vitest>
- jsdom: <https://www.npmjs.com/package/jsdom>
- Testing Library: <https://www.npmjs.com/package/%40testing-library/react?activeTab=versions>,
  <https://www.npmjs.com/package/%40testing-library/dom>,
  <https://www.npmjs.com/package/%40testing-library/user-event?activeTab=versions> and
  <https://www.npmjs.com/package/%40testing-library/jest-dom?activeTab=versions>
- Playwright: <https://www.npmjs.com/package/%40playwright/test?activeTab=versions>
- React types: <https://www.npmjs.com/package/%40types/react> and
  <https://www.npmjs.com/package/%40types/react-dom>

## Decision: Pure Reducer as Domain Authority

**Decision**: Model the game with a pure `gameReducer` plus immutable state and a centralized
`WINNING_LINES` constant.

**Rationale**: A reducer makes actions and transitions explicit, is directly testable without React,
and integrates with `useReducer` without another state library. Guarding occupied and terminal cells
at this boundary prevents UI bypasses.

**Alternatives considered**:

- Separate `playCell` and `resetGame` functions: also pure, but distributes transition orchestration.
- State held directly in components: rejected because it couples rules to presentation.
- External state library: rejected because the fixed nine-cell state does not justify it.

## Decision: Store Canonical Status Explicitly

**Decision**: `GameState` contains both the nine-cell board and one explicit canonical status.

**Rationale**: The spec requires the five status values to be represented explicitly. Selectors may
derive visible text, but the state machine does not infer the current status ad hoc in components.

**Alternatives considered**:

- Infer all status from board and move count: rejected because it obscures terminal/turn transitions.
- Separate `winner` and `currentPlayer` flags: rejected because combinations can become invalid.

## Decision: Victory Before Draw

**Decision**: After a legal mark, evaluate all winning lines before checking whether the board is full.

**Rationale**: This preserves the spec's ninth-move victory precedence and eliminates a victory/draw
contradiction.

**Alternatives considered**: Full-board check first was rejected because it could misclassify a
winning ninth move as `DRAW`.

## Decision: Accessible Blocking Without Native Disabled

**Decision**: Use real buttons with `aria-disabled="true"` and no-op guards for occupied and terminal
cells. Keep all nine cells in row-major focus order; keep restart enabled.

**Rationale**: Native `disabled` blocks activation but removes buttons from sequential focus, which
would contradict the unchanged focus-order and rejected-activation criteria. `aria-disabled` exposes
unavailability while UI and reducer guards guarantee no mutation.

**Alternatives considered**:

- Native `disabled`: rejected because it breaks AC-US4-TECLADO-005 and AC-US4-FOCO-007.
- Non-button grid cells: rejected because the plan requires native button semantics.

## Decision: One Polite Status Mechanism

**Decision**: `GameStatus` owns one visible `role="status"` live region with `aria-live="polite"` and
`aria-atomic="true"`. A deterministic UI event revision allows restart to re-announce X without a timer.

**Rationale**: A single source prevents duplicate announcements and satisfies turn/result updates
without intrusive alerts, timers or random identifiers.

**Alternatives considered**:

- `role="alert"`: rejected as unnecessarily interruptive.
- Delayed announcement with `setTimeout`: rejected by the no-timer constraint.
- Separate visible and hidden live regions: rejected because they can duplicate announcements.

## Decision: Test Boundaries

**Decision**: Domain rules use Vitest directly; DOM semantics and interaction use React Testing
Library; true touch, layout, zoom and computed CSS use Playwright.

**Rationale**: jsdom does not prove actual layout, zoom, hover paint or assistive-technology speech.
Tests therefore assert the live-region contract, while browser tests verify the exposed DOM and CSS.

**Alternatives considered**:

- All tests in Playwright: rejected as slower and less precise for pure rules.
- All tests in jsdom: rejected because it cannot validate real layout or computed visual behavior.

The automated 200 % zoom check uses Chromium browser instrumentation and bounding-box intersection
checks. Other E2E flows run across Chromium, Firefox and WebKit. The criterion remains unchanged.

## Decision: Traceability Verification

**Decision**: Build a read-only Node verifier with plan/tasks/final validation phases; expose only
final validation through `npm run verify:traceability`.

**Rationale**: Planning legitimately contains pending tasks and commits, while Definition of Done
must reject every pending link. Explicit phases make diagnostics useful without weakening the final
gate.

**Alternatives considered**:

- Keyword inference: rejected because the constitution requires explicit IDs.
- Git log alone as RED proof: rejected because a commit cannot prove a prior failed execution.
- Network-backed verification: rejected because verification must be deterministic and offline.

## Decision: Foundational Gate Identity

**Decision**: Identify the traceability tooling as `GATE-TRACEABILITY-001`. Its RED/GREEN tasks and
commits use `(tooling)` plus the GATE-ID; product behavior continues to use `USn` plus AC-IDs.

**Rationale**: The verifier enforces every product criterion but is not itself product behavior.
A stable gate identity preserves task, test and commit auditability without fabricating `US0` or an
acceptance criterion unrelated to the application.

**Alternatives considered**:

- `US0`: rejected because no such user story exists in `spec.md`.
- Reusing all 42 AC-IDs: rejected because it would mix unrelated product criteria in tooling commits.
- Untraced tooling commits: rejected because it would weaken the constitutional audit chain.

## Decision: Cohesive Cross-Story TDD Blocks

**Decision**: Criteria from different stories that describe one unavoidable observable behavior may
share a GREEN task. Every related AC keeps its own RED task and ledger row; all of those RED tasks run
immediately before the shared implementation, whose task and commit enumerate every mapped AC-ID.

**Rationale**: Native buttons make click, touch, Enter and Space activation inseparable once the
handler is connected. Treating the modalities as later implementations would make their tests green
before their declared RED cycle and violate TDD. A cohesive block preserves stable criteria without
fabricating duplicate implementation work.

**Alternatives considered**:

- Reimplementing the same native behavior in a later story: rejected because its RED would already pass.
- Keeping unrelated failing tests open across implementation commits: rejected by the accumulated-suite gate.
- Removing or renumbering criteria: rejected because the accepted behavior and stable IDs remain valid.

## Decision: Dependency and Environment Reproducibility

**Decision**: Pin exact package versions, commit `package-lock.json`, use `npm ci` in validation and
require Node.js 24.18.0 LTS.

**Rationale**: Exact direct versions plus a lockfile make local and automated runs reproducible.

**Alternatives considered**: Semver ranges and unlocked installation were rejected because they allow
unreviewed dependency changes.

## Decision: Git Prerequisite

**Decision**: Initialize or place the project in a Git repository before executing RED tasks.

**Rationale**: The current directory has no `.git`; constitutional test/implementation commits and
the required `git log` audit cannot otherwise exist. This does not block planning but blocks TDD
execution and final completion.

**Alternatives considered**: Marking commits as pending forever or simulating history was rejected
because it would falsify traceability.
