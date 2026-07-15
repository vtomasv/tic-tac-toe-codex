# Tasks: Tres en Raya web local

**Input**: `specs/001-tres-en-raya-web/spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/`, `quickstart.md` and `traceability.md`

**TDD rule**: Each RED task adds one exact AC-named test, runs it in isolation, records failing
evidence in `specs/001-tres-en-raya-web/traceability.md`, and creates its test commit. A cohesive
RED block is followed immediately by its mapped GREEN; accumulated relevant suites must then pass
before another RED begins. `[SHARED]` GREEN tasks enumerate every inseparable cross-story AC.

**Parallel policy**: No task is marked `[P]`; tasks share tests, implementation, ledger or commit state.

## Phase 1: Setup and auditable artifacts

- [X] T001 Initialize `.git/` and create an empty audit commit; Expected commit: `chore(setup): T001 initialize Git repository`
- [X] T002 Commit the amended source of truth in `specs/001-tres-en-raya-web/spec.md`; Expected commit: `docs(spec): T002 define cohesive shared behavior traceability`
- [X] T003 Commit regenerated planning artifacts in `specs/001-tres-en-raya-web/plan.md`, `specs/001-tres-en-raya-web/research.md`, `specs/001-tres-en-raya-web/contracts/traceability-contract.md`, and `specs/001-tres-en-raya-web/contracts/ui-contract.md`; Expected commit: `docs(plan): T003 regenerate cohesive TDD design`
- [X] T004 Commit executable task artifacts in `specs/001-tres-en-raya-web/tasks.md` and `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `docs(tasks): T004 regenerate ordered RED GREEN work`
- [X] T005 Create exact pinned dependencies and scripts in `package.json` and `package-lock.json` for Node.js 24.18.0; Expected commit: `chore(setup): T005 pin project dependencies and lockfile`
- [X] T006 Configure strict TypeScript and the Vite shell in `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `vite.config.ts`, and `src/main.tsx`; Expected commit: `chore(setup): T006 configure strict Vite client shell`
- [X] T007 Configure Vitest and Playwright in `vitest.config.ts`, `src/test/setup.ts`, and `playwright.config.ts`, and create `.gitignore`; Expected commit: `chore(test): T007 configure test runners and ignores`

## Phase 2: Foundational traceability gate

- [X] T008 [GATE:GATE-TRACEABILITY-001] [RED] Add `GATE-TRACEABILITY-001 rejects an unrelated RED before a shared GREEN closes its block` to `scripts/verify-traceability.test.mjs`, run `node --test --test-name-pattern='unrelated RED' scripts/verify-traceability.test.mjs`, record RED evidence in `specs/001-tres-en-raya-web/traceability.md`, and commit only the test and evidence; Expected commit: `test(tooling): T008 reject open unrelated RED blocks [GATE-TRACEABILITY-001]`
- [X] T009 [GATE:GATE-TRACEABILITY-001] [GREEN] Implement cohesive shared-block validation in `scripts/verify-traceability.mjs`, wire `verify:traceability` in `package.json`, run `node --test scripts/verify-traceability.test.mjs` and `node scripts/verify-traceability.mjs --phase=tasks`; Expected commit: `feat(tooling): T009 enforce cohesive shared RED GREEN blocks [GATE-TRACEABILITY-001]`

## Phase 3: US-001 and shared board foundations (Priority: P1)

**Independent Test**: Start from an empty X game, exercise a legal X/O sequence and reject an occupied cell without reaching a terminal state.

### Initial state block

- [X] T010 [US1] [AC:AC-US1-ESTADO-001] [RED] Add `AC-US1-ESTADO-001 inicia en PLAYING_X` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T010 prove initial PLAYING_X is missing [AC-US1-ESTADO-001]`
- [X] T011 [US1] [AC:AC-US1-ESTADO-010] [RED] Add `AC-US1-ESTADO-010 inicia con nueve celdas vacías` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T011 prove empty initial board is missing [AC-US1-ESTADO-010]`
- [ ] T012 [US1] [AC:AC-US1-ESTADO-001,AC-US1-ESTADO-010] [GREEN] Define immutable types and `INITIAL_STATE` in `src/domain/game.ts`, run mapped tests and the accumulated unit suite; Expected commit: `feat(US1): T012 initialize canonical game state [AC-US1-ESTADO-001 AC-US1-ESTADO-010]`

### Shared board structure block

