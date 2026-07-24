# Tasks: Deshacer la última jugada — pase ampliado ejecutable

**Input**: `specs/002-undo/spec.md`, plan, research, data-model, quickstart y contratos congelados.

**Lifecycle**: `IMPLEMENTING` después de Analyze I y T120.

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
- [x] T110 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir a `scripts/swarm.test.mjs` `GATE-SWARM-001 uses supported non-interactive Codex CLI options`, exigiendo ausencia de `--ask-for-approval`, presencia de `--ephemeral`, `--sandbox` y `-c 'approval_policy="never"'`; comando `node --test --test-name-pattern='GATE-SWARM-001.*supported non-interactive|GATE-SWARM-001.*self-contained' scripts/swarm.test.mjs`, exigir RED por opción no soportada y registrar `.swarm/handoffs/orchestrator/T110.md`; Expected commit: `test(tooling): T110 define supported Codex CLI contract [GATE-SWARM-001]`
- [x] T111 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Sustituir en `scripts/swarm.sh` la opción inexistente `--ask-for-approval never` por `-c 'approval_policy="never"'`, sin cambiar sandbox ni prompts; ejecutar `codex exec --strict-config -c 'approval_policy="never"' --version`, `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh` y trazabilidad tasks/final; evidencia `.swarm/handoffs/orchestrator/T111.md`; Expected commit: `fix(tooling): T111 use supported Codex CLI contract [GATE-SWARM-001]`
- [x] T113 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir a `scripts/swarm.test.mjs` `GATE-SWARM-001 rejects nounset-unsafe dependent local declarations`, exigiendo que `mk_wt` asigne `role`, `branch` y `path` en sentencias separadas; comando `node --test --test-name-pattern='GATE-SWARM-001.*nounset|GATE-SWARM-001.*supported non-interactive' scripts/swarm.test.mjs`, exigir RED reproduciendo `role: unbound variable` y registrar `.swarm/handoffs/orchestrator/T113.md`; Expected commit: `test(tooling): T113 define nounset-safe swarm initialization [GATE-SWARM-001]`
- [x] T114 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Separar las asignaciones dependientes de `mk_wt` en `scripts/swarm.sh`; ejecutar test del gate, `bash -n`, trazabilidad tasks/final y un preflight que confirme creación de worktrees sin lanzar Codex; evidencia `.swarm/handoffs/orchestrator/T114.md`; Expected commit: `fix(tooling): T114 make swarm initialization nounset-safe [GATE-SWARM-001]`
- [x] T116 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir a `scripts/swarm.test.mjs` `GATE-SWARM-001 grants linked worktree writes and propagates blocked handoffs`, exigiendo `--add-dir` para el Git común y `node_modules`, detección de `REQUEST_ORCHESTRATOR` y que `.gitignore` ignore también el enlace `node_modules`; comando `node --test --test-name-pattern='GATE-SWARM-001.*linked worktree|GATE-SWARM-001.*nounset' scripts/swarm.test.mjs`, exigir RED por permisos y propagación ausentes y registrar `.swarm/handoffs/orchestrator/T116.md`; Expected commit: `test(tooling): T116 define linked worktree execution contract [GATE-SWARM-001]`
- [x] T117 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Añadir a `scripts/swarm.sh` raíces escribibles explícitas para `$ROOT/.git` y `$ROOT/node_modules`, rechazar `REQUEST_ORCHESTRATOR` después de esperar ambos agentes y cambiar `.gitignore` a un patrón que ignore directorio y enlace; ejecutar el gate, `bash -n`, trazabilidad tasks/final y preflight de status limpio en ambos worktrees; evidencia `.swarm/handoffs/orchestrator/T117.md`; Expected commit: `fix(tooling): T117 support linked worktree agent writes [GATE-SWARM-001]`

**Checkpoint**: Ambos gates están GREEN, feature 001 y 002 pasan juntas y los contratos conservan
sus hashes congelados.

## Phase 2: Contratos congelados y entrada a implementación — `OWNER:orchestrator`

