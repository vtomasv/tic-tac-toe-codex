# Traceability Ledger: Feature 002 Undo

**Phase**: Implementing

**Canonical criteria**: [spec.md](./spec.md)

**Contract**: [traceability-contract.md](./contracts/traceability-contract.md)

## Pre-swarm contract freeze

Este pase volvió explícitamente a Plan/Tasks para reparar el runner; el contrato de trazabilidad se
amplió con `GATE-SWARM-001`. Dominio y UI no cambiaron.

| Contract | SHA-256 |
|---|---|
| `contracts/domain-contract.md` | `d148f79d15827834867de57c86c4c545906194a6f2225e3d18de01200a3046e8` |
| `contracts/ui-contract.md` | `58307ec5492446d4669dcb6b187b7a30988a61f09bd7f5c41ea47898d051d23e` |
| `contracts/traceability-contract.md` | `9b3c858b46f8217c8710547f5d5129fad03adee2a0289b302c34ec59bbf4eef3` |

## Foundational quality gates

| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---|---|---|---|---|---|---|---|
| GATE-MULTIFEATURE-001 | T062 | T063 | `scripts/verify-traceability.test.mjs` | `2026-07-22 exit 1; 11 tests failed because lifecycle aggregation was absent` | 587accca01f3fc9675d72bd9262a3827ae29800d | 4035eaced59f8933a970b9c238c663bf677fc157 | VERIFIED |
| GATE-MULTIFEATURE-001 | T088 | T089 | `scripts/verify-traceability.test.mjs` | `2026-07-23 exit 1; T005 reported unrelated RED T004` | e17b047b47effcd44d1970dc7398e36a825ab5aa | 652c7d1d694961b1da55ed1914a96280cdf7a340 | VERIFIED |
| GATE-SWARM-001 | T090 | T091 | `scripts/swarm.test.mjs` | `2026-07-23 exit 1; PROMPT_ROOT did not match the versioned .prompts root` | f113f2a388990246e55762b77fcf5bb85f8a2dd6 | fd3ba03d65f24a9d026dfb864a0de468ec1fd827 | VERIFIED |
| GATE-SWARM-001 | T105 | T106 | `scripts/swarm.test.mjs` | `2026-07-23 exit 1; link_dependencies was absent` | 86a548a40f835d28b94f995c0b30ed56af7d97b2 | d17aeb7a887b49d1b6bd39ac6e851dc13e8dd8d1 | VERIFIED |
| GATE-SWARM-001 | T110 | T111 | `scripts/swarm.test.mjs` | `2026-07-23 exit 1; unsupported --ask-for-approval remained` | b88d09d30bb1847b8121a4d1f040bf91481bb54c | e22e9c5593fc0f8f7d51c897060ffb2f02bb98ab | VERIFIED |
| GATE-SWARM-001 | T113 | T114 | `scripts/swarm.test.mjs` | `2026-07-23 exit 1; nounset-unsafe dependent local declaration remained` | d70abc15b8f3cd7885c56a5dcffc48ed27017b03 | c2c4245cf8ec4317b16883c686ee16002b32c0cc | VERIFIED |
| GATE-SWARM-001 | T116 | T117 | `scripts/swarm.test.mjs` | `2026-07-23 exit 1; linked worktree writable roots and blocked-handoff propagation were absent` | e76f66e7f543df2da0ddb094b9498473c53fe361 | 5559190e25ea0c15801f914516d819c4306e5df8 | VERIFIED |

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

- Analyze C concluyó GO sin CRITICAL/HIGH y T090/T091/T092 quedaron integradas.
- El preflight posterior detectó que los worktrees no heredan `node_modules`; este retorno explícito
  a Plan/Tasks conserva T092 como evidencia histórica y vuelve temporalmente a `Planned`.
- Analyze D concluyó GO sin CRITICAL/HIGH; T105/T106 están integradas y T109 restauró
  `Implementing`.
- La inspección posterior de `codex exec --help` detectó una opción inexistente; este retorno
  explícito volvió a `Planned`; Analyze E dio GO y T110/T111/T112 restauraron `Implementing`.
- El primer `launch-parallel` real abortó antes de crear worktrees por una expansión local bajo
  `set -u`; Analyze F dio GO y T113/T114/T115 restauraron `Implementing`.
- El segundo fan-out alcanzó RED en ambos roles, pero los sandboxes no pudieron escribir el Git
  común ni la caché de Vite; ambos devolvieron `REQUEST_ORCHESTRATOR` con exit `0`. Este retorno
  explícito volvió a `Planned`; Analyze G y T116/T117/T118 restauraron `Implementing`.
- Los workers no editan este archivo; T097/T098 consolidan evidencia desde handoffs y git log.
- `Release_Candidate` y `Verified` exigen cero `PENDING`.