- [ ] T013 [US1] [AC:AC-US1-DOMINIO-002] [RED] Add `AC-US1-DOMINIO-002 presenta una cuadrícula de tres por tres` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T013 prove three by three board is missing [AC-US1-DOMINIO-002]`
- [ ] T014 [US3] [AC:AC-US3-INTERACCION-001] [RED] Add `AC-US3-INTERACCION-001 presenta Reiniciar partida en todos los estados` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US3): T014 prove restart action is missing [AC-US3-INTERACCION-001]`
- [ ] T015 [US4] [AC:AC-US4-TECLADO-005] [RED] Add `AC-US4-TECLADO-005 ordena el foco por filas y después por reinicio` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T015 prove row-major focus order is missing [AC-US4-TECLADO-005]`
- [ ] T016 [US4] [AC:AC-US4-FOCO-006] [RED] Add `AC-US4-FOCO-006 muestra un contorno continuo en el control enfocado` to `src/components/Board.test.tsx` and `tests/e2e/tic-tac-toe.spec.ts`, run filtered tests and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T016 prove focus outline is missing [AC-US4-FOCO-006]`
- [ ] T017 [US4] [AC:AC-US4-A11Y-008] [RED] Add `AC-US4-A11Y-008 expone el tablero como cuadrícula de tres por tres` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T017 prove grid semantics are missing [AC-US4-A11Y-008]`
- [ ] T018 [US4] [AC:AC-US4-A11Y-009] [RED] Add `AC-US4-A11Y-009 expone fila columna y contenido en el nombre de cada celda` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T018 prove cell accessible names are missing [AC-US4-A11Y-009]`
- [ ] T019 [US4] [AC:AC-US4-RESPONSIVE-013] [RED] Add `AC-US4-RESPONSIVE-013 evita superposición de controles con ampliación del 200 por ciento` to `tests/e2e/tic-tac-toe.spec.ts`, run its filtered E2E test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T019 prove zoom overlap protection is missing [AC-US4-RESPONSIVE-013]`
- [ ] T020 [US4] [AC:AC-US4-VISUAL-017] [RED] Add `AC-US4-VISUAL-017 muestra un contorno al apuntar una celda vacía` to `src/components/Board.test.tsx` and `tests/e2e/tic-tac-toe.spec.ts`, run filtered tests and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T020 prove playable hover outline is missing [AC-US4-VISUAL-017]`
- [ ] T021 [US4] [AC:AC-US4-A11Y-020] [RED] Add `AC-US4-A11Y-020 expone las celdas como no disponibles en estados terminales` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T021 prove terminal unavailable semantics are missing [AC-US4-A11Y-020]`
- [ ] T022 [SHARED] [US1] [AC:AC-US1-DOMINIO-002,AC-US3-INTERACCION-001,AC-US4-TECLADO-005,AC-US4-FOCO-006,AC-US4-A11Y-008,AC-US4-A11Y-009,AC-US4-RESPONSIVE-013,AC-US4-VISUAL-017,AC-US4-A11Y-020] [GREEN] Build the static accessible board, restart control and responsive visual foundation in `src/components/Board.tsx`, `src/App.tsx`, and `src/styles.css`; run mapped component/E2E tests and accumulated suites; Expected commit: `feat(US1): T022 build accessible board foundation [AC-US1-DOMINIO-002 AC-US3-INTERACCION-001 AC-US4-TECLADO-005 AC-US4-FOCO-006 AC-US4-A11Y-008 AC-US4-A11Y-009 AC-US4-RESPONSIVE-013 AC-US4-VISUAL-017 AC-US4-A11Y-020]`

### Shared legal activation block

- [ ] T023 [US1] [AC:AC-US1-INTERACCION-003] [RED] Add `AC-US1-INTERACCION-003 coloca la marca del jugador del turno en una celda vacía` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T023 prove visible legal mark placement is missing [AC-US1-INTERACCION-003]`
- [ ] T024 [US1] [AC:AC-US1-ESTADO-004] [RED] Add `AC-US1-ESTADO-004 cambia de X a PLAYING_O tras una jugada no terminal` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T024 prove X to O transition is missing [AC-US1-ESTADO-004]`
- [ ] T025 [US1] [AC:AC-US1-ESTADO-005] [RED] Add `AC-US1-ESTADO-005 cambia de O a PLAYING_X tras una jugada no terminal` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T025 prove O to X transition is missing [AC-US1-ESTADO-005]`
- [ ] T026 [US1] [AC:AC-US1-UNWANTED-006] [RED] Add `AC-US1-UNWANTED-006 conserva el tablero al activar una celda ocupada` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T026 prove occupied board guard is missing [AC-US1-UNWANTED-006]`
- [ ] T027 [US1] [AC:AC-US1-UNWANTED-007] [RED] Add `AC-US1-UNWANTED-007 conserva el estado al activar una celda ocupada` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T027 prove occupied state guard is missing [AC-US1-UNWANTED-007]`
- [ ] T028 [US4] [AC:AC-US4-INTERACCION-001] [RED] Add `AC-US4-INTERACCION-001 activa una celda vacía mediante clic` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T028 prove click activation is missing [AC-US4-INTERACCION-001]`
- [ ] T029 [US4] [AC:AC-US4-INTERACCION-002] [RED] Add `AC-US4-INTERACCION-002 activa una celda vacía mediante toque` to `tests/e2e/tic-tac-toe.spec.ts`, run its filtered E2E test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T029 prove touch activation is missing [AC-US4-INTERACCION-002]`
- [ ] T030 [US4] [AC:AC-US4-TECLADO-003] [RED] Add `AC-US4-TECLADO-003 activa una celda vacía mediante Enter` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T030 prove Enter activation is missing [AC-US4-TECLADO-003]`
- [ ] T031 [US4] [AC:AC-US4-TECLADO-004] [RED] Add `AC-US4-TECLADO-004 activa una celda vacía mediante Espacio` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T031 prove Space activation is missing [AC-US4-TECLADO-004]`
- [ ] T032 [US4] [AC:AC-US4-UNWANTED-015] [RED] Add `AC-US4-UNWANTED-015 acepta Enter y Espacio sin puntero` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T032 prove pointer-free activation is missing [AC-US4-UNWANTED-015]`
- [ ] T033 [US4] [AC:AC-US4-FOCO-007] [RED] Add `AC-US4-FOCO-007 conserva el foco al rechazar una celda ocupada` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T033 prove rejected-cell focus preservation is missing [AC-US4-FOCO-007]`
- [ ] T034 [US4] [AC:AC-US4-VISUAL-018] [RED] Add `AC-US4-VISUAL-018 muestra el símbolo correspondiente dentro de una celda marcada` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T034 prove textual cell marks are missing [AC-US4-VISUAL-018]`
- [ ] T035 [SHARED] [US1] [AC:AC-US1-INTERACCION-003,AC-US1-ESTADO-004,AC-US1-ESTADO-005,AC-US1-UNWANTED-006,AC-US1-UNWANTED-007,AC-US4-INTERACCION-001,AC-US4-INTERACCION-002,AC-US4-TECLADO-003,AC-US4-TECLADO-004,AC-US4-UNWANTED-015,AC-US4-FOCO-007,AC-US4-VISUAL-018] [GREEN] Implement guarded legal `PLAY_CELL`, alternation and native button activation in `src/domain/game.ts`, `src/components/Board.tsx`, and `src/App.tsx`; run mapped unit/component/E2E tests and accumulated suites; Expected commit: `feat(US1): T035 implement native legal turns [AC-US1-INTERACCION-003 AC-US1-ESTADO-004 AC-US1-ESTADO-005 AC-US1-UNWANTED-006 AC-US1-UNWANTED-007 AC-US4-INTERACCION-001 AC-US4-INTERACCION-002 AC-US4-TECLADO-003 AC-US4-TECLADO-004 AC-US4-UNWANTED-015 AC-US4-FOCO-007 AC-US4-VISUAL-018]`

### Shared canonical status block

- [ ] T036 [US1] [AC:AC-US1-ESTADO-008] [RED] Add `AC-US1-ESTADO-008 identifica a X durante PLAYING_X` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T036 prove X turn status is missing [AC-US1-ESTADO-008]`
- [ ] T037 [US1] [AC:AC-US1-ESTADO-009] [RED] Add `AC-US1-ESTADO-009 identifica a O durante PLAYING_O` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US1): T037 prove O turn status is missing [AC-US1-ESTADO-009]`
- [ ] T038 [US2] [AC:AC-US2-ESTADO-003] [RED] Add `AC-US2-ESTADO-003 identifica a X como ganador en WON_X` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T038 prove X winner status is missing [AC-US2-ESTADO-003]`
- [ ] T039 [US2] [AC:AC-US2-ESTADO-004] [RED] Add `AC-US2-ESTADO-004 identifica a O como ganador en WON_O` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T039 prove O winner status is missing [AC-US2-ESTADO-004]`
- [ ] T040 [US2] [AC:AC-US2-ESTADO-006] [RED] Add `AC-US2-ESTADO-006 identifica el resultado como empate en DRAW` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T040 prove draw status is missing [AC-US2-ESTADO-006]`
- [ ] T041 [US4] [AC:AC-US4-VISUAL-014] [RED] Add `AC-US4-VISUAL-014 comunica la información esencial sin depender del color` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T041 prove non-color status communication is missing [AC-US4-VISUAL-014]`
- [ ] T042 [SHARED] [US1] [AC:AC-US1-ESTADO-008,AC-US1-ESTADO-009,AC-US2-ESTADO-003,AC-US2-ESTADO-004,AC-US2-ESTADO-006,AC-US4-VISUAL-014] [GREEN] Implement visible text for all canonical states in `src/components/GameStatus.tsx`, `src/App.tsx`, and `src/styles.css`; run mapped component tests and the accumulated component suite; Expected commit: `feat(US1): T042 present every canonical status [AC-US1-ESTADO-008 AC-US1-ESTADO-009 AC-US2-ESTADO-003 AC-US2-ESTADO-004 AC-US2-ESTADO-006 AC-US4-VISUAL-014]`

## Phase 4: US-002 terminal outcomes (Priority: P2)

**Independent Test**: Evaluate eight winning lines for X/O, draw precedence and terminal no-op behavior.

- [ ] T043 [US2] [AC:AC-US2-DOMINIO-001] [RED] Add `AC-US2-DOMINIO-001 detecta las ocho líneas ganadoras de X` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T043 prove X win detection is missing [AC-US2-DOMINIO-001]`
- [ ] T044 [US2] [AC:AC-US2-DOMINIO-002] [RED] Add `AC-US2-DOMINIO-002 detecta las ocho líneas ganadoras de O` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T044 prove O win detection is missing [AC-US2-DOMINIO-002]`
- [ ] T045 [US2] [AC:AC-US2-DOMINIO-001,AC-US2-DOMINIO-002] [GREEN] Centralize eight `WINNING_LINES` and resolve `WON_X`/`WON_O` in `src/domain/game.ts`; run mapped tests and accumulated unit suite; Expected commit: `feat(US2): T045 detect all winning lines [AC-US2-DOMINIO-001 AC-US2-DOMINIO-002]`
- [ ] T046 [US2] [AC:AC-US2-DOMINIO-005] [RED] Add `AC-US2-DOMINIO-005 resuelve DRAW en la novena jugada sin línea ganadora` including ninth-move victory precedence to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T046 prove draw resolution is missing [AC-US2-DOMINIO-005]`
- [ ] T047 [US2] [AC:AC-US2-DOMINIO-005] [GREEN] Resolve `DRAW` only after victory evaluation in `src/domain/game.ts`; run mapped tests and accumulated unit suite; Expected commit: `feat(US2): T047 resolve draw after victory [AC-US2-DOMINIO-005]`
- [ ] T048 [US2] [AC:AC-US2-UNWANTED-007] [RED] Add `AC-US2-UNWANTED-007 conserva el tablero en estados terminales` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T048 prove terminal board guard is missing [AC-US2-UNWANTED-007]`
- [ ] T049 [US2] [AC:AC-US2-UNWANTED-008] [RED] Add `AC-US2-UNWANTED-008 conserva el estado terminal vigente` to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US2): T049 prove terminal status guard is missing [AC-US2-UNWANTED-008]`
- [ ] T050 [US2] [AC:AC-US2-UNWANTED-007,AC-US2-UNWANTED-008] [GREEN] Add terminal `PLAY_CELL` no-op guards in `src/domain/game.ts`; run mapped tests and accumulated unit suite; Expected commit: `feat(US2): T050 block terminal moves [AC-US2-UNWANTED-007 AC-US2-UNWANTED-008]`

