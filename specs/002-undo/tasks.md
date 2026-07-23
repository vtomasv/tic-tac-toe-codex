# Tasks: Deshacer la última jugada — pase bootstrap

**Input**: Artefactos de diseño de `specs/002-undo/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/domain-contract.md`, `contracts/ui-contract.md`,
`contracts/traceability-contract.md` y `quickstart.md`

**Lifecycle**: `PLANNED` — primer pase compatible con el verificador vigente.

**Scope guard**: Este pase asigna exactamente un par RED/GREEN canónico a cada AC y reserva
`T062/T063` para `GATE-MULTIFEATURE-001`. Analyze A puede autorizar exclusivamente `T062/T063`.
Ninguna task de producto `T064–T087` puede ejecutarse ni abrir un worktree antes de integrar el gate,
regenerar el pase ampliado, obtener Analyze B en GO y confirmar el baseline verde.

**Tests**: Todo nombre de test indicado contiene literalmente su AC-ID o GATE-ID. Cada RED debe
ejecutarse y registrar fallo por comportamiento ausente antes de su GREEN.

**Ownership**: `orchestrator` escribe tooling y SDD; `domain` solo `src/domain/**`; `interfaz` solo
`src/components/**` salvo integración de App; `e2e` solo `src/App.tsx`,
`src/components/App.integration.test.tsx`, `tests/e2e/**` y `src/styles.css`. Ningún worker modifica
`specs/**`, scripts, configuración raíz, package files o lockfiles.

## Phase 1: Bootstrap SDD

**Purpose**: Declarar el grafo canónico y el ledger `Planned` que Analyze A puede inspeccionar.

Esta invocación crea `tasks.md` y `traceability.md`; no genera una task de implementación para
autorregistrar esos artefactos. La validación estructural obligatoria al cierre de esta fase es:

```bash
node scripts/verify-traceability.mjs --phase=tasks
```

**Checkpoint**: 34 AC con un único par canónico, una fila de gate, cero evidencia suplementaria y
cero IDs globales duplicados.

---

## Phase 2: Foundational gate — `GATE-MULTIFEATURE-001`

**Purpose**: Implementar, después de Analyze A en GO, el modelo multi-feature y de ciclo de vida que
habilita el segundo pase Tasks.

**Blocking rule**: Solo estas dos tasks quedan autorizadas por Analyze A. `T063` debe estar verde
antes de regenerar Tasks; no se crean worktrees de producto.

- [ ] T062 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [RED] Añadir tests con nombre literal `GATE-MULTIFEATURE-001` en `scripts/verify-traceability.test.mjs` para descubrimiento de todas las tripletas `spec.md`/`tasks.md`/`traceability.md`, validación por feature, duplicados globales AC/GATE/Task, unión de tasks contra `git log`, features parciales, orden determinista, exit code binario, fases `Planned`/`Implementing`/`Release_Candidate`/`Verified` y evidencia suplementaria; ejecutar `node --test --test-name-pattern='GATE-MULTIFEATURE-001' scripts/verify-traceability.test.mjs`, exigir RED por capacidades ausentes y registrar salida en `.swarm/handoffs/orchestrator/T062.md`; Expected commit: `test(tooling): T062 define multi-feature lifecycle gate [GATE-MULTIFEATURE-001]`
- [ ] T063 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [GREEN] Extender `scripts/verify-traceability.mjs` para descubrir y validar cada feature, normalizar fases, agregar IDs y tasks globalmente, aplicar evidencia final según ciclo de vida, representar varios pares RED/GREEN por AC y emitir diagnósticos deterministas con exit code `0`/`1`; ejecutar `node --test scripts/verify-traceability.test.mjs`, `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`, exigir GREEN y registrar salida en `.swarm/handoffs/orchestrator/T063.md`; Expected commit: `feat(tooling): T063 implement multi-feature lifecycle gate [GATE-MULTIFEATURE-001]`

