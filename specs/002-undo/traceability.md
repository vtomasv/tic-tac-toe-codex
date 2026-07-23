# Traceability Ledger: Feature 002 Undo — bootstrap

**Phase**: Planned

**Canonical criteria**: [spec.md](./spec.md)

**Contract**: [traceability-contract.md](./contracts/traceability-contract.md)

Este ledger representa exclusivamente el pase bootstrap anterior a Analyze A. Contiene una fila
canónica por cada uno de los 34 AC y una fila para `GATE-MULTIFEATURE-001`. Cada AC tiene exactamente
un par RED/GREEN; no existe todavía evidencia suplementaria. La fila del gate registra T062/T063
completadas con evidencia y SHAs observados. Las filas de producto permanecen `PENDING` y no están
autorizadas por este pase.

## Foundational Quality Gates

| GATE-ID | RED task | GREEN task | Test file | RED evidence | Test commit | Implementation commit | Status |
|---------|----------|------------|-----------|--------------|-------------|-----------------------|--------|
| GATE-MULTIFEATURE-001 | T062 | T063 | `scripts/verify-traceability.test.mjs` | `2026-07-22: node --test --test-name-pattern='GATE-MULTIFEATURE-001' scripts/verify-traceability.test.mjs -> exit 1; 11 tests failed because multi-feature lifecycle capabilities were absent` | 587accca01f3fc9675d72bd9262a3827ae29800d | 4035eaced59f8933a970b9c238c663bf677fc157 | VERIFIED |

## Canonical acceptance evidence

| AC-ID | RED task | GREEN task | Planned level | Test file | Exact planned test name | RED evidence | Test commit | Implementation commit | Status |
|-------|----------|------------|---------------|-----------|-------------------------|--------------|-------------|-----------------------|--------|
| AC-US5-INTERACCION-001 | T080 | T081 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-001 muestra Deshacer jugada en cada estado canónico` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-INTERACCION-002 | T080 | T081 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-002 ubica Undo entre tablero y Reiniciar partida` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-003 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DISPONIBILIDAD-004 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-005 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-006 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-ESTADO-007 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-DOMINIO-008 | T066 | T067 | Domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TERMINAL-009 | T068 | T069 | Domain | `src/domain/game.test.ts` | `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-010 | T070 | T071 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-011 | T070 | T071 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-012 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-013 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-UNWANTED-014 | T072 | T073 | Domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-015 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-016 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-HISTORIAL-017 | T064 | T065 | Domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-018 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-018 RESET deja nueve celdas vacías` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-019 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-019 RESET restaura PLAYING_X` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESET-020 | T074 | T075 | Domain | `src/domain/game.test.ts` | `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-PUNTERO-021 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-PUNTERO-022 | T084 | T085 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-PUNTERO-022 toque real deshace una jugada legal` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-023 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-TECLADO-024 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-025 | T078 | T079 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-026 | T080 | T081 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-FOCO-026 ordena nueve celdas Undo y Reiniciar en la secuencia de foco` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-FOCO-027 | T086 | T087 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-FOCO-027 muestra contorno continuo al enfocar Deshacer jugada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-028 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-029 | T082 | T083 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-029 anuncia exactamente Jugada deshecha Turno de X` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-030 | T082 | T083 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-030 anuncia exactamente Jugada deshecha Turno de O` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-A11Y-031 | T082 | T083 | Integration | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-031 no cambia la región de estado al intentar Undo vacío` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESPONSIVE-032 | T086 | T087 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-032 evita overflow horizontal entre 320 y 1920 px` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-RESPONSIVE-033 | T086 | T087 | E2E | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-033 evita superposición de controles con zoom 200 por ciento` | PENDING | PENDING | PENDING | PENDING |
| AC-US5-VISUAL-034 | T076 | T077 | Component | `src/components/UndoButton.test.tsx` | `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color` | PENDING | PENDING | PENDING | PENDING |

## Bootstrap update policy

- Analyze A valida esta estructura con `node scripts/verify-traceability.mjs --phase=tasks`.
- Un Analyze A en GO autoriza solo `T062/T063`.
- T062/T063 ya están integradas y su fila contiene evidencia y SHAs reales.
- El segundo pase preserva los pares canónicos, añade evidencia suplementaria con IDs nuevos y
  mantiene la fase `Planned` hasta Analyze B.
- Ningún worker edita este archivo; solo el orquestador consolida evidencia observada.
