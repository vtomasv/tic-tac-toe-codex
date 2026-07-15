# Implementation Plan: Tres en Raya web local

**Branch**: `001-tres-en-raya-web` (identificador lógico; el directorio aún no es un repositorio Git)

**Date**: 2026-07-14

**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tres-en-raya-web/spec.md`

## Summary

Implementar una aplicación cliente React para dos jugadores locales mediante un reducer puro y un
modelo de estado explícito. El dominio será independiente de React, centralizará las ocho líneas
ganadoras y aplicará guardas, victoria, empate y alternancia en ese orden. La interfaz usará nueve
botones reales dentro de una cuadrícula accesible, un único estado visible/anunciado y CSS estándar
responsive. La estrategia de pruebas asigna los 42 criterios a Vitest, React Testing Library o
Playwright, siempre con una tarea RED y otra GREEN antes de completar la trazabilidad.

## Technical Context

**Language/Version**: TypeScript 7.0.2 en modo estricto; Node.js 24.18.0 LTS

**Primary Dependencies**: React 19.2.7, React DOM 19.2.7, Vite 8.1.4,
`@vitejs/plugin-react` 6.0.3; versiones completas en [research.md](./research.md)

**Storage**: Ninguno; no se usa persistencia, backend, caché ni almacenamiento del navegador

**Testing**: Vitest 4.1.10 para dominio, React Testing Library 16.3.2 con jsdom 29.1.1 para
componentes e interacción, Playwright Test 1.61.1 para navegador y flujos E2E

**Target Platform**: Navegadores gráficos compatibles con Vite; validación E2E en Chromium,
Firefox y WebKit, salvo el caso automatizado de ampliación 200 %, limitado a Chromium

**Project Type**: Aplicación web cliente de una sola página, sin servicios remotos

**Performance Goals**: Cada acción local evalúa como máximo nueve celdas y ocho líneas; no se
establece un objetivo temporal adicional porque la spec no define latencia

**Constraints**: Sin temporizadores, aleatoriedad, llamadas de red, backend ni almacenamiento;
CSS estándar; dependencias exactas y `package-lock.json`; ancho mínimo validado de 320 píxeles CSS

**Scale/Scope**: Una partida, dos jugadores locales, nueve celdas, cinco estados canónicos y
42 criterios de aceptación; sin usuarios, historial, puntuación ni IA

**Repository prerequisite**: No existe `.git`. Antes del primer ciclo RED/GREEN se DEBE trabajar en
un repositorio Git para que los commits constitucionales y `git log` puedan verificarse.

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- [x] `spec.md` contains no `NEEDS CLARIFICATION` markers.
- [x] All 42 acceptance criteria have stable `AC-USn-CATEGORIA-nnn` IDs and explicit EARS patterns.
- [x] Domain, state, interaction, pointer, keyboard, focus, assistive technology, terminal,
  visual and responsive behavior are covered.
- [x] The design preserves every criterion without changing, deleting or reinterpreting it.
- [x] Every criterion has a named planned test and requires a RED task before its GREEN task.
- [x] `traceability.md` exists and the design requires `scripts/verify-traceability.mjs` plus
  `npm run verify:traceability`.
- [x] Product and foundational tooling commits are separated and follow their constitutional
  `USn`/`AC-ID` or `tooling`/`GATE-ID` subject format.

**Gate result**: PASS for planning. Implementation remains blocked until `tasks.md` maps every AC to
RED and GREEN tasks. Final completion remains blocked until Git, tests, commits, build and the
traceability verifier all pass.

**Documented exceptions**: None.

## Architecture

### Domain boundary

`src/domain/game.ts` is the sole authority for game rules. It exports immutable domain types,
`INITIAL_STATE`, the eight `WINNING_LINES`, a pure `gameReducer`, and pure selectors only when they
remove duplicated derivation. It imports neither React nor browser APIs.

The reducer processes `PLAY_CELL` in this exact order:

1. Return the current state for terminal status or an occupied cell.
2. Place the mark corresponding to `PLAYING_X` or `PLAYING_O`.
3. Evaluate the centralized winning lines and return `WON_X` or `WON_O` when matched.
4. Evaluate a full board and return `DRAW` only when no winning line exists.
5. Alternate to the other playing state.

`RESET` always returns `INITIAL_STATE`. There are no effects, timers, random values, network calls or
storage operations in the reducer.

### React composition

- `App.tsx` owns `useReducer(gameReducer, initialState ?? INITIAL_STATE)`, where the optional immutable
  `initialState` prop exists only for direct canonical-state component tests; it translates UI events to domain actions,
  composes `Board` and `GameStatus`, and moves focus to the first cell after reset.
- `Board.tsx` renders the board and emits only a cell index. It cannot decide turns, winners or draws.
- `GameStatus.tsx` renders the visible Spanish status and one non-intrusive live region.
- UI announcement state is deterministic and separate from domain state so resetting from
  `PLAYING_X` can still announce “Turno de X” without a timer.

### Accessible control strategy

The board uses a labeled grid with three rows and nine `<button type="button">` cells in
row-major DOM order. Native click activation covers mouse, touch, Enter and Space; custom keyboard
handlers must not duplicate native button activation.

Occupied and terminal cells use `aria-disabled="true"` plus guards in the UI handler and reducer.
Native `disabled` is prohibited because it would remove cells from sequential focus and contradict
AC-US4-TECLADO-005 and AC-US4-FOCO-007. “Blocked” therefore means the activation is exposed as
unavailable and cannot mutate board or status; reset remains enabled.

The single status mechanism uses visible text with `role="status"`, `aria-live="polite"` and
`aria-atomic="true"`. Cell names expose row, column and content. X, O, turn and result remain textual
or shape-based in addition to color. CSS provides continuous focus and playable-hover outlines,
prevents horizontal overflow from 320 to 1920 pixels and prevents control overlap at 200 % zoom.

## Test Strategy and TDD Contract

Every planned test name contains its literal AC-ID; [traceability.md](./traceability.md) is the
authoritative planned mapping.

- **Domain / Vitest**: pure initialization, alternation, occupied/terminal no-op, all eight winning
  lines for both players, victory-before-draw, draw and reset invariants.
- **Component / React Testing Library**: DOM structure, statuses, buttons, click/keyboard behavior,
  focus order, reset focus, `aria-disabled`, accessible names and live-region updates.
- **E2E / Playwright**: real touch activation; responsive widths with cell and reset operability at
  the boundary widths; 200 % zoom; computed focus/hover outline; and a complete keyboard game ending
  in a terminal state followed by keyboard reset.

For each AC, `tasks.md` must create:

1. One RED task that adds the named test, runs the narrowest command, records failing evidence and
   creates `test(USn): Tnnn <description> [AC-ID ...]`.
2. One mapped GREEN task that implements only the mapped behavior, runs relevant tests and creates
   `feat(USn): Tnnn <description> [AC-ID ...]`.

Related criteria from different stories may share one `[SHARED]` GREEN task when they describe the same
observable behavior. Every mapped RED must form one immediately preceding cohesive block, and the
task plus commit must enumerate every related AC-ID. No GREEN task starts before all of its RED
evidence and test commits. The accumulated relevant suites return to green before another RED block
starts, and no completed task or implementation commit may coexist with failing tests. A task may
not implement incidentally an AC whose RED has not executed.

Planned `package.json` scripts:

| Script | Exact command |
|--------|---------------|
| `test:unit` | `vitest run --project unit` |
| `test:component` | `vitest run --project component` |
| `test:e2e` | `playwright test` |
| `build` | `tsc -b && vite build` |
| `verify:traceability` | `node scripts/verify-traceability.mjs --phase=final` |

`vitest.config.ts` defines a Node project for `src/domain/**/*.test.ts` and a jsdom project for
`src/components/**/*.test.tsx`; both retain a single Vitest configuration boundary.

## Traceability Verifier Design

`scripts/verify-traceability.mjs` is a deterministic, read-only Node script with no network access.
`package.json` will define `"verify:traceability": "node scripts/verify-traceability.mjs --phase=final"`
during setup.

The checker must:

1. Extract the canonical AC set from anchored criterion lines in `spec.md`; reject duplicate,
   malformed or unknown IDs.
2. Require exactly one `traceability.md` row per AC and validate its RED/GREEN tasks, path, exact
   AC-named test, RED evidence, commits and status.
3. Parse `tasks.md`; require at least one `[RED]` and one `[GREEN]` task per AC and explicit AC IDs on
   every user-story task. Reject an unrelated RED block opened before the current block reaches its
   mapped GREEN, while permitting a cohesive block of related RED tasks that share that GREEN.
4. Inspect test declarations only in allowed test paths; reject comments, missing names and unknown ACs.
5. Read `git log --format=%H%x09%s --all`; validate constitutional product subjects against task/AC
   relationships and tooling subjects against task/GATE relationships.
6. Verify the test commit is an ancestor of the implementation commit and require persisted RED
   evidence. Git history alone is not treated as proof that a test failed.
7. Print deterministic errors grouped by artifact and exit non-zero on any missing link.

Optional internal phases may support `--phase=plan` and `--phase=tasks`, but the npm command always
uses `--phase=final`; no partial mode may weaken the Definition of Done.

## Project Structure

### Documentation (this feature)

```text
specs/001-tres-en-raya-web/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── traceability.md
├── checklists/
│   └── requirements.md
├── contracts/
│   ├── domain-contract.md
│   ├── ui-contract.md
│   └── traceability-contract.md
└── tasks.md                    # Generated later by /speckit-tasks
```

### Source Code (repository root)

```text
index.html
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
vitest.config.ts
playwright.config.ts
src/
├── main.tsx
├── App.tsx
├── styles.css
├── domain/
│   ├── game.ts
│   └── game.test.ts
├── components/
│   ├── Board.tsx
│   ├── Board.test.tsx
│   └── GameStatus.tsx
└── test/
    └── setup.ts
