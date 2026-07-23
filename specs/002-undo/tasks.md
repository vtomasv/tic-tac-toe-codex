# Tasks: Deshacer la última jugada — pase ampliado ejecutable

**Input**: `specs/002-undo/spec.md`, plan, research, data-model, quickstart y contratos congelados.

**Lifecycle**: `PLANNED` durante la reparación final del contrato de Codex CLI; vuelve a
`IMPLEMENTING` solo después de Analyze E y T110/T111.

**Global numbering**: Se preservan `T062–T089`; los nuevos IDs continúan en `T090+`. El orden de
ejecución se define por fases y dependencias, no por orden numérico, porque `T064–T087` ya estaban
reservados antes del pase ampliado.

**Ownership**: `orchestrator` escribe SDD, scripts, configuración raíz y merges; `domain` solo
`src/domain/**`; `interfaz` solo los archivos asignados bajo `src/components/**`; `e2e` solo
`src/App.tsx`, `src/components/App.integration.test.tsx`, `tests/e2e/**` y `src/styles.css`;
`reviewer` es read-only. Los workers registran evidencia en `.swarm/handoffs/<rol>/` y nunca editan
SDD, scripts, package/lockfiles ni archivos de otro owner.

**TDD**: Cada nombre de test contiene literalmente su AC-ID o GATE-ID. Cada RED se confirma y
commitea antes de su GREEN. En integración, todo el bloque RED precede a cualquier cambio de App o
estilos.

## Phase 1: Setup y gates fundacionales — `OWNER:orchestrator`

Las tareas completadas conservan evidencia y SHAs reales. Analyze C debe dar GO antes de ejecutar
`T090`; ningún worktree de producto se crea durante esta fase.

