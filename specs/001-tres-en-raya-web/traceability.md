# Traceability Ledger: Tres en Raya web local

**Phase**: Tasks

**Canonical criteria**: [spec.md](./spec.md)

**Contract**: [traceability-contract.md](./contracts/traceability-contract.md)

This ledger preserves all 42 AC-IDs unchanged. RED/GREEN task IDs come from `tasks.md`; evidence and
commit hashes remain `PENDING` until `/speckit-implement` creates them. `PLANNED` is valid before
execution; Definition of Done requires every row to reach `VERIFIED`.

## Foundational Quality Gates

| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---------|----------|------------|-----------|--------------|-------------|-----------------------|--------|
| GATE-TRACEABILITY-001 | T008 | T009 | `scripts/verify-traceability.test.mjs` | `2026-07-14: node@24.18.0 --test --test-name-pattern='unrelated RED' -> exit 1; expected /unrelated RED block/, actual no error` | PENDING | PENDING | PLANNED |

Tooling commits use `(tooling)` with this GATE-ID and never claim a product user story or AC-ID.

| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |
|-------|----------|------------|---------------|-----------|-------------------------|--------------|-------------|-----------------------|--------|
| AC-US1-ESTADO-001 | T010 | T012 | Domain | `src/domain/game.test.ts` | `AC-US1-ESTADO-001 inicia en PLAYING_X` | `2026-07-14: test:unit -t AC-US1-ESTADO-001 -> exit 1; Cannot find module ./game` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-DOMINIO-002 | T013 | T022 | Component | `src/components/Board.test.tsx` | `AC-US1-DOMINIO-002 presenta una cuadrícula de tres por tres` | `2026-07-14: test:component -t AC-US1-DOMINIO-002 -> exit 1; missing src/App.tsx` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-INTERACCION-003 | T023 | T035 | Component | `src/components/Board.test.tsx` | `AC-US1-INTERACCION-003 coloca la marca del jugador del turno en una celda vacía` | `2026-07-14: test:component -t AC-US1-INTERACCION-003 -> exit 1; X mark absent after click` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-ESTADO-004 | T024 | T035 | Domain | `src/domain/game.test.ts` | `AC-US1-ESTADO-004 cambia de X a PLAYING_O tras una jugada no terminal` | `2026-07-14: FAIL — TypeError: gameReducer is not a function` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-ESTADO-005 | T025 | T035 | Domain | `src/domain/game.test.ts` | `AC-US1-ESTADO-005 cambia de O a PLAYING_X tras una jugada no terminal` | `2026-07-14: FAIL — TypeError: gameReducer is not a function` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-UNWANTED-006 | T026 | T035 | Domain | `src/domain/game.test.ts` | `AC-US1-UNWANTED-006 conserva el tablero al activar una celda ocupada` | `2026-07-14: FAIL — TypeError: gameReducer is not a function` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-UNWANTED-007 | T027 | T035 | Domain | `src/domain/game.test.ts` | `AC-US1-UNWANTED-007 conserva el estado al activar una celda ocupada` | `2026-07-14: FAIL — TypeError: gameReducer is not a function` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-ESTADO-008 | T036 | T042 | Component | `src/components/Board.test.tsx` | `AC-US1-ESTADO-008 identifica a X durante PLAYING_X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-ESTADO-009 | T037 | T042 | Component | `src/components/Board.test.tsx` | `AC-US1-ESTADO-009 identifica a O durante PLAYING_O` | PENDING | PENDING | PENDING | PLANNED |
| AC-US1-ESTADO-010 | T011 | T012 | Domain | `src/domain/game.test.ts` | `AC-US1-ESTADO-010 inicia con nueve celdas vacías` | `2026-07-14: test:unit -t AC-US1-ESTADO-010 -> exit 1; Cannot find module ./game` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-DOMINIO-001 | T043 | T045 | Domain | `src/domain/game.test.ts` | `AC-US2-DOMINIO-001 detecta las ocho líneas ganadoras de X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-DOMINIO-002 | T044 | T045 | Domain | `src/domain/game.test.ts` | `AC-US2-DOMINIO-002 detecta las ocho líneas ganadoras de O` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-ESTADO-003 | T038 | T042 | Component | `src/components/Board.test.tsx` | `AC-US2-ESTADO-003 identifica a X como ganador en WON_X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-ESTADO-004 | T039 | T042 | Component | `src/components/Board.test.tsx` | `AC-US2-ESTADO-004 identifica a O como ganador en WON_O` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-DOMINIO-005 | T046 | T047 | Domain | `src/domain/game.test.ts` | `AC-US2-DOMINIO-005 resuelve DRAW en la novena jugada sin línea ganadora` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-ESTADO-006 | T040 | T042 | Component | `src/components/Board.test.tsx` | `AC-US2-ESTADO-006 identifica el resultado como empate en DRAW` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-UNWANTED-007 | T048 | T050 | Domain | `src/domain/game.test.ts` | `AC-US2-UNWANTED-007 conserva el tablero en estados terminales` | PENDING | PENDING | PENDING | PLANNED |
| AC-US2-UNWANTED-008 | T049 | T050 | Domain | `src/domain/game.test.ts` | `AC-US2-UNWANTED-008 conserva el estado terminal vigente` | PENDING | PENDING | PENDING | PLANNED |
| AC-US3-INTERACCION-001 | T014 | T022 | Component | `src/components/Board.test.tsx` | `AC-US3-INTERACCION-001 presenta Reiniciar partida en todos los estados` | `2026-07-14: test:component -t AC-US3-INTERACCION-001 -> exit 1; missing src/App.tsx` | PENDING | PENDING | PENDING | PLANNED |
| AC-US3-ESTADO-002 | T051 | T056 | Domain | `src/domain/game.test.ts` | `AC-US3-ESTADO-002 vacía las nueve celdas al reiniciar` | PENDING | PENDING | PENDING | PLANNED |
| AC-US3-ESTADO-003 | T052 | T056 | Domain | `src/domain/game.test.ts` | `AC-US3-ESTADO-003 vuelve a PLAYING_X al reiniciar` | PENDING | PENDING | PENDING | PLANNED |
| AC-US3-FOCO-004 | T053 | T056 | Component | `src/components/Board.test.tsx` | `AC-US3-FOCO-004 mueve el foco a la primera celda al reiniciar` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-INTERACCION-001 | T028 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-INTERACCION-001 activa una celda vacía mediante clic` | `2026-07-14: FAIL — no se encontró la celda marcada con X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-INTERACCION-002 | T029 | T035 | E2E | `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-INTERACCION-002 activa una celda vacía mediante toque` | `2026-07-14: FAIL — tap no produjo la marca X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-TECLADO-003 | T030 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-TECLADO-003 activa una celda vacía mediante Enter` | `2026-07-14: FAIL — Enter no produjo la marca X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-TECLADO-004 | T031 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-TECLADO-004 activa una celda vacía mediante Espacio` | `2026-07-14: FAIL — Espacio no produjo la marca X` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-TECLADO-005 | T015 | T022 | Component | `src/components/Board.test.tsx` | `AC-US4-TECLADO-005 ordena el foco por filas y después por reinicio` | `2026-07-14: test:component -t AC-US4-TECLADO-005 -> exit 1; missing src/App.tsx` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-FOCO-006 | T016 | T022 | Component + E2E | `src/components/Board.test.tsx`; `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-FOCO-006 muestra un contorno continuo en el control enfocado` | `2026-07-14: component and E2E filtered tests -> exit 1; App/cell absent and locator timed out` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-FOCO-007 | T033 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-FOCO-007 conserva el foco al rechazar una celda ocupada` | `2026-07-14: FAIL — la celda ocupada invocó onCellActivate` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-008 | T017 | T022 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-008 expone el tablero como cuadrícula de tres por tres` | `2026-07-14: test:component -t AC-US4-A11Y-008 -> exit 1; missing src/App.tsx` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-009 | T018 | T022 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-009 expone fila columna y contenido en el nombre de cada celda` | `2026-07-14: test:component -t AC-US4-A11Y-009 -> exit 1; missing src/App.tsx` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-010 | T057 | T060 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-010 anuncia el jugador del nuevo turno` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-011 | T058 | T060 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-011 anuncia el resultado terminal` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-RESPONSIVE-012 | T055 | T056 | E2E | `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-RESPONSIVE-012 evita desplazamiento horizontal entre 320 y 1920 píxeles` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-RESPONSIVE-013 | T019 | T022 | E2E | `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-RESPONSIVE-013 evita superposición de controles con ampliación del 200 por ciento` | `2026-07-14: test:e2e -g AC-US4-RESPONSIVE-013 -> exit 1; expected 10 controls, received 0` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-VISUAL-014 | T041 | T042 | Component | `src/components/Board.test.tsx` | `AC-US4-VISUAL-014 comunica la información esencial sin depender del color` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-UNWANTED-015 | T032 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-UNWANTED-015 acepta Enter y Espacio sin puntero` | `2026-07-14: FAIL — la activación sin puntero no produjo X ni O` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-TECLADO-016 | T054 | T056 | Component + E2E | `src/components/Board.test.tsx`; `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-TECLADO-016 reinicia mediante Enter y Espacio` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-VISUAL-017 | T020 | T022 | Component + E2E | `src/components/Board.test.tsx`; `tests/e2e/tic-tac-toe.spec.ts` | `AC-US4-VISUAL-017 muestra un contorno al apuntar una celda vacía` | `2026-07-14: component and E2E filtered tests -> exit 1; missing App/cell and hover timed out` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-VISUAL-018 | T034 | T035 | Component | `src/components/Board.test.tsx` | `AC-US4-VISUAL-018 muestra el símbolo correspondiente dentro de una celda marcada` | `2026-07-14: FAIL — las jugadas no mostraron los símbolos X y O` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-019 | T059 | T060 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-019 anuncia el turno de X al comenzar y reiniciar` | PENDING | PENDING | PENDING | PLANNED |
| AC-US4-A11Y-020 | T021 | T022 | Component | `src/components/Board.test.tsx` | `AC-US4-A11Y-020 expone las celdas como no disponibles en estados terminales` | `2026-07-14: test:component -t AC-US4-A11Y-020 -> exit 1; missing src/components/Board.tsx` | PENDING | PENDING | PENDING | PLANNED |

## Planned Coverage Summary

- Domain: 13 criteria.
- Component: 26 primary criteria, including three with E2E confirmation.
- E2E primary: 3 criteria.
- Total unique criteria: 42.

Additional multi-criterion E2E flows may strengthen coverage but cannot replace the exact planned
AC-named tests above.