tests/
└── e2e/
    └── tic-tac-toe.spec.ts
scripts/
└── verify-traceability.mjs
```

**Structure Decision**: A single client project keeps the domain boundary explicit without adding a
backend or package split. The requested target files remain unchanged; only the minimum Vite,
TypeScript, Vitest and Playwright entry/configuration files are added.

## Phase 0: Research Outcome

[research.md](./research.md) records exact dependency versions, compatibility, reducer choice,
accessibility strategy, test boundaries, zoom validation, dependency locking and Git prerequisites.
All technical unknowns are resolved; there are no clarification markers.

## Phase 1: Design Outcome

- [data-model.md](./data-model.md) defines domain types, invariants and transitions.
- [domain-contract.md](./contracts/domain-contract.md) fixes the pure reducer boundary.
- [ui-contract.md](./contracts/ui-contract.md) fixes component props and semantic behavior.
- [traceability-contract.md](./contracts/traceability-contract.md) fixes verifier inputs and failure rules.
- [traceability.md](./traceability.md) maps all 42 unchanged ACs to exact planned test names.
- [quickstart.md](./quickstart.md) documents setup and final validation commands.

Post-design Constitution Check: PASS. No exception, criterion mutation or unsupported behavior was
introduced. Proceeding to implementation remains prohibited until `/speckit-tasks` creates complete,
ordered RED/GREEN work and `/speckit-analyze` reports no critical issue.