**Checkpoint**: Después de T063, el orquestador completa la fila del gate con SHAs reales, regenera
Tasks/ledger mediante el pase ampliado y repite Analyze. No ejecuta T064 todavía.

---

## Phase 3: US-005 — Pares canónicos reservados (Priority: P1) 🎯 MVP

**Goal**: Añadir “Deshacer jugada” con dominio puro, control accesible, composición real y
compatibilidad con los 42 AC previos.

**Independent Test**: Desde cada estado canónico, comprobar tablero y estado por separado, consumir
una jugada por activación hasta vacío, rechazar Undo vacío, eliminar historial con RESET, operar por
puntero/teclado, conservar foco/anuncios exactos y mantener responsive entre 320–1920 px y al 200 %.

**Bootstrap restriction**: Los pares siguientes son la evidencia primaria mínima para Analyze A.
Permanecen reservados hasta que el segundo pase inserte la evidencia suplementaria y Analyze B dé GO.

### Domain track — `OWNER:domain`

#### Historial creado solo por jugadas legales

- [ ] T064 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [RED] Añadir en `src/domain/game.test.ts` los tests `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal`, `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` y `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'`, exigir RED por historial ausente y registrar salida en `.swarm/handoffs/domain/T064.md`; Expected commit: `test(US5): T064 prove legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`
- [ ] T065 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [GREEN] Añadir `GameSnapshot`, historial requerido e inmutable y captura posterior a la validación de `PLAY_CELL` en `src/domain/game.ts`, migrando los fixtures de `src/domain/game.test.ts` sin cambiar reglas previas; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'` y `npm run test:unit`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T065.md`; Expected commit: `feat(US5): T065 record legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`

#### Restauración exacta de una jugada y turno

- [ ] T066 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [RED] Añadir en `src/domain/game.test.ts` los tests `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot`, `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot`, `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` y `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'`, exigir RED por acción UNDO ausente y registrar salida en `.swarm/handoffs/domain/T066.md`; Expected commit: `test(US5): T066 prove exact single-move restoration [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`
- [ ] T067 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [GREEN] Añadir `UNDO` a `GameAction` y restaurar atómicamente el último snapshot eliminando exactamente una entrada en `src/domain/game.ts`, sin mutación ni conocimiento de interfaz; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'` y `npm run test:unit`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T067.md`; Expected commit: `feat(US5): T067 restore one immutable snapshot [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`

#### Recuperación desde estados terminales

- [ ] T068 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [RED] Añadir `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` en `src/domain/game.test.ts` mediante tres secuencias legales y ejecutar `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'`, exigiendo RED porque el bloqueo terminal aún impide UNDO y registrando salida en `.swarm/handoffs/domain/T068.md`; Expected commit: `test(US5): T068 prove terminal recovery is missing [AC-US5-TERMINAL-009]`
- [ ] T069 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [GREEN] Evaluar `UNDO` antes del rechazo terminal en `src/domain/game.ts` y restaurar el estado de juego previo desde `WON_X`, `WON_O` y `DRAW`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'` y `npm run test:unit`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T069.md`; Expected commit: `feat(US5): T069 restore play from terminal states [AC-US5-TERMINAL-009]`

#### Repetición hasta el tablero inicial

- [ ] T070 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` y `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[0-1]'`, exigir RED por consumo repetido ausente y registrar salida en `.swarm/handoffs/domain/T070.md`; Expected commit: `test(US5): T070 prove repeated Undo to empty board [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011]`
- [ ] T071 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011] [GREEN] Conservar entradas anteriores y retirar solo la última en cada `UNDO` de `src/domain/game.ts` hasta restaurar `INITIAL_STATE`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[0-1]'` y `npm run test:unit`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T071.md`; Expected commit: `feat(US5): T071 consume Undo history one entry at a time [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011]`

#### No-op determinista con historial vacío

