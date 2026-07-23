# Traceability Ledger: Feature 002 Undo

**Phase**: Planned

**Canonical criteria**: [spec.md](./spec.md)

**Contract**: [traceability-contract.md](./contracts/traceability-contract.md)

## Pre-swarm contract freeze

Este pase volvió explícitamente a Plan/Tasks para reparar el runner; el contrato de trazabilidad se
amplió con `GATE-SWARM-001`. Dominio y UI no cambiaron.

| Contract | SHA-256 |
|---|---|
| `contracts/domain-contract.md` | `d148f79d15827834867de57c86c4c545906194a6f2225e3d18de01200a3046e8` |
| `contracts/ui-contract.md` | `58307ec5492446d4669dcb6b187b7a30988a61f09bd7f5c41ea47898d051d23e` |
| `contracts/traceability-contract.md` | `9bf7992e5961490e37d51175653c083dd940f311e272f2bcd056786ab2a6dd05` |

## Foundational quality gates

| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---|---|---|---|---|---|---|---|
| GATE-MULTIFEATURE-001 | T062 | T063 | `scripts/verify-traceability.test.mjs` | `2026-07-22 exit 1; 11 tests failed because lifecycle aggregation was absent` | 587accca01f3fc9675d72bd9262a3827ae29800d | 4035eaced59f8933a970b9c238c663bf677fc157 | VERIFIED |
| GATE-MULTIFEATURE-001 | T088 | T089 | `scripts/verify-traceability.test.mjs` | `2026-07-23 exit 1; T005 reported unrelated RED T004` | e17b047b47effcd44d1970dc7398e36a825ab5aa | 652c7d1d694961b1da55ed1914a96280cdf7a340 | VERIFIED |
| GATE-SWARM-001 | T090 | T091 | `scripts/swarm.test.mjs` | PENDING | PENDING | PENDING | PENDING |

## Acceptance evidence

Cada fila representa un par RED/GREEN auditable. Los pares suplementarios de integración/E2E no
reemplazan la evidencia primaria.

| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |
|---|---|---|---|---|---|---|---|---|---|
| AC-US5-INTERACCION-001 | T080 | T086 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-001 muestra Deshacer jugada en cada estado canónico` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-INTERACCION-002 | T080 | T086 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-002 ubica Undo entre tablero y Reiniciar partida` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-003 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-003 | T080 | T086 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-DISPONIBILIDAD-003 habilita Undo después de una jugada legal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-004 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-004 | T080 | T086 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-DISPONIBILIDAD-004 mantiene Undo no disponible con historial vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-005 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-005 | T081 | T087 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-DOMINIO-005 restaura las nueve celdas en la composición real` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-006 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-006 | T081 | T087 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-ESTADO-006 restaura por separado el estado en la composición real` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-007 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-007 | T081 | T087 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-ESTADO-007 muestra el turno del jugador cuya jugada se retira` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-008 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-008 | T081 | T087 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-DOMINIO-008 elimina una sola marca en la composición real` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TERMINAL-009 | T068 | T069 | Domain | `src/domain/game.test.ts` | `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TERMINAL-009 | T082 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-TERMINAL-009 recupera juego desde los tres estados terminales` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-010 | T070 | T071 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-010 | T082 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-010 deshace repetidamente en el navegador` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-011 | T070 | T071 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-011 | T082 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-011 llega al tablero inicial en el navegador` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-012 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-012 | T082 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-UNWANTED-012 conserva el tablero en Undo vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-013 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-013 | T082 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-UNWANTED-013 conserva el status en Undo vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-014 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-014 | T082 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-UNWANTED-014 mantiene Undo no disponible después del no-op` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-015 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-015 | T083 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-015 crea un único punto por jugada legal en navegador` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-016 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-016 | T083 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-016 ignora intento en celda ocupada para Undo` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-017 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-017 | T083 | T103 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-017 ignora intento terminal para Undo` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-018 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-018 RESET deja nueve celdas vacías` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-018 | T083 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESET-018 reset deja tablero vacío en navegador` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-019 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-019 RESET restaura PLAYING_X` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-019 | T083 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESET-019 reset restaura turno X en navegador` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-020 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-020 | T083 | T093 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESET-020 reset impide recuperar la partida anterior` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-PUNTERO-021 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-PUNTERO-021 | T084 | T104 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-PUNTERO-021 clic deshace una sola jugada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-PUNTERO-022 | T084 | T104 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-PUNTERO-022 toque real deshace una jugada legal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-023 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-023 | T084 | T104 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-TECLADO-023 Enter deshace una jugada en App` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-024 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-024 | T084 | T104 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-TECLADO-024 Espacio deshace una jugada en App` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-025 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-025 | T084 | T094 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-FOCO-025 mantiene foco en Deshacer jugada después de Undo` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-026 | T080 | T086 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-FOCO-026 ordena nueve celdas Undo y Reiniciar en la secuencia de foco` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-027 | T085 | T101 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-FOCO-027 muestra contorno continuo al enfocar Deshacer jugada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-028 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-028 | T084 | T094 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-028 conserva nombre exacto en App` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-029 | T095 | T096 | Component | `src/components/GameStatus.test.tsx` | `AC-US5-A11Y-029 acepta anuncio exacto Jugada deshecha Turno de X` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-029 | T084 | T094 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-029 anuncia exactamente Jugada deshecha Turno de X` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-030 | T095 | T096 | Component | `src/components/GameStatus.test.tsx` | `AC-US5-A11Y-030 acepta anuncio exacto Jugada deshecha Turno de O` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-030 | T084 | T094 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-030 anuncia exactamente Jugada deshecha Turno de O` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-031 | T084 | T094 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-031 no cambia la región de estado al intentar Undo vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESPONSIVE-032 | T085 | T101 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-032 evita overflow horizontal entre 320 y 1920 px` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESPONSIVE-033 | T085 | T101 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-033 evita superposición de controles con zoom 200 por ciento` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-VISUAL-034 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-VISUAL-034 | T085 | T101 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-VISUAL-034 mantiene señal textual no cromática` | PENDING | PENDING | PENDING | PENDING |

## Update policy

- Analyze C valida este ledger todavía `Planned`.
- Solo un GO sin CRITICAL/HIGH autoriza T090/T091.
- T092 cambia a `Implementing` y revalida los hashes congelados antes del baseline y `prepare`.
- Los workers no editan este archivo; T097/T098 consolidan evidencia desde handoffs y git log.
- `Release_Candidate` y `Verified` exigen cero `PENDING`.