- [x] T092 [OWNER:orchestrator] [GREEN] Revalidar con `shasum -a 256` los contratos `specs/002-undo/contracts/domain-contract.md`, `ui-contract.md` y `traceability-contract.md`, cambiar exclusivamente `**Phase**` a `Implementing` en `specs/002-undo/traceability.md`, marcar T090–T092 completadas en `specs/002-undo/tasks.md`, registrar los SHAs reales de ambos gates y ejecutar `node scripts/verify-traceability.mjs --phase=tasks`; evidencia `.swarm/handoffs/orchestrator/T092.md`; Expected commit: `docs(traceability): T092 enter implementing lifecycle`
- [x] T109 [OWNER:orchestrator] [GREEN] Después de Analyze D y T105/T106 GREEN, revalidar hashes congelados, registrar sus SHAs en `specs/002-undo/traceability.md`, marcar T105/T106/T109 completadas, cambiar `**Phase**` de `Planned` a `Implementing` y ejecutar `node scripts/verify-traceability.mjs --phase=tasks`; evidencia `.swarm/handoffs/orchestrator/T109.md`; Expected commit: `docs(traceability): T109 re-enter implementing lifecycle`
- [x] T112 [OWNER:orchestrator] [GREEN] Después de Analyze E y T110/T111 GREEN, revalidar hashes, registrar sus SHAs, marcar T110/T111/T112 completadas, cambiar `**Phase**` de `Planned` a `Implementing` y ejecutar trazabilidad tasks; evidencia `.swarm/handoffs/orchestrator/T112.md`; Expected commit: `docs(traceability): T112 finalize swarm implementing lifecycle`
- [x] T115 [OWNER:orchestrator] [GREEN] Después de Analyze F y T113/T114 GREEN, registrar SHAs, marcar T113/T114/T115 completadas, restaurar `Implementing` y ejecutar trazabilidad tasks; evidencia `.swarm/handoffs/orchestrator/T115.md`; Expected commit: `docs(traceability): T115 finalize launch-parallel lifecycle`
- [x] T118 [OWNER:orchestrator] [GREEN] Después de Analyze G y T116/T117 GREEN, registrar SHAs, marcar T116/T117/T118 completadas, restaurar `Implementing`, actualizar ambos worktrees por fast-forward conservando sus RED preparados y ejecutar trazabilidad tasks; evidencia `.swarm/handoffs/orchestrator/T118.md`; Expected commit: `docs(traceability): T118 resume linked worktree lifecycle`
- [x] T119 [OWNER:orchestrator] [GREEN] Después de Analyze H, restaurar `Implementing`, rebasar domain e interfaz sobre el contrato de tareas corregido conservando sus commits y RED preparados, ejecutar trazabilidad tasks y registrar `.swarm/handoffs/orchestrator/T119.md`; Expected commit: `docs(traceability): T119 resume cohesive domain TDD lifecycle`
- [x] T120 [OWNER:orchestrator] [GREEN] Después de Analyze I, restaurar `Implementing`, rebasar ambos worktrees sobre el bloque cohesivo final y autorizar a domain a reconstruir únicamente sus commits locales T070/T071; ejecutar trazabilidad tasks y registrar `.swarm/handoffs/orchestrator/T120.md`; Expected commit: `docs(traceability): T120 finalize cohesive domain TDD lifecycle`
- [x] T121 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir en `scripts/swarm.test.mjs` `GATE-SWARM-001 preserves success for an unblocked handoff under errexit`, ejecutando la función real bajo `set -e`; exigir RED porque la ausencia de `REQUEST_ORCHESTRATOR` devuelve exit 1; comando `node --test --test-name-pattern='GATE-SWARM-001.*unblocked handoff' scripts/swarm.test.mjs`; evidencia `.swarm/handoffs/orchestrator/T121.md`; Expected commit: `test(tooling): T121 define successful handoff exit contract [GATE-SWARM-001]`
- [x] T122 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Hacer total `reject_blocked_handoff` en `scripts/swarm.sh`: fallar solo si existe `REQUEST_ORCHESTRATOR` y devolver éxito explícito en caso contrario; comandos `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh`, trazabilidad tasks/final y `scripts/swarm.sh launch-parallel`; evidencia `.swarm/handoffs/orchestrator/T122.md`; Expected commit: `fix(tooling): T122 preserve success for unblocked handoffs [GATE-SWARM-001]`
- [x] T123 [OWNER:orchestrator] [GREEN] Registrar en `specs/002-undo/traceability.md` los SHAs reales T121/T122, conservar `Implementing` y confirmar ambos worktrees listos para integración; comandos `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T123.md`; Expected commit: `docs(traceability): T123 resume successful launch lifecycle`
- [x] T124 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Añadir en `scripts/swarm.test.mjs` `GATE-SWARM-001 provides browser-capable E2E execution and propagates change requests`, exigiendo `danger-full-access` solo para `launch-e2e` y exit no cero ante `REQUEST_CHANGES`; comando `node --test --test-name-pattern='GATE-SWARM-001.*browser-capable E2E' scripts/swarm.test.mjs`; exigir RED porque E2E usa `workspace-write` y el handoff bloqueante se acepta; evidencia `.swarm/handoffs/orchestrator/T124.md`; Expected commit: `test(tooling): T124 define browser-capable E2E handoff contract [GATE-SWARM-001]`
- [x] T125 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Cambiar solo `scripts/swarm.sh` para ejecutar e2e con `danger-full-access`, conservar domain/interfaz en `workspace-write` y rechazar tanto `REQUEST_ORCHESTRATOR` como `REQUEST_CHANGES`; comandos `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh`, trazabilidad tasks/final y `scripts/swarm.sh launch-e2e`; evidencia `.swarm/handoffs/orchestrator/T125.md`; Expected commit: `fix(tooling): T125 enable browser-capable E2E handoffs [GATE-SWARM-001]`
- [x] T126 [OWNER:orchestrator] [GREEN] Después de Analyze J y T124/T125 GREEN, registrar sus SHAs en `specs/002-undo/traceability.md`, conservar `Implementing` y reanudar el worktree e2e sin reconstruir T080/T081; comandos `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T126.md`; Expected commit: `docs(traceability): T126 resume browser-capable E2E lifecycle`
- [x] T128 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [RED] Ampliar `scripts/swarm.test.mjs` con `GATE-SWARM-001 supports planned RED E2E resumes and Markdown change requests`, exigiendo que `.prompts/11-speckit-implement-e2e.md` y `.codex/agents/e2e.toml` distingan el baseline verde inicial de la reanudación posterior a T080–T085, y que `reject_blocked_handoff` rechace `REQUEST_CHANGES` con o sin comillas Markdown; comando `node --test --test-name-pattern='GATE-SWARM-001.*planned RED E2E' scripts/swarm.test.mjs`; exigir RED por precondición imposible y marcador escapado aceptado; evidencia `.swarm/handoffs/orchestrator/T128.md`; Expected commit: `test(tooling): T128 define phase-aware E2E resume contract [GATE-SWARM-001]`
- [x] T129 [OWNER:orchestrator] [GATE:GATE-SWARM-001] [GREEN] Hacer phase-aware la precondición E2E en `.prompts/11-speckit-implement-e2e.md` y `.codex/agents/e2e.toml`: antes de T080 exigir unit/component/build verdes; después de los RED commiteados exigir unit/build verdes, aceptar solo fallos component/E2E atribuibles literalmente a T080–T085 y detenerse ante cualquier fallo ajeno; robustecer `scripts/swarm.sh` para propagar marcadores bloqueantes con Markdown; comandos `node --test scripts/swarm.test.mjs`, `bash -n scripts/swarm.sh`, trazabilidad tasks/final; evidencia `.swarm/handoffs/orchestrator/T129.md`; Expected commit: `fix(tooling): T129 support planned RED E2E resumes [GATE-SWARM-001]`
- [x] T130 [OWNER:orchestrator] [GREEN] Después de Analyze L y T128/T129 GREEN, registrar sus SHAs en `specs/002-undo/traceability.md`, conservar `Implementing` y autorizar reanudar T086 desde `e7d38f5` sin reconstruir T080–T085 ni T127; comandos `node scripts/verify-traceability.mjs --phase=tasks` y `npm run verify:traceability`; evidencia `.swarm/handoffs/orchestrator/T130.md`; Expected commit: `docs(traceability): T130 resume phase-aware E2E lifecycle`

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