- [x] T062 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [RED] Añadir en `scripts/verify-traceability.test.mjs` tests literales `GATE-MULTIFEATURE-001` para descubrimiento de tripletas, validación por feature, duplicados globales, unión con git log, fases, evidencia suplementaria, errores deterministas y exit code binario; comando filtrado `node --test --test-name-pattern='GATE-MULTIFEATURE-001' scripts/verify-traceability.test.mjs`; evidencia `.swarm/handoffs/orchestrator/T062.md`; Expected commit: `test(tooling): T062 define multi-feature lifecycle gate [GATE-MULTIFEATURE-001]`
- [x] T063 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [GREEN] Implementar en `scripts/verify-traceability.mjs` descubrimiento y agregación multi-feature, ciclo del ledger, unicidad global y validación de evidencia; comandos `node --test scripts/verify-traceability.test.mjs`, `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T063.md`; Expected commit: `feat(tooling): T063 implement multi-feature lifecycle gate [GATE-MULTIFEATURE-001]`
- [x] T088 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [RED] Añadir en `scripts/verify-traceability.test.mjs` `GATE-MULTIFEATURE-001 accepts cohesive multi-family RED blocks before granular GREEN` y conservar el test legacy de RED ajeno; comando `node --test --test-name-pattern='GATE-MULTIFEATURE-001.*multi-family|GATE-TRACEABILITY-001.*unrelated RED' scripts/verify-traceability.test.mjs`; evidencia `.swarm/handoffs/orchestrator/T088.md`; Expected commit: `test(tooling): T088 define cohesive multi-family TDD blocks [GATE-MULTIFEATURE-001]`
- [x] T089 [OWNER:orchestrator] [GATE:GATE-MULTIFEATURE-001] [GREEN] Ajustar `validateCohesiveBlocks` en `scripts/verify-traceability.mjs` para seguir enlaces RED→GREEN cuando existe fase declarada y preservar la regla legacy sin fase; comandos `node --test scripts/verify-traceability.test.mjs`, `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T089.md`; Expected commit: `fix(tooling): T089 support cohesive multi-family TDD blocks [GATE-MULTIFEATURE-001]`
- [x] T090 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Crear `scripts/swarm.test.mjs` con tests cuyo nombre contiene `GATE-SWARM-001` para exigir `PROMPT_ROOT="$ROOT/.prompts"`, la presencia de `.prompts/09-speckit-implement-domain.md` y `.prompts/10-speckit-implement-interfaz.md`, y ausencia de fallback a `prompts/`; ejecutar `node --test --test-name-pattern='GATE-SWARM-001' scripts/swarm.test.mjs`, exigir RED por la ruta legacy y registrar `.swarm/handoffs/orchestrator/T090.md`; Expected commit: `test(tooling): T090 define versioned swarm prompt preflight [GATE-SWARM-001]`
- [x] T091 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Cambiar solo la raíz de prompts y la ayuda asociada en `scripts/swarm.sh` para usar `.prompts/`; ejecutar `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh`, `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`, registrar `.swarm/handoffs/orchestrator/T091.md`; Expected commit: `fix(tooling): T091 resolve versioned swarm prompts [GATE-SWARM-001]`
- [x] T105 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Ampliar `scripts/swarm.test.mjs` con tests literales `GATE-SWARM-001` que exijan enlace no destructivo del `node_modules` raíz en worktrees domain/interfaz/e2e y que `.prompts/09-speckit-implement-domain.md`/`.prompts/10-speckit-implement-interfaz.md` contengan `node scripts/verify-traceability.mjs --phase=tasks` más una auditoría `git diff --name-only` acotada al owner; comando `node --test --test-name-pattern='GATE-SWARM-001.*self-contained|GATE-SWARM-001.*versioned root' scripts/swarm.test.mjs`, exigir RED por preparación ausente y registrar `.swarm/handoffs/orchestrator/T105.md`; Expected commit: `test(tooling): T105 define self-contained swarm worktrees [GATE-SWARM-001]`
- [x] T106 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Añadir en `scripts/swarm.sh` una función idempotente que enlace `$ROOT/node_modules` dentro de cada worktree domain/interfaz/e2e y falle si la raíz no existe; sustituir “gate de frontera” por comandos exactos de trazabilidad y diff permitido en `.prompts/09-speckit-implement-domain.md` y `.prompts/10-speckit-implement-interfaz.md`; ejecutar `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh`, `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T106.md`; Expected commit: `fix(tooling): T106 prepare self-contained swarm worktrees [GATE-SWARM-001]`
- [ ] T110 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir a `scripts/swarm.test.mjs` `GATE-SWARM-001 uses supported non-interactive Codex CLI options`, exigiendo ausencia de `--ask-for-approval`, presencia de `--ephemeral`, `--sandbox` y `-c 'approval_policy="never"'`; comando `node --test --test-name-pattern='GATE-SWARM-001.*supported non-interactive|GATE-SWARM-001.*self-contained' scripts/swarm.test.mjs`, exigir RED por opción no soportada y registrar `.swarm/handoffs/orchestrator/T110.md`; Expected commit: `test(tooling): T110 define supported Codex CLI contract [GATE-SWARM-001]`
- [ ] T111 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Sustituir en `scripts/swarm.sh` la opción inexistente `--ask-for-approval never` por `-c 'approval_policy="never"'`, sin cambiar sandbox ni prompts; ejecutar `codex exec --strict-config -c 'approval_policy="never"' --version`, `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh` y trazabilidad tasks/final; evidencia `.swarm/handoffs/orchestrator/T111.md`; Expected commit: `fix(tooling): T111 use supported Codex CLI contract [GATE-SWARM-001]`

**Checkpoint**: Ambos gates están GREEN, feature 001 y 002 pasan juntas y los contratos conservan
sus hashes congelados.

## Phase 2: Contratos congelados y entrada a implementación — `OWNER:orchestrator`