## Phase 5: US-003 reset and responsive completion (Priority: P3)

**Independent Test**: Reset from every canonical state and verify empty X state, first-cell focus and boundary-width operability.

- [ ] T051 [US3] [AC:AC-US3-ESTADO-002] [RED] Add `AC-US3-ESTADO-002 vacía las nueve celdas al reiniciar` for all states to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US3): T051 prove reset board behavior is missing [AC-US3-ESTADO-002]`
- [ ] T052 [US3] [AC:AC-US3-ESTADO-003] [RED] Add `AC-US3-ESTADO-003 vuelve a PLAYING_X al reiniciar` for all states to `src/domain/game.test.ts`, run its filtered unit test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US3): T052 prove reset status behavior is missing [AC-US3-ESTADO-003]`
- [ ] T053 [US3] [AC:AC-US3-FOCO-004] [RED] Add `AC-US3-FOCO-004 mueve el foco a la primera celda al reiniciar` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US3): T053 prove reset focus behavior is missing [AC-US3-FOCO-004]`
- [ ] T054 [US4] [AC:AC-US4-TECLADO-016] [RED] Add `AC-US4-TECLADO-016 reinicia mediante Enter y Espacio` to `src/components/Board.test.tsx` and `tests/e2e/tic-tac-toe.spec.ts`, run filtered tests and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T054 prove keyboard restart is missing [AC-US4-TECLADO-016]`
- [ ] T055 [US4] [AC:AC-US4-RESPONSIVE-012] [RED] Add `AC-US4-RESPONSIVE-012 evita desplazamiento horizontal entre 320 y 1920 píxeles` with cell/reset operability to `tests/e2e/tic-tac-toe.spec.ts`, run its filtered E2E test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T055 prove responsive operability is missing [AC-US4-RESPONSIVE-012]`
- [ ] T056 [SHARED] [US3] [AC:AC-US3-ESTADO-002,AC-US3-ESTADO-003,AC-US3-FOCO-004,AC-US4-TECLADO-016,AC-US4-RESPONSIVE-012] [GREEN] Implement pure `RESET`, native restart, first-cell focus and boundary responsive behavior in `src/domain/game.ts`, `src/components/Board.tsx`, `src/App.tsx`, and `src/styles.css`; run mapped unit/component/E2E tests and accumulated suites; Expected commit: `feat(US3): T056 implement accessible responsive restart [AC-US3-ESTADO-002 AC-US3-ESTADO-003 AC-US3-FOCO-004 AC-US4-TECLADO-016 AC-US4-RESPONSIVE-012]`

## Phase 6: US-004 assistive announcements (Priority: P4)

**Independent Test**: Render each canonical state directly and inspect the single polite live-region contract.

- [ ] T057 [US4] [AC:AC-US4-A11Y-010] [RED] Add `AC-US4-A11Y-010 anuncia el jugador del nuevo turno` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T057 prove turn announcement is missing [AC-US4-A11Y-010]`
- [ ] T058 [US4] [AC:AC-US4-A11Y-011] [RED] Add `AC-US4-A11Y-011 anuncia el resultado terminal` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T058 prove terminal announcement is missing [AC-US4-A11Y-011]`
- [ ] T059 [US4] [AC:AC-US4-A11Y-019] [RED] Add `AC-US4-A11Y-019 anuncia el turno de X al comenzar y reiniciar` to `src/components/Board.test.tsx`, run its filtered component test and record RED evidence in `specs/001-tres-en-raya-web/traceability.md`; Expected commit: `test(US4): T059 prove initial reset announcement is missing [AC-US4-A11Y-019]`
- [ ] T060 [US4] [AC:AC-US4-A11Y-010,AC-US4-A11Y-011,AC-US4-A11Y-019] [GREEN] Implement one visible polite atomic status region in `src/components/GameStatus.tsx` and deterministic announcement revisions in `src/App.tsx`; run mapped tests and accumulated component/E2E suites; Expected commit: `feat(US4): T060 announce game status changes [AC-US4-A11Y-010 AC-US4-A11Y-011 AC-US4-A11Y-019]`

## Phase 7: Final traceability and Definition of Done

- [ ] T061 Update every AC/GATE row with RED evidence, commit hashes and `VERIFIED` status in `specs/001-tres-en-raya-web/traceability.md`; run `npm run test:unit`, `npm run test:component`, `npm run test:e2e`, `npm run build`, and `npm run verify:traceability`; Expected commit: `docs(traceability): T061 verify complete acceptance coverage`

## Dependencies and execution order

1. T001–T007 establish Git, separated artifacts, locked dependencies and runners.
2. T008 RED and T009 GREEN close the traceability gate before product behavior.
3. Every cohesive RED block above is immediately closed by its mapped GREEN.
4. Shared foundations execute before story-specific terminal, reset and announcement blocks.
5. T061 runs only after every prior task and commit is complete.

```text
Setup → Gate → Initial state → Board foundation → Legal activation → Canonical status
      → Terminal outcomes → Reset/responsive → Announcements → Final DoD
```

## Implementation strategy

The MVP completes through T042: a valid local game surface with canonical visible statuses. Terminal
resolution, reset and announcements then extend it without reopening completed RED blocks.

## Coverage Audit

Every one of the 42 AC-IDs has exactly one RED task and one mapped GREEN task in
`specs/001-tres-en-raya-web/traceability.md`. Shared GREEN tasks T022, T035, T042 and T056 declare
all cross-story ACs they satisfy; no criterion is implemented by an earlier unmapped task.