- [x] T064 [P] [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal`, `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` y `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal`; comando `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'`; evidencia `.swarm/handoffs/domain/T064.md`; Expected commit: `test(US5): T064 prove legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`
- [x] T065 [P] [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017] [GREEN] Añadir en `src/domain/game.ts` snapshot mínimo, historial requerido e inmutable y captura solo después de validar `PLAY_CELL`; migrar fixtures de `src/domain/game.test.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-HISTORIAL-01[5-7]'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T065.md`; Expected commit: `feat(US5): T065 record legal-only history points [AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017]`

### Una jugada, tablero, estado y turno

- [x] T066 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [RED] Añadir en `src/domain/game.test.ts` `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot`, `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot`, `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` y `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO`; comando `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'`; evidencia `.swarm/handoffs/domain/T066.md`; Expected commit: `test(US5): T066 prove exact single-move restoration [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`
- [x] T067 [US5] [OWNER:domain] [AC:AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008] [GREEN] Añadir `UNDO` a `GameAction` y restaurar atómicamente el último snapshot en `src/domain/game.ts`, eliminando exactamente una entrada; comandos `npm run test:unit -- --testNamePattern='AC-US5-(DOMINIO-(005|008)|ESTADO-00[6-7])'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T067.md`; Expected commit: `feat(US5): T067 restore one immutable snapshot [AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008]`

### Terminales, repetición y vacío

- [x] T068 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [RED] Añadir `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` con tres secuencias legales en `src/domain/game.test.ts`; comando `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'`; evidencia `.swarm/handoffs/domain/T068.md`; Expected commit: `test(US5): T068 prove terminal recovery is missing [AC-US5-TERMINAL-009]`
- [x] T069 [US5] [OWNER:domain] [AC:AC-US5-TERMINAL-009] [GREEN] Resolver `UNDO` antes del bloqueo terminal en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-TERMINAL-009'` y `npm run test:unit`; evidencia `.swarm/handoffs/domain/T069.md`; Expected commit: `feat(US5): T069 restore play from terminal states [AC-US5-TERMINAL-009]`
- [x] T070 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011,AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014,AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [RED] Completar en `src/domain/game.test.ts` el bloque cohesivo con los tests exactos de repetición `AC-US5-HISTORIAL-010/011`, límite vacío `AC-US5-UNWANTED-012/013/014` y RESET `AC-US5-RESET-018/019/020`; comando `npm run test:unit -- --testNamePattern='AC-US5-(HISTORIAL-01[0-1]|UNWANTED-01[2-4]|RESET-0(18|19|20))'`; exigir RED real por `canUndo` ausente. Si existen commits locales provisionales T070/T071, reconstruir solo esos dos para que este RED preceda al GREEN; preservar T064–T069; evidencia `.swarm/handoffs/domain/T070.md`; Expected commit: `test(US5): T070 prove cohesive Undo and RESET guard [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011 AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014 AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`
- [x] T071 [US5] [OWNER:domain] [AC:AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011,AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014,AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020] [GREEN] Conservar entradas anteriores, retirar solo la última por `UNDO`, mantener el no-op vacío, exportar `canUndo(state)` y conservar RESET atómico mediante `INITIAL_STATE` en `src/domain/game.ts`; comandos `npm run test:unit -- --testNamePattern='AC-US5-(HISTORIAL-01[0-1]|UNWANTED-01[2-4]|RESET-0(18|19|20))'`, `npm run test:unit` y `npm run build`; evidencia `.swarm/handoffs/domain/T071.md`; Expected commit: `feat(US5): T071 close cohesive Undo and RESET guard [AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011 AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014 AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020]`

## Phase 4: US-005 Interfaz — `OWNER:interfaz` (paralelo con domain)

### Control Undo

- [x] T076 [P] [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [RED] Crear `src/components/UndoButton.test.tsx` con `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true`, `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false`, `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` y `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color`; comando `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'`; evidencia `.swarm/handoffs/interfaz/T076.md`; Expected commit: `test(US5): T076 prove Undo control states and name [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`
- [x] T077 [P] [US5] [OWNER:interfaz] [AC:AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-A11Y-028,AC-US5-VISUAL-034] [GREEN] Crear `src/components/UndoButton.tsx` como botón nativo controlado por `available`/`onUndo`, con texto exacto, `aria-disabled`, guard e indicación `No disponible`; comandos `npm run test:component -- --testNamePattern='AC-US5-(DISPONIBILIDAD-00[3-4]|A11Y-028|VISUAL-034)'` y `npm run test:component`; evidencia `.swarm/handoffs/interfaz/T077.md`; Expected commit: `feat(US5): T077 render accessible Undo control states [AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-A11Y-028 AC-US5-VISUAL-034]`
- [x] T078 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [RED] Añadir en `src/components/UndoButton.test.tsx` `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez`, `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial`, `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` y `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender`; comando `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`; evidencia `.swarm/handoffs/interfaz/T078.md`; Expected commit: `test(US5): T078 prove native Undo activation and focus [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`
- [x] T079 [US5] [OWNER:interfaz] [AC:AC-US5-PUNTERO-021,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025] [GREEN] Completar activación nativa y nodo estable en `src/components/UndoButton.tsx`, sin listeners globales ni foco programático; comandos `npm run test:component -- --testNamePattern='AC-US5-(PUNTERO-021|TECLADO-02[3-4]|FOCO-025)'`, `npm run test:component` y `npm run build`; evidencia `.swarm/handoffs/interfaz/T079.md`; Expected commit: `feat(US5): T079 preserve native activation and focused node [AC-US5-PUNTERO-021 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025]`

### Contrato compatible de GameStatus

- [x] T095 [US5] [OWNER:interfaz] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030] [RED] Añadir en `src/components/GameStatus.test.tsx` `AC-US5-A11Y-029 acepta anuncio exacto Jugada deshecha Turno de X` y `AC-US5-A11Y-030 acepta anuncio exacto Jugada deshecha Turno de O`, conservando tests del fallback con `status` solamente; comando `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30)'`; evidencia `.swarm/handoffs/interfaz/T095.md`; Expected commit: `test(US5): T095 prove compatible GameStatus announcements [AC-US5-A11Y-029 AC-US5-A11Y-030]`
- [x] T096 [US5] [OWNER:interfaz] [AC:AC-US5-A11Y-029,AC-US5-A11Y-030] [GREEN] Extender solo `src/components/GameStatus.tsx` con `announcement?: string`, conservar `status` requerido, un único `role=status` y fallback canónico; comandos `npm run test:component -- --testNamePattern='AC-US5-A11Y-0(29|30)'`, `npm run test:component` y `npm run build`; evidencia `.swarm/handoffs/interfaz/T096.md`; Expected commit: `feat(US5): T096 preserve compatible GameStatus contract [AC-US5-A11Y-029 AC-US5-A11Y-030]`

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
- [x] T127 [US5] [OWNER:interfaz] [AC:AC-US5-FOCO-026] [RED] En `src/components/Board.test.tsx`, migrar todos los fixtures `App.initialState` a estados explícitos con `history: []` y ampliar el nombre/aserción de `AC-US4-TECLADO-005` con el literal `AC-US5-FOCO-026` para exigir nueve celdas→Deshacer jugada→Reiniciar partida; comando `npm run test:component -- --testNamePattern='AC-US(4-TECLADO-005|5-FOCO-026)'`, exigir RED solo por la composición Undo todavía ausente y registrar `.swarm/handoffs/interfaz/T127.md`; Expected commit: `test(US5): T127 migrate legacy App fixtures for Undo order [AC-US5-FOCO-026]`
- [ ] T131 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001] [RED] En `tests/e2e/tic-tac-toe.spec.ts`, ampliar el nombre de `AC-US4-RESPONSIVE-013` con el literal `AC-US5-INTERACCION-001` y cambiar el conteo esperado de diez a once botones, conservando la aserción de no superposición; comando `npm run test:e2e -- --grep='AC-US4-RESPONSIVE-013.*AC-US5-INTERACCION-001'`, exigir RED únicamente porque Undo aún no está compuesto y registrar `.swarm/handoffs/e2e/T131.md`; Expected commit: `test(US5): T131 migrate legacy responsive control count [AC-US5-INTERACCION-001]`