- [ ] T072 [US5] [OWNER:domain] [AC:AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío`, `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` y `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-UNWANTED-01[2-4]'`, exigir RED por selector/no-op ausentes y registrar salida en `.swarm/handoffs/domain/T072.md`; Expected commit: `test(US5): T072 prove deterministic empty-history no-op [AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014]`
- [ ] T073 [US5] [OWNER:domain] [AC:AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014] [GREEN] Implementar no-op por historial vacío y exportar `canUndo(state)` en `src/domain/game.ts`, conservando la misma referencia sin crear historial; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-UNWANTED-01[2-4]'` y `npm run test:unit`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T073.md`; Expected commit: `feat(US5): T073 expose deterministic empty-history guard [AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014]`

#### RESET elimina todo el historial

- [ ] T074 [US5] [OWNER:domain] [AC:AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-RESET-018 RESET deja nueve celdas vacías`, `AC-US5-RESET-019 RESET restaura PLAYING_X` y `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso`; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-RESET-0(18|19|20)'`, exigir RED por historial retenido y registrar salida en `.swarm/handoffs/domain/T074.md`; Expected commit: `test(US5): T074 prove RESET destroys prior history [AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`
- [ ] T075 [US5] [OWNER:domain] [AC:AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [GREEN] Hacer que `RESET` produzca tablero vacío, `PLAYING_X` e historial nuevo vacío en `src/domain/game.ts`, sin referencia recuperable al historial anterior; ejecutar `npm run test:unit -- --testNamePattern='AC-US5-RESET-0(18|19|20)'`, `npm run test:unit` y `npm run build`, exigir GREEN y registrar salida en `.swarm/handoffs/domain/T075.md`; Expected commit: `feat(US5): T075 reset board status and history atomically [AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`

### Interface track — `OWNER:interfaz`

#### Presentación, disponibilidad, nombre y señal no cromática

- [ ] T076 [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [RED] Crear `src/components/UndoButton.test.tsx` con `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true`, `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false`, `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` y `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color`; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'`, exigir RED por componente ausente y registrar salida en `.swarm/handoffs/interfaz/T076.md`; Expected commit: `test(US5): T076 prove Undo control states and name [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`
- [ ] T077 [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [GREEN] Crear `src/components/UndoButton.tsx` como botón nativo controlado por `available`/`onUndo`, con texto y nombre `Deshacer jugada`, `aria-disabled`, guard de callback e indicación textual `No disponible`; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'` y `npm run test:component`, exigir GREEN y registrar salida en `.swarm/handoffs/interfaz/T077.md`; Expected commit: `feat(US5): T077 render accessible Undo control states [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`

#### Activación nativa y permanencia del foco

- [ ] T078 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [RED] Añadir en `src/components/UndoButton.test.tsx` `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez`, `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial`, `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` y `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender`; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`, exigir RED por activación/foco ausentes y registrar salida en `.swarm/handoffs/interfaz/T078.md`; Expected commit: `test(US5): T078 prove native Undo activation and focus [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`
- [ ] T079 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [GREEN] Completar en `src/components/UndoButton.tsx` la activación única por semántica nativa y conservar el mismo nodo enfocado al cambiar `available`, sin listeners globales ni `focus()` programático; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`, `npm run test:component` y `npm run build`, exigir GREEN y registrar salida en `.swarm/handoffs/interfaz/T079.md`; Expected commit: `feat(US5): T079 preserve native activation and focused node [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`

### Composition track — `OWNER:e2e`

#### Visibilidad, ubicación y orden de foco

- [ ] T080 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001,AC-US5-INTERACCION-002,AC-US5-FOCO-026] [RED] Crear `src/components/App.integration.test.tsx` con `AC-US5-INTERACCION-001 muestra Deshacer jugada en cada estado canónico`, `AC-US5-INTERACCION-002 ubica Undo entre tablero y Reiniciar partida` y `AC-US5-FOCO-026 ordena nueve celdas Undo y Reiniciar en la secuencia de foco`; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(INTERACCION-00[1-2]|FOCO-026)'`, exigir RED por composición ausente y registrar salida en `.swarm/handoffs/e2e/T080.md`; Expected commit: `test(US5): T080 prove Undo shell placement and focus order [AC-US5-INTERACCION-001 AC-US5-INTERACCION-002 AC-US5-FOCO-026]`
- [ ] T081 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001,AC-US5-INTERACCION-002,AC-US5-FOCO-026] [GREEN] Integrar el contrato congelado de `UndoButton` en `src/App.tsx` después del tablero y antes de Reiniciar, conservando el orden DOM y el nodo estable sin duplicar reglas de dominio; ejecutar `npm run test:component -- --testNamePattern='AC-US5-(INTERACCION-00[1-2]|FOCO-026)'` y `npm run test:component`, exigir GREEN y registrar salida en `.swarm/handoffs/e2e/T081.md`; Expected commit: `feat(US5): T081 compose Undo shell and focus order [AC-US5-INTERACCION-001 AC-US5-INTERACCION-002 AC-US5-FOCO-026]`

#### Anuncios exactos y ausencia de anuncio falso

- [ ] T082 [US5] [OWNER:e2e] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030,AC-US5-A11Y-031] [RED] Añadir en `src/components/App.integration.test.tsx` `AC-US5-A11Y-029 anuncia exactamente Jugada deshecha Turno de X`, `AC-US5-A11Y-030 anuncia exactamente Jugada deshecha Turno de O` y `AC-US5-A11Y-031 no cambia la región de estado al intentar Undo vacío`; ejecutar `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30|31)'`, exigir RED por integración de anuncio ausente y registrar salida en `.swarm/handoffs/e2e/T082.md`; Expected commit: `test(US5): T082 prove exact Undo announcements [AC-US5-A11Y-029 AC-US5-A11Y-030 AC-US5-A11Y-031]`
- [ ] T083 [US5] [OWNER:e2e] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030,AC-US5-A11Y-031] [GREEN] Consumir desde `src/App.tsx` el contrato congelado `GameStatus(status, announcement?)`, publicar una vez el mensaje derivado del estado restaurado y no crear evento para Undo no disponible; ejecutar `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30|31)'`, `npm run test:component` y `npm run build`, exigir GREEN y registrar salida en `.swarm/handoffs/e2e/T083.md`; Expected commit: `feat(US5): T083 compose exact Undo announcements [AC-US5-A11Y-029 AC-US5-A11Y-030 AC-US5-A11Y-031]`

### Browser track — `OWNER:e2e`

#### Activación táctil real

- [ ] T084 [US5] [OWNER:e2e] [AC:AC-US5-PUNTERO-022] [RED] Añadir `AC-US5-PUNTERO-022 toque real deshace una jugada legal` en `tests/e2e/game.spec.ts` y ejecutar `npm run test:e2e -- --grep='AC-US5-PUNTERO-022'`, exigiendo RED por composición táctil ausente y registrando salida en `.swarm/handoffs/e2e/T084.md`; Expected commit: `test(US5): T084 prove real touch Undo is missing [AC-US5-PUNTERO-022]`
- [ ] T085 [US5] [OWNER:e2e] [AC:AC-US5-PUNTERO-022] [GREEN] Conectar en `src/App.tsx` el callback nativo de `UndoButton` con un único `dispatch({ type: 'UNDO' })` y disponibilidad obtenida exclusivamente mediante `canUndo(state)`; ejecutar `npm run test:e2e -- --grep='AC-US5-PUNTERO-022'`, `npm run test:component` y `npm run test:e2e`, exigir GREEN y registrar salida en `.swarm/handoffs/e2e/T085.md`; Expected commit: `feat(US5): T085 connect real touch Undo dispatch [AC-US5-PUNTERO-022]`

#### Foco visible y responsive

- [ ] T086 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-027,AC-US5-RESPONSIVE-032,AC-US5-RESPONSIVE-033] [RED] Añadir en `tests/e2e/game.spec.ts` `AC-US5-FOCO-027 muestra contorno continuo al enfocar Deshacer jugada`, `AC-US5-RESPONSIVE-032 evita overflow horizontal entre 320 y 1920 px` y `AC-US5-RESPONSIVE-033 evita superposición de controles con zoom 200 por ciento`; ejecutar `npm run test:e2e -- --grep='AC-US5-(FOCO-027|RESPONSIVE-03[2-3])'`, exigir RED por estilos ausentes y registrar salida en `.swarm/handoffs/e2e/T086.md`; Expected commit: `test(US5): T086 prove focus and responsive boundaries [AC-US5-FOCO-027 AC-US5-RESPONSIVE-032 AC-US5-RESPONSIVE-033]`
- [ ] T087 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-027,AC-US5-RESPONSIVE-032,AC-US5-RESPONSIVE-033] [GREEN] Ajustar `src/styles.css` para contorno continuo, bloque de acciones sin overflow a 320/768/1280/1920 px y ausencia de solapamiento al 200 %, sin ocultar textos ni controles; ejecutar `npm run test:e2e -- --grep='AC-US5-(FOCO-027|RESPONSIVE-03[2-3])'`, `npm run test:e2e` y `npm run build`, exigir GREEN y registrar salida en `.swarm/handoffs/e2e/T087.md`; Expected commit: `feat(US5): T087 enforce focus and responsive boundaries [AC-US5-FOCO-027 AC-US5-RESPONSIVE-032 AC-US5-RESPONSIVE-033]`