- [x] T092 [OWNER:orchestrator] [GREEN] Revalidar con `shasum -a 256` los contratos `specs/002-undo/contracts/domain-contract.md`, `ui-contract.md` y `traceability-contract.md`, cambiar exclusivamente `**Phase**` a `Implementing` en `specs/002-undo/traceability.md`, marcar T090–T092 completadas en `specs/002-undo/tasks.md`, registrar los SHAs reales de ambos gates y ejecutar `node scripts/verify-traceability.mjs --phase=tasks`; evidencia `.swarm/handoffs/orchestrator/T092.md`; Expected commit: `docs(traceability): T092 enter implementing lifecycle`
- [x] T109 [OWNER:orchestrator] [GREEN] Después de Analyze D y T105/T106 GREEN, revalidar hashes congelados, registrar sus SHAs en `specs/002-undo/traceability.md`, marcar T105/T106/T109 completadas, cambiar `**Phase**` de `Planned` a `Implementing` y ejecutar `node scripts/verify-traceability.mjs --phase=tasks`; evidencia `.swarm/handoffs/orchestrator/T109.md`; Expected commit: `docs(traceability): T109 re-enter implementing lifecycle`
- [ ] T112 [OWNER:orchestrator] [GREEN] Después de Analyze E y T110/T111 GREEN, revalidar hashes, registrar sus SHAs, marcar T110/T111/T112 completadas, cambiar `**Phase**` de `Planned` a `Implementing` y ejecutar trazabilidad tasks; evidencia `.swarm/handoffs/orchestrator/T112.md`; Expected commit: `docs(traceability): T112 finalize swarm implementing lifecycle`

Después del commit T092, el orquestador ejecuta, sobre árbol limpio:

```bash
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability
scripts/swarm.sh prepare
```

Solo un PASS completo autoriza `scripts/swarm.sh launch-parallel`.

## Phase 3: US-005 Domain — `OWNER:domain` (paralelo con interfaz)

### Historial de jugadas legales