### GREEN cohesiva posterior a todas las RED

- [ ] T086 [US5] [OWNER:e2e] [AC:AC-US5-INTERACCION-001,AC-US5-INTERACCION-002,AC-US5-DISPONIBILIDAD-003,AC-US5-DISPONIBILIDAD-004,AC-US5-DOMINIO-005,AC-US5-ESTADO-006,AC-US5-ESTADO-007,AC-US5-DOMINIO-008,AC-US5-TERMINAL-009,AC-US5-HISTORIAL-010,AC-US5-HISTORIAL-011,AC-US5-UNWANTED-012,AC-US5-UNWANTED-013,AC-US5-UNWANTED-014,AC-US5-HISTORIAL-015,AC-US5-HISTORIAL-016,AC-US5-HISTORIAL-017,AC-US5-RESET-018,AC-US5-RESET-019,AC-US5-RESET-020,AC-US5-PUNTERO-021,AC-US5-PUNTERO-022,AC-US5-TECLADO-023,AC-US5-TECLADO-024,AC-US5-FOCO-025,AC-US5-FOCO-026,AC-US5-FOCO-027,AC-US5-A11Y-028,AC-US5-RESPONSIVE-032,AC-US5-RESPONSIVE-033,AC-US5-VISUAL-034] [GREEN] Después de T127/T131 RED, integrar de forma atómica `UndoButton` en `src/App.tsx` entre tablero y Reset con `available={canUndo(state)}` y un único callback `dispatch({type:'UNDO'})`; no añadir callback no-op ni CSS especulativo; comandos filtrados component para todos los AC salvo anuncios 029–031, `npm run test:e2e` y `npm run build`, permitiendo que solo los RED de anuncio T094 sigan fallando en component; evidencia `.swarm/handoffs/e2e/T086.md`; Expected commit: `feat(US5): T086 compose atomic Undo behavior [AC-US5-INTERACCION-001 AC-US5-INTERACCION-002 AC-US5-DISPONIBILIDAD-003 AC-US5-DISPONIBILIDAD-004 AC-US5-DOMINIO-005 AC-US5-ESTADO-006 AC-US5-ESTADO-007 AC-US5-DOMINIO-008 AC-US5-TERMINAL-009 AC-US5-HISTORIAL-010 AC-US5-HISTORIAL-011 AC-US5-UNWANTED-012 AC-US5-UNWANTED-013 AC-US5-UNWANTED-014 AC-US5-HISTORIAL-015 AC-US5-HISTORIAL-016 AC-US5-HISTORIAL-017 AC-US5-RESET-018 AC-US5-RESET-019 AC-US5-RESET-020 AC-US5-PUNTERO-021 AC-US5-PUNTERO-022 AC-US5-TECLADO-023 AC-US5-TECLADO-024 AC-US5-FOCO-025 AC-US5-FOCO-026 AC-US5-FOCO-027 AC-US5-A11Y-028 AC-US5-RESPONSIVE-032 AC-US5-RESPONSIVE-033 AC-US5-VISUAL-034]`
- [ ] T094 [US5] [OWNER:e2e] [AC:AC-US5-FOCO-025,AC-US5-A11Y-029,AC-US5-A11Y-030,AC-US5-A11Y-031] [GREEN] Entregar desde `src/App.tsx` el anuncio exacto una sola vez al `GameStatus` ya integrado, no crear evento en Undo vacío y mantener el nodo Undo enfocado; comandos `npm run test:component -- --testNamePattern='AC-US5-(FOCO-025|A11Y-0(29|30|31))'`, `npm run test:component`, `npm run test:e2e` y `npm run build`; evidencia `.swarm/handoffs/e2e/T094.md`; Expected commit: `feat(US5): T094 compose Undo focus and exact announcements [AC-US5-FOCO-025 AC-US5-A11Y-029 AC-US5-A11Y-030 AC-US5-A11Y-031]`