**Checkpoint US5 reservado**: Los 34 AC tienen evidencia primaria prevista, pero ninguna task
T064–T087 se ejecuta con este pase. El segundo pase preservará estos IDs, añadirá evidencia
suplementaria con IDs nuevos y resolverá el orden TDD de composición antes de Analyze B.

---

## Final Phase: Bootstrap validation and handoff

No hay tasks adicionales en este pase. El orquestador ejecuta de forma read-only:

```bash
node scripts/verify-traceability.mjs --phase=tasks
```

Después ejecuta `$speckit-analyze`. Un GO autoriza solo `T062/T063`; cualquier CRITICAL/HIGH vuelve a
Plan o Tasks. La consolidación, transiciones `IMPLEMENTING`/`RELEASE_CANDIDATE`/`VERIFIED`,
regresión completa y reviewer se incorporan en el segundo pase.

---

## Dependencies and execution order

### Bootstrap lifecycle

1. Esta generación deja `tasks.md` y `traceability.md` en forma canónica `Planned`.
2. `node scripts/verify-traceability.mjs --phase=tasks` debe pasar con el verificador vigente.
3. Analyze A debe resultar GO.
4. Solo entonces se ejecuta `T062 → T063`.
5. Después de T063 se regenera Tasks/ledger, se añade evidencia suplementaria y se repite Analyze.
6. Ninguna task T064–T087 ni worktree de producto comienza antes de Analyze B y baseline verde.