- [ ] T064 [P] [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal`, `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` y `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal`; comando `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'`; evidencia `.swarm/handoffs/domain/T064.md`; Expected commit: `test(US5): T064 prove legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`
- [ ] T065 [P] [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [GREEN] Añadir en `src/domain/game.ts` snapshot mínimo, historial requerido e inmutable y captura solo después de validar `PLAY_CELL`; migrar fixtures de `src/domain/game.test.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T065.md`; Expected commit: `feat(US5): T065 record legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`

### Una jugada, tablero, estado y turno

- [ ] T066 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot`, `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot`, `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` y `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO`; comando `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'`; evidencia `.swarm/handoffs/domain/T066.md`; Expected commit: `test(US5): T066 prove exact single-move restoration [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`
- [ ] T067 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [GREEN] Añadir `UNDO` a `GameAction` y restaurar atómicamente el último snapshot en `src/domain/game.ts`, eliminando exactamente una entrada; comandos `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T067.md`; Expected commit: `feat(US5): T067 restore one immutable snapshot [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`

### Terminales, repetición y vacío

- [ ] T068 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [RED] Añadir `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` con tres secuencias legales en `src/domain/game.test.ts`; comando `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'`; evidencia `.swarm/handoffs/domain/T068.md`; Expected commit: `test(US5): T068 prove terminal recovery is missing [AC-US5-TERMINAL-009]`
- [ ] T069 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [GREEN] Resolver `UNDO` antes del bloqueo terminal en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T069.md`; Expected commit: `feat(US5): T069 restore play from terminal states [AC-US5-TERMINAL-009]`
- [ ] T070 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` y `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial`; comando `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[0-1]'`; evidencia `.swarm/handoffs/domain/T070.md`; Expected commit: `test(US5): T070 prove repeated Undo to empty board [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011]`
- [ ] T071 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011] [GREEN] Conservar entradas anteriores y retirar solo la última por `UNDO` en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[0-1]'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T071.md`; Expected commit: `feat(US5): T071 consume Undo history one entry at a time [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011]`
- [ ] T072 [US5] [OWNER:domain] [AC:AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío`, `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` y `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío`; comando `npm run test:unit -- --testNamePattern='AC-US5-UNWANTED-01[2-4]'`; evidencia `.swarm/handoffs/domain/T072.md`; Expected commit: `test(US5): T072 prove deterministic empty-history no-op [AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014]`
- [ ] T073 [US5] [OWNER:domain] [AC:AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014] [GREEN] Implementar el no-op vacío y exportar `canUndo(state)` en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-UNWANTED-01[2-4]'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T073.md`; Expected commit: `feat(US5): T073 expose deterministic empty-history guard [AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014]`

### Reset

- [ ] T074 [US5] [OWNER:domain] [AC:AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-RESET-018 RESET deja nueve celdas vacías`, `AC-US5-RESET-019 RESET restaura PLAYING_X` y `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso`; comando `npm run test:unit -- --testNamePattern='AC-US5-RESET-0(18|19|20)'`; evidencia `.swarm/handoffs/domain/T074.md`; Expected commit: `test(US5): T074 prove RESET destroys prior history [AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`
- [ ] T075 [US5] [OWNER:domain] [AC:AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [GREEN] Hacer que `RESET` produzca estado inicial e historial vacío en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-RESET-0(18|19|20)'`, `npm run test:unit` y `npm run build`; evidencia `.swarm/handoffs/domain/T075.md`; Expected commit: `feat(US5): T075 reset board status and history atomically [AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`

## Phase 4: US-005 Interfaz — `OWNER:interfaz` (paralelo con domain)

### Control Undo

- [ ] T076 [P] [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [RED] Crear `src/components/UndoButton.test.tsx` con `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true`, `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false`, `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` y `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color`; comando `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'`; evidencia `.swarm/handoffs/interfaz/T076.md`; Expected commit: `test(US5): T076 prove Undo control states and name [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`
- [ ] T077 [P] [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [GREEN] Crear `src/components/UndoButton.tsx` como botón nativo controlado por `available`/`onUndo`, con texto exacto, `aria-disabled`, guard e indicación `No disponible`; comandos `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'` y `npm run test:component`; evidencia `.swarm/handoffs/interfaz/T077.md`; Expected commit: `feat(US5): T077 render accessible Undo control states [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`
- [ ] T078 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [RED] Añadir en `src/components/UndoButton.test.tsx` `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez`, `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial`, `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` y `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender`; comando `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`; evidencia `.swarm/handoffs/interfaz/T078.md`; Expected commit: `test(US5): T078 prove native Undo activation and focus [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`
- [ ] T079 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [GREEN] Completar activación nativa y nodo estable en `src/components/UndoButton.tsx`, sin listeners globales ni foco programático; comandos `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`, `npm run test:component` y `npm run build`; evidencia `.swarm/handoffs/interfaz/T079.md`; Expected commit: `feat(US5): T079 preserve native activation and focused node [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`

### Contrato compatible de GameStatus

- [ ] T095 [US5] [OWNER:interfaz] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030] [RED] Añadir en `src/components/GameStatus.test.tsx` `AC-US5-A11Y-029 acepta anuncio exacto Jugada deshecha Turno de X` y `AC-US5-A11Y-030 acepta anuncio exacto Jugada deshecha Turno de O`, conservando tests del fallback con `status` solamente; comando `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30)'`; evidencia `.swarm/handoffs/interfaz/T095.md`; Expected commit: `test(US5): T095 prove compatible GameStatus announcements [AC-US5-A11Y-029 AC-US5-A11Y-030]`
- [ ] T096 [US5] [OWNER:interfaz] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030] [GREEN] Extender solo `src/components/GameStatus.tsx` con `announcement?: string`, conservar `status` requerido, un único `role=status` y fallback canónico; comandos `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30)'`, `npm run test:component` y `npm run build`; evidencia `.swarm/handoffs/interfaz/T096.md`; Expected commit: `feat(US5): T096 preserve compatible GameStatus contract [AC-US5-A11Y-029 AC-US5-A11Y-030]`

**Parallel checkpoint**: domain e interfaz parten del mismo `BASE_SHA_SWARM`, no comparten archivos
y entregan handoffs. El orquestador integra primero domain, ejecuta unit/build, integra interfaz y
ejecuta component/build/baseline. E2E no nace antes de ambos merges verdes.

## Phase 5: US-005 Integración y E2E — `OWNER:e2e`

### Bloque RED completo, sin modificar App ni estilos

- [ ] T080 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001,AC-US5-INTERACCION-002,AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-FOCO-026] [RED] Crear `src/components/App.integration.test.tsx` con tests literales para visibilidad en cinco estados, ubicación entre tablero/reset, disponibilidad con/sin historial y orden nueve celdas→Undo→Reset; comando `npm run test:component -- --testNamePattern='AC-US5-(INTERACCION-00[1-2]|DISPONIBILIDAD-00[3-4]|FOCO-026)'`; evidencia `.swarm/handoffs/e2e/T080.md`; Expected commit: `test(US5): T080 prove Undo shell availability and order [AC-US5-INTERACCION-001 AC-US5-INTERACCION-002 AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-FOCO-026]`
- [ ] T081 [US5] [OWNER:e2e] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [RED] Añadir en `src/components/App.integration.test.tsx` tests literales que separan tablero, estado, turno y una sola marca tras Undo; comando `npm run test:component -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'`; evidencia `.swarm/handoffs/e2e/T081.md`; Expected commit: `test(US5): T081 prove composed single-move restoration [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`
- [ ] T082 [US5] [OWNER:e2e] [AC:AC-US5-TERMINAL-009,AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011,AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014] [RED] Añadir en `tests/e2e/game.spec.ts` tests literales para `WON_X`, `WON_O`, `DRAW`, Undo repetido hasta vacío y no-op vacío separado en tablero/status/disponibilidad; comando `npm run test:e2e -- --grep='AC-US5-(TERMINAL-009|HISTORIAL-01[0-1]|UNWANTED-01[2-4])'`; evidencia `.swarm/handoffs/e2e/T082.md`; Expected commit: `test(US5): T082 prove terminal repeated and empty Undo flows [AC-US5-TERMINAL-009 AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011 AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014]`
- [ ] T083 [US5] [OWNER:e2e] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017,AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [RED] Añadir en `tests/e2e/game.spec.ts` tests literales para punto de historial legal, intentos rechazados y reset irreversible de tablero/status/historial; comando `npm run test:e2e -- --grep='AC-US5-(HISTORIAL-01[5-7]|RESET-0(18|19|20))'`; evidencia `.swarm/handoffs/e2e/T083.md`; Expected commit: `test(US5): T083 prove legal history and irreversible reset flows [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017 AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`
- [ ] T084 [US5] [OWNER:e2e] [AC:AC-US5-PUNTERO-021,AC-US5-PUNTERO-022,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025,AC-US5-A11Y-028,AC-US5-A11Y-029,AC-US5-A11Y-030,AC-US5-A11Y-031] [RED] Añadir en `src/components/App.integration.test.tsx` y `tests/e2e/game.spec.ts` tests literales para clic/toque/Enter/Espacio, permanencia de foco, nombre exacto, anuncios exactos X/O y ausencia de anuncio falso; comandos `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025|A11Y-0(28|29|30|31))'` y `npm run test:e2e -- --grep='AC-US5-PUNTERO-022'`; evidencia `.swarm/handoffs/e2e/T084.md`; Expected commit: `test(US5): T084 prove composed input focus and announcements [AC-US5-PUNTERO-021 AC-US5-PUNTERO-022 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025 AC-US5-A11Y-028 AC-US5-A11Y-029 AC-US5-A11Y-030 AC-US5-A11Y-031]`
- [ ] T085 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-027,AC-US5-RESPONSIVE-032,AC-US5-RESPONSIVE-033,AC-US5-VISUAL-034] [RED] Añadir en `tests/e2e/game.spec.ts` tests literales para foco visible, señal textual no cromática, 320/768/1280/1920 px y zoom 200 %; comando `npm run test:e2e -- --grep='AC-US5-(FOCO-027|RESPONSIVE-03[2-3]|VISUAL-034)'`; evidencia `.swarm/handoffs/e2e/T085.md`; Expected commit: `test(US5): T085 prove focus responsive and non-color boundaries [AC-US5-FOCO-027 AC-US5-RESPONSIVE-032 AC-US5-RESPONSIVE-033 AC-US5-VISUAL-034]`

### GREEN granulares posteriores a todas las RED

- [ ] T086 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001,AC-US5-INTERACCION-002,AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-FOCO-026] [GREEN] Integrar `UndoButton` en `src/App.tsx` después del tablero y antes de Reset, con `available={canUndo(state)}` y orden DOM estable; comandos `npm run test:component -- --testNamePattern='AC-US5-(INTERACCION-00[1-2]|DISPONIBILIDAD-00[3-4]|FOCO-026)'` y `npm run test:component`; evidencia `.swarm/handoffs/e2e/T086.md`; Expected commit: `feat(US5): T086 compose Undo shell availability and order [AC-US5-INTERACCION-001 AC-US5-INTERACCION-002 AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-FOCO-026]`
- [ ] T087 [US5] [OWNER:e2e] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [GREEN] Conectar en `src/App.tsx` un único callback `dispatch({type:'UNDO'})` y restaurar tablero/status exclusivamente mediante el dominio; comandos `npm run test:component -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'` y `npm run test:component`; evidencia `.swarm/handoffs/e2e/T087.md`; Expected commit: `feat(US5): T087 connect exact Undo restoration [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`
- [ ] T103 [US5] [OWNER:e2e] [AC:AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014,AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [GREEN] Conservar en `src/App.tsx` la disponibilidad derivada de `canUndo(state)` sin deducir historial, cubriendo jugadas legales, intentos rechazados y no-op vacío; comandos `npm run test:e2e -- --grep='AC-US5-(UNWANTED-01[2-4]|HISTORIAL-01[5-7])'` y `npm run test:e2e`; evidencia `.swarm/handoffs/e2e/T103.md`; Expected commit: `feat(US5): T103 compose legal and empty history boundaries [AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014 AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`
- [ ] T104 [US5] [OWNER:e2e] [AC:AC-US5-PUNTERO-021,AC-US5-PUNTERO-022,AC-US5-TECLADO-023,AC-US5-TECLADO-024] [GREEN] Usar el mismo callback nativo de `UndoButton` en `src/App.tsx` para clic, toque, Enter y Espacio sin listeners alternativos; comandos `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4])'`, `npm run test:e2e -- --grep='AC-US5-PUNTERO-022'` y suites component/E2E; evidencia `.swarm/handoffs/e2e/T104.md`; Expected commit: `feat(US5): T104 compose native Undo input paths [AC-US5-PUNTERO-021 AC-US5-PUNTERO-022 AC-US5-TECLADO-023 AC-US5-TECLADO-024]`
- [ ] T093 [US5] [OWNER:e2e] [AC:AC-US5-TERMINAL-009,AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011,AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [GREEN] Completar en `src/App.tsx` la composición de terminales, repetición y reset usando exclusivamente transiciones del dominio; comandos `npm run test:e2e -- --grep='AC-US5-(TERMINAL-009|HISTORIAL-01[0-1]|RESET-0(18|19|20))'` y `npm run test:e2e`; evidencia `.swarm/handoffs/e2e/T093.md`; Expected commit: `feat(US5): T093 compose terminal repeated and reset flows [AC-US5-TERMINAL-009 AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011 AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`
- [ ] T094 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-025,AC-US5-A11Y-028,AC-US5-A11Y-029,AC-US5-A11Y-030,AC-US5-A11Y-031] [GREEN] Entregar desde `src/App.tsx` el anuncio exacto una sola vez al `GameStatus` ya integrado, no crear evento en Undo vacío y mantener el nodo Undo enfocado; comandos `npm run test:component -- --testNamePattern='AC-US5-(FOCO-025|A11Y-0(28|29|30|31))'`, `npm run test:component` y `npm run build`; evidencia `.swarm/handoffs/e2e/T094.md`; Expected commit: `feat(US5): T094 compose Undo focus and exact announcements [AC-US5-FOCO-025 AC-US5-A11Y-028 AC-US5-A11Y-029 AC-US5-A11Y-030 AC-US5-A11Y-031]`
- [ ] T101 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-027,AC-US5-RESPONSIVE-032,AC-US5-RESPONSIVE-033,AC-US5-VISUAL-034] [GREEN] Ajustar `src/styles.css` para contorno continuo, señal textual visible, acciones sin overflow entre 320–1920 px y sin solapamiento al 200 %; comandos `npm run test:e2e -- --grep='AC-US5-(FOCO-027|RESPONSIVE-03[2-3]|VISUAL-034)'`, `npm run test:e2e` y `npm run build`; evidencia `.swarm/handoffs/e2e/T101.md`; Expected commit: `feat(US5): T101 enforce focus responsive and non-color boundaries [AC-US5-FOCO-027 AC-US5-RESPONSIVE-032 AC-US5-RESPONSIVE-033 AC-US5-VISUAL-034]`

## Phase 6: Consolidación, release y auditoría

- [ ] T097 [OWNER:orchestrator] [GREEN] Después de integrar domain e interfaz, consolidar SHAs/evidencia de `.swarm/handoffs/domain/**` y `.swarm/handoffs/interfaz/**` únicamente en `specs/002-undo/tasks.md` y `specs/002-undo/traceability.md`; ejecutar unit, component, build y `node scripts/verify-traceability.mjs --phase=tasks`; Expected commit: `docs(traceability): T097 consolidate parallel worker evidence`
- [ ] T098 [OWNER:orchestrator] [GREEN] Después de integrar e2e, consolidar `.swarm/handoffs/e2e/**`, ejecutar `$speckit-converge` y volver a Tasks/Analyze si añade trabajo; archivos `specs/002-undo/tasks.md` y `specs/002-undo/traceability.md`; comando `node scripts/verify-traceability.mjs --phase=tasks`; Expected commit: `docs(traceability): T098 consolidate e2e evidence`
- [ ] T099 [OWNER:orchestrator] [GREEN] Con cero tareas obligatorias pendientes y cero `PENDING`, cambiar `specs/002-undo/traceability.md` a `Release_Candidate` y ejecutar en orden unit, component, e2e, build y traceability final; Expected commit: `docs(traceability): T099 enter release candidate`
- [ ] T100 [OWNER:orchestrator] [GREEN] Tras el PASS de candidata, cambiar `specs/002-undo/traceability.md` a `Verified`, repetir `npm run verify:traceability` y confirmar árbol limpio; Expected commit: `docs(traceability): T100 verify feature 002 release`
- [ ] T102 [OWNER:reviewer] [GREEN] Auditar read-only spec, plan, tasks, contratos, commits, ownership, 34 AC, ambos gates y regresión de los 42 AC de feature 001; leer `specs/002-undo/**`, `specs/001-tres-en-raya-web/**` y `git log`; comando `npm run verify`; Expected commit: `N/A — reviewer read-only`

## Dependencies and merge order

```text
T088 → T089 → Tasks ampliadas → Analyze C → T090 → T091 → T092
                                                   ↓ preflight detecta worktrees sin deps
                                      Plan/Tasks reparación → Analyze D
                                                               ↓ GO
                                                       T105 → T106 → T109
                                                               ↓ preflight CLI
                                           Plan/Tasks → Analyze E → T110 → T111 → T112
                                  ↓ baseline + prepare
                    domain T064–T075 ║ interfaz T076–T079,T095–T096
                                  ↓ merge domain, sensores
                                  ↓ merge interfaz, sensores
                                 T097
                                  ↓
                       e2e RED T080–T085
                                  ↓
                    e2e GREEN T086,T087,T103,T104,T093,T094,T101
                                  ↓
                        T098 → T099 → T100 → T102
```

- `[P]` solo indica que el primer bloque de domain y el primer bloque de interfaz pueden comenzar
  desde la misma base; dentro de cada track las tareas son secuenciales porque comparten archivos.
- `e2e` depende explícitamente de ambos merges; si detecta un defecto ajeno, registra hallazgo y
  devuelve el trabajo al owner.
- Ningún worker toca `tasks.md` o `traceability.md`; T097/T098 consolidan desde la sesión principal.

## Coverage audit

| AC-ID | RED task(s) | GREEN task(s) | Test previsto | OWNER |
|---|---|---|---|---|
| AC-US5-INTERACCION-001 | T080 | T086 | `App.integration.test.tsx` visibilidad cinco estados | e2e |
| AC-US5-INTERACCION-002 | T080 | T086 | `App.integration.test.tsx` ubicación | e2e |
| AC-US5-DISPONIBILIDAD-003 | T076, T080 | T077, T086 | `UndoButton.test.tsx`; integración disponible | interfaz/e2e |
| AC-US5-DISPONIBILIDAD-004 | T076, T080 | T077, T086 | `UndoButton.test.tsx`; integración no disponible | interfaz/e2e |
| AC-US5-DOMINIO-005 | T066, T081 | T067, T087 | unit e integración tablero | domain/e2e |
| AC-US5-ESTADO-006 | T066, T081 | T067, T087 | unit e integración estado | domain/e2e |
| AC-US5-ESTADO-007 | T066, T081 | T067, T087 | unit e integración turno | domain/e2e |
| AC-US5-DOMINIO-008 | T066, T081 | T067, T087 | unit e integración una marca | domain/e2e |
| AC-US5-TERMINAL-009 | T068, T082 | T069, T093 | unit y E2E tres terminales | domain/e2e |
| AC-US5-HISTORIAL-010 | T070, T082 | T071, T093 | unit y E2E repetición | domain/e2e |
| AC-US5-HISTORIAL-011 | T070, T082 | T071, T093 | unit y E2E tablero vacío | domain/e2e |
| AC-US5-UNWANTED-012 | T072, T082 | T073, T103 | unit y E2E tablero no-op | domain/e2e |
| AC-US5-UNWANTED-013 | T072, T082 | T073, T103 | unit y E2E estado no-op | domain/e2e |
| AC-US5-UNWANTED-014 | T072, T082 | T073, T103 | unit y E2E disponibilidad no-op | domain/e2e |
| AC-US5-HISTORIAL-015 | T064, T083 | T065, T103 | unit y E2E jugada legal | domain/e2e |
| AC-US5-HISTORIAL-016 | T064, T083 | T065, T103 | unit y E2E celda ocupada | domain/e2e |
| AC-US5-HISTORIAL-017 | T064, T083 | T065, T103 | unit y E2E terminal rechazado | domain/e2e |
| AC-US5-RESET-018 | T074, T083 | T075, T093 | unit y E2E tablero reset | domain/e2e |
| AC-US5-RESET-019 | T074, T083 | T075, T093 | unit y E2E estado reset | domain/e2e |
| AC-US5-RESET-020 | T074, T083 | T075, T093 | unit y E2E historial reset | domain/e2e |
| AC-US5-PUNTERO-021 | T078, T084 | T079, T104 | componente e integración clic | interfaz/e2e |
| AC-US5-PUNTERO-022 | T084 | T104 | E2E toque | e2e |
| AC-US5-TECLADO-023 | T078, T084 | T079, T104 | componente/integración Enter | interfaz/e2e |
| AC-US5-TECLADO-024 | T078, T084 | T079, T104 | componente/integración Espacio | interfaz/e2e |
| AC-US5-FOCO-025 | T078, T084 | T079, T094 | componente/integración foco | interfaz/e2e |
| AC-US5-FOCO-026 | T080 | T086 | integración orden de foco | e2e |
| AC-US5-FOCO-027 | T085 | T101 | E2E contorno | e2e |
| AC-US5-A11Y-028 | T076, T084 | T077, T094 | componente/integración nombre | interfaz/e2e |
| AC-US5-A11Y-029 | T095, T084 | T096, T094 | GameStatus/integración anuncio X | interfaz/e2e |
| AC-US5-A11Y-030 | T095, T084 | T096, T094 | GameStatus/integración anuncio O | interfaz/e2e |
| AC-US5-A11Y-031 | T084 | T094 | integración sin anuncio falso | e2e |
| AC-US5-RESPONSIVE-032 | T085 | T101 | E2E 320–1920 px | e2e |
| AC-US5-RESPONSIVE-033 | T085 | T101 | E2E zoom 200 % | e2e |
| AC-US5-VISUAL-034 | T076, T085 | T077, T101 | componente/E2E señal textual | interfaz/e2e |

## Gate audit

| GATE-ID | RED | GREEN | Test previsto | OWNER |
|---|---|---|---|---|
| GATE-MULTIFEATURE-001 | T062, T088 | T063, T089 | `scripts/verify-traceability.test.mjs` | orchestrator |
| GATE-SWARM-001 | T090, T105, T110 | T091, T106, T111 | `scripts/swarm.test.mjs` | orchestrator |

## Metrics

- 49 Task IDs de feature 002, todos globalmente únicos.
- 10 tareas de tooling, 34 tareas de producto/lifecycle/consolidación y una auditoría read-only.
- 34/34 AC con al menos un RED y un GREEN; toda evidencia de producto contiene AC-ID literal.
- 2 gates con pares RED/GREEN y test previsto.
- 42 AC de feature 001 son regresión obligatoria en baseline, candidata, verificación y review.