## Phase 6: Consolidación, release y auditoría

- [x] T097 [OWNER:orchestrator] [GREEN] Después de integrar domain e interfaz, consolidar SHAs/evidencia de `.swarm/handoffs/domain/**` y `.swarm/handoffs/interfaz/**` únicamente en `specs/002-undo/tasks.md` y `specs/002-undo/traceability.md`; ejecutar unit, component, build y `node scripts/verify-traceability.mjs --phase=tasks`; Expected commit: `docs(traceability): T097 consolidate parallel worker evidence`
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
                                                               ↓ fallo real set -u
                                           Plan/Tasks → Analyze F → T113 → T114 → T115
                                                               ↓ bloqueo de permisos
                                           Plan/Tasks → Analyze G → T116 → T117 → T118
                                  ↓ baseline + prepare
                    domain T064–T071 ║ interfaz T076–T079,T095–T096
                                  ↓ merge domain, sensores
                                  ↓ merge interfaz, sensores
                                 T097
                                  ↓
                       e2e RED T080–T085,T131
                                  ↓
                interfaz RED T127 → merge en rama e2e
                                  ↓
                         e2e GREEN T086 → T094
                                  ↓
                        T098 → T099 → T100 → T102
```

- `[P]` solo indica que el primer bloque de domain y el primer bloque de interfaz pueden comenzar
  desde la misma base; dentro de cada track las tareas son secuenciales porque comparten archivos.
- `e2e` depende explícitamente de ambos merges; si detecta un defecto ajeno, registra hallazgo y
  devuelve el trabajo al owner.
- T127 es un handoff RED de compatibilidad bajo ownership interfaz: el orquestador lo incorpora
  directamente en la rama e2e, sin dejar rojo el árbol principal; T086 es su GREEN de composición.
- T131 migra el conteo legacy responsive antes de T086. Los IDs T087, T093, T101, T103 y T104
  quedan retirados y nunca se reutilizan: la ejecución demostró que no representan cambios GREEN
  independientes de la composición atómica T086.
- Ningún worker toca `tasks.md` o `traceability.md`; T097/T098 consolidan desde la sesión principal.

## Coverage audit

| AC-ID | RED task(s) | GREEN task(s) | Test previsto | OWNER |
|---|---|---|---|---|
| AC-US5-INTERACCION-001 | T080, T131 | T086 | integración y conteo legacy de once controles | e2e |
| AC-US5-INTERACCION-002 | T080 | T086 | `App.integration.test.tsx` ubicación | e2e |
| AC-US5-DISPONIBILIDAD-003 | T076, T080 | T077, T086 | `UndoButton.test.tsx`; integración disponible | interfaz/e2e |
| AC-US5-DISPONIBILIDAD-004 | T076, T080 | T077, T086 | `UndoButton.test.tsx`; integración no disponible | interfaz/e2e |
| AC-US5-DOMINIO-005 | T066, T081 | T067, T086 | unit e integración tablero | domain/e2e |
| AC-US5-ESTADO-006 | T066, T081 | T067, T086 | unit e integración estado | domain/e2e |
| AC-US5-ESTADO-007 | T066, T081 | T067, T086 | unit e integración turno | domain/e2e |
| AC-US5-DOMINIO-008 | T066, T081 | T067, T086 | unit e integración una marca | domain/e2e |
| AC-US5-TERMINAL-009 | T068, T082 | T069, T086 | unit y E2E tres terminales | domain/e2e |
| AC-US5-HISTORIAL-010 | T070, T082 | T071, T086 | unit y E2E repetición | domain/e2e |
| AC-US5-HISTORIAL-011 | T070, T082 | T071, T086 | unit y E2E tablero vacío | domain/e2e |
| AC-US5-UNWANTED-012 | T070, T082 | T071, T086 | unit y E2E tablero no-op | domain/e2e |
| AC-US5-UNWANTED-013 | T070, T082 | T071, T086 | unit y E2E estado no-op | domain/e2e |
| AC-US5-UNWANTED-014 | T070, T082 | T071, T086 | unit y E2E disponibilidad no-op | domain/e2e |
| AC-US5-HISTORIAL-015 | T064, T083 | T065, T086 | unit y E2E jugada legal | domain/e2e |
| AC-US5-HISTORIAL-016 | T064, T083 | T065, T086 | unit y E2E celda ocupada | domain/e2e |
| AC-US5-HISTORIAL-017 | T064, T083 | T065, T086 | unit y E2E terminal rechazado | domain/e2e |
| AC-US5-RESET-018 | T070, T083 | T071, T086 | unit y E2E tablero reset | domain/e2e |
| AC-US5-RESET-019 | T070, T083 | T071, T086 | unit y E2E estado reset | domain/e2e |
| AC-US5-RESET-020 | T070, T083 | T071, T086 | unit y E2E historial reset | domain/e2e |
| AC-US5-PUNTERO-021 | T078, T084 | T079, T086 | componente e integración clic | interfaz/e2e |
| AC-US5-PUNTERO-022 | T084 | T086 | E2E toque | e2e |
| AC-US5-TECLADO-023 | T078, T084 | T079, T086 | componente/integración Enter | interfaz/e2e |
| AC-US5-TECLADO-024 | T078, T084 | T079, T086 | componente/integración Espacio | interfaz/e2e |
| AC-US5-FOCO-025 | T078, T084 | T079, T094 | componente/integración foco | interfaz/e2e |
| AC-US5-FOCO-026 | T080, T127 | T086 | integración y fixture legacy del orden de foco | interfaz/e2e |
| AC-US5-FOCO-027 | T085 | T086 | E2E contorno | e2e |
| AC-US5-A11Y-028 | T076, T084 | T077, T086 | componente/integración nombre | interfaz/e2e |
| AC-US5-A11Y-029 | T095, T084 | T096, T094 | GameStatus/integración anuncio X | interfaz/e2e |
| AC-US5-A11Y-030 | T095, T084 | T096, T094 | GameStatus/integración anuncio O | interfaz/e2e |
| AC-US5-A11Y-031 | T084 | T094 | integración sin anuncio falso | e2e |
| AC-US5-RESPONSIVE-032 | T085 | T086 | E2E 320–1920 px | e2e |
| AC-US5-RESPONSIVE-033 | T085 | T086 | E2E zoom 200 % | e2e |
| AC-US5-VISUAL-034 | T076, T085 | T077, T086 | componente/E2E señal textual | interfaz/e2e |

## Gate audit

| GATE-ID | RED | GREEN | Test previsto | OWNER |
|---|---|---|---|---|
| GATE-MULTIFEATURE-001 | T062, T088 | T063, T089 | `scripts/verify-traceability.test.mjs` | orchestrator |
| GATE-SWARM-001 | T090, T105, T110, T113, T116, T121, T124, T128 | T091, T106, T111, T114, T117, T122, T125, T129 | `scripts/swarm.test.mjs` | orchestrator |

## Metrics

- 59 Task IDs de feature 002, todos globalmente únicos; T072–T075, T087, T093, T101, T103 y T104
  quedan retirados y no se reutilizan.
- 20 tareas de tooling, 38 tareas de producto/lifecycle/consolidación y una auditoría read-only.
- 34/34 AC con al menos un RED y un GREEN; toda evidencia de producto contiene AC-ID literal.
- 2 gates con pares RED/GREEN y test previsto.
- 42 AC de feature 001 son regresión obligatoria en baseline, candidata, verificación y review.