```text
Tasks bootstrap + ledger Planned
              ↓
       --phase=tasks PASS
              ↓
         Analyze A GO
              ↓
         T062 → T063
              ↓
   Tasks ampliadas + Analyze B
              ↓
 domain ║ interfaz → merges → e2e
```

### Canonical RED/GREEN blocks

- `T062 → T063`
- `T064 → T065`
- `T066 → T067`
- `T068 → T069`
- `T070 → T071`
- `T072 → T073`
- `T074 → T075`
- `T076 → T077`
- `T078 → T079`
- `T080 → T081`
- `T082 → T083`
- `T084 → T085`
- `T086 → T087`

Cada bloque contiene AC relacionados, un único RED canónico y un único GREEN canónico. No existe
ningún segundo par para el mismo AC en este bootstrap.

## Parallel opportunities after Analyze B

Domain e interfaz pueden avanzar como tracks paralelos desde la misma base verde porque sus archivos
son disjuntos:

```text
domain:    T064 → T065 → T066 → T067 → T068 → T069 → T070 → T071 → T072 → T073 → T074 → T075
interfaz:  T076 → T077 → T078 → T079
```

No se marca `[P]` en tasks individuales porque cada track comparte archivos internos y cada GREEN
depende de su RED. El track de composición/browser depende explícitamente de ambos merges y solo se
ordena definitivamente en el segundo pase.

## Implementation strategy

### MVP

Solo existe `US-005` P1. El MVP completo requiere dominio, interfaz, composición, navegador,
regresión de los 42 AC y trazabilidad multi-feature; el bootstrap no constituye un incremento
entregable.

### Incremental checkpoints

1. `T063`: gate multi-feature y ciclo de vida listos.
2. Segundo Tasks + Analyze B: grafo ejecutable, contratos congelados y baseline verde.
3. Domain: historial, UNDO y RESET verdes.
4. Interfaz: control y `GameStatus` compatibles.
5. E2E: composición, anuncios, terminales, repetición, reset, teclado y responsive.
6. Release: cero `PENDING`, feature 001 verde y ledger `VERIFIED`.

## Coverage audit — bootstrap canonical pairs

| AC-ID | RED | GREEN | Test previsto | OWNER |
|---|---:|---:|---|---|
| `AC-US5-INTERACCION-001` | T080 | T081 | `src/components/App.integration.test.tsx` — `AC-US5-INTERACCION-001 muestra Deshacer jugada en cada estado canónico` | e2e |
| `AC-US5-INTERACCION-002` | T080 | T081 | `src/components/App.integration.test.tsx` — `AC-US5-INTERACCION-002 ubica Undo entre tablero y Reiniciar partida` | e2e |
| `AC-US5-DISPONIBILIDAD-003` | T076 | T077 | `src/components/UndoButton.test.tsx` — `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true` | interfaz |
| `AC-US5-DISPONIBILIDAD-004` | T076 | T077 | `src/components/UndoButton.test.tsx` — `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false` | interfaz |
| `AC-US5-DOMINIO-005` | T066 | T067 | `src/domain/game.test.ts` — `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot` | domain |
| `AC-US5-ESTADO-006` | T066 | T067 | `src/domain/game.test.ts` — `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot` | domain |
| `AC-US5-ESTADO-007` | T066 | T067 | `src/domain/game.test.ts` — `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` | domain |
| `AC-US5-DOMINIO-008` | T066 | T067 | `src/domain/game.test.ts` — `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO` | domain |
| `AC-US5-TERMINAL-009` | T068 | T069 | `src/domain/game.test.ts` — `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` | domain |
| `AC-US5-HISTORIAL-010` | T070 | T071 | `src/domain/game.test.ts` — `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` | domain |
| `AC-US5-HISTORIAL-011` | T070 | T071 | `src/domain/game.test.ts` — `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial` | domain |
| `AC-US5-UNWANTED-012` | T072 | T073 | `src/domain/game.test.ts` — `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío` | domain |
| `AC-US5-UNWANTED-013` | T072 | T073 | `src/domain/game.test.ts` — `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` | domain |
| `AC-US5-UNWANTED-014` | T072 | T073 | `src/domain/game.test.ts` — `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío` | domain |
| `AC-US5-HISTORIAL-015` | T064 | T065 | `src/domain/game.test.ts` — `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal` | domain |
| `AC-US5-HISTORIAL-016` | T064 | T065 | `src/domain/game.test.ts` — `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` | domain |
| `AC-US5-HISTORIAL-017` | T064 | T065 | `src/domain/game.test.ts` — `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal` | domain |
| `AC-US5-RESET-018` | T074 | T075 | `src/domain/game.test.ts` — `AC-US5-RESET-018 RESET deja nueve celdas vacías` | domain |
| `AC-US5-RESET-019` | T074 | T075 | `src/domain/game.test.ts` — `AC-US5-RESET-019 RESET restaura PLAYING_X` | domain |
| `AC-US5-RESET-020` | T074 | T075 | `src/domain/game.test.ts` — `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso` | domain |
| `AC-US5-PUNTERO-021` | T078 | T079 | `src/components/UndoButton.test.tsx` — `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez` | interfaz |
| `AC-US5-PUNTERO-022` | T084 | T085 | `tests/e2e/game.spec.ts` — `AC-US5-PUNTERO-022 toque real deshace una jugada legal` | e2e |
| `AC-US5-TECLADO-023` | T078 | T079 | `src/components/UndoButton.test.tsx` — `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial` | interfaz |
| `AC-US5-TECLADO-024` | T078 | T079 | `src/components/UndoButton.test.tsx` — `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` | interfaz |
| `AC-US5-FOCO-025` | T078 | T079 | `src/components/UndoButton.test.tsx` — `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender` | interfaz |
| `AC-US5-FOCO-026` | T080 | T081 | `src/components/App.integration.test.tsx` — `AC-US5-FOCO-026 ordena nueve celdas Undo y Reiniciar en la secuencia de foco` | e2e |
| `AC-US5-FOCO-027` | T086 | T087 | `tests/e2e/game.spec.ts` — `AC-US5-FOCO-027 muestra contorno continuo al enfocar Deshacer jugada` | e2e |
| `AC-US5-A11Y-028` | T076 | T077 | `src/components/UndoButton.test.tsx` — `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` | interfaz |
| `AC-US5-A11Y-029` | T082 | T083 | `src/components/App.integration.test.tsx` — `AC-US5-A11Y-029 anuncia exactamente Jugada deshecha Turno de X` | e2e |
| `AC-US5-A11Y-030` | T082 | T083 | `src/components/App.integration.test.tsx` — `AC-US5-A11Y-030 anuncia exactamente Jugada deshecha Turno de O` | e2e |
| `AC-US5-A11Y-031` | T082 | T083 | `src/components/App.integration.test.tsx` — `AC-US5-A11Y-031 no cambia la región de estado al intentar Undo vacío` | e2e |
| `AC-US5-RESPONSIVE-032` | T086 | T087 | `tests/e2e/game.spec.ts` — `AC-US5-RESPONSIVE-032 evita overflow horizontal entre 320 y 1920 px` | e2e |
| `AC-US5-RESPONSIVE-033` | T086 | T087 | `tests/e2e/game.spec.ts` — `AC-US5-RESPONSIVE-033 evita superposición de controles con zoom 200 por ciento` | e2e |
| `AC-US5-VISUAL-034` | T076 | T077 | `src/components/UndoButton.test.tsx` — `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color` | interfaz |

## Gate coverage audit

| GATE-ID | RED | GREEN | Test previsto | OWNER |
|---|---:|---:|---|---|
| `GATE-MULTIFEATURE-001` | T062 | T063 | `scripts/verify-traceability.test.mjs` — tests con nombre literal `GATE-MULTIFEATURE-001` | orchestrator |

## Bootstrap metrics

- 26 Task IDs globalmente únicos: `T062–T087`.
- 2 tooling tasks: un RED y un GREEN para `GATE-MULTIFEATURE-001`.
- 24 tasks de `US5`: 12 RED y 12 GREEN.
- 34/34 AC con un par canónico y un test previsto con AC-ID literal.
- 0 pares suplementarios; se añaden únicamente después de T063.
- 42 AC de feature 001 preservados como regresión obligatoria del segundo pase y del cierre.
