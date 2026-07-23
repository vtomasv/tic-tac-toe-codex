# Implementation Plan: Deshacer la última jugada

**Git branch at planning time**: `main` | **Spec Kit feature key**: `002-undo` | **Date**: 2026-07-22 | **Spec**: `specs/002-undo/spec.md`  
**Input**: Feature specification from `specs/002-undo/spec.md`  
**Spec SHA-256 frozen for planning**: `62ee01f78133fea16d4f60ef4c8beb6f4a7d540f4d52a7d866290ae08ccc0cb6`  
**Constitution SHA-256 frozen for planning**: `5dd15c01cbc82f35fa0450c60fcee98eb01d4a27d08b3a119b776b32eb84e283`

## Summary

La feature incorpora una acción de dominio `UNDO` y un historial inmutable de snapshots no recursivos. Cada `PLAY_CELL` legal guarda el snapshot canónico inmediatamente anterior; `UNDO` restaura el último snapshot y elimina una sola entrada; `RESET` devuelve el estado inicial con historial vacío. El dominio conserva toda decisión de reglas y expone la disponibilidad de Undo mediante un selector.

La interfaz añade un control presentacional controlado por `available` y `onUndo`. `GameStatus`
conserva su contrato existente y admite una prop opcional de anuncio con fallback canónico.
`src/App.tsx` conecta el reducer, el control, el foco y el único anuncio de estado, sin reconstruir
reglas.

La planificación usa dos pases deliberados. El primer pase Tasks crea únicamente los pares
canónicos que el verificador actual puede representar y un ledger `PLANNED`; el primer Analyze
autoriza solo `T062/T063`. Ese gate fundacional incorpora descubrimiento multi-feature, estados de
ciclo de vida y evidencia suplementaria. Después se regenera Tasks sin renumerar trabajo ya
commiteado, se valida el modelo ampliado y se repite Analyze. El fan-out de producto comienza
únicamente con el segundo Analyze en GO y el baseline completo en verde.

El pase ampliado también incorpora `GATE-SWARM-001`: un preflight TDD del runner que exige resolver
los prompts versionados desde `.prompts/` antes de crear worktrees. Este gate es operacional,
pertenece al orquestador y no modifica contratos ni código de producto.

## Technical Context

**Language/Version**: TypeScript estricto sobre Node.js `24.18.0`  
**Primary Dependencies**: React 19, React DOM 19, Vite; sin dependencias nuevas  
**Storage**: Memoria local de la pestaña; sin persistencia, backend ni red  
**Testing**: Vitest para dominio y componentes; React Testing Library y user-event para componentes/integración; Playwright para E2E  
**Target Platform**: Navegadores modernos, 320–1920 px y zoom del 200 %  
**Project Type**: Aplicación web cliente de un único paquete  
**Performance Goals**: Transiciones deterministas sobre nueve celdas; `UNDO` acotado por un historial máximo de nueve snapshots disponibles  
**Constraints**: Dominio puro e inmutable; UI sin reglas; sin dependencias ni cambios de lockfile; una sola región viva; IDs y Task IDs globales  
**Scale/Scope**: Una historia (`US-005`), 34 AC nuevos, 42 AC previos de regresión, cinco estados canónicos

## Constitution Check

### Antes del diseño

- [x] La spec activa se resolvió desde `.specify/feature.json` como `specs/002-undo`.
- [x] `spec.md` no contiene marcadores de aclaración pendientes.
- [x] Cada uno de los 34 AC tiene ID global `AC-US5-*`, patrón EARS explícito y observable principal.
- [x] Los 42 AC de la feature 001 permanecen como baseline de regresión y no se modifican.
- [x] La arquitectura mantiene reglas e historial en `src/domain/`, presentación en `src/components/` y composición en `src/App.tsx`.
- [x] No se añaden dependencias ni se modifican `package.json` o lockfiles durante Plan.
- [x] Cada AC tendrá un test RED que contenga literalmente su ID antes de GREEN.
- [x] El nuevo gate usa `GATE-MULTIFEATURE-001`, globalmente único en el repositorio.
- [x] Los primeros Task IDs reservados después de `T061` son `T062` RED y `T063` GREEN para el gate fundacional.

### Después del diseño

- [x] `GameState` tiene una sola forma válida: tablero, estado canónico e historial requerido.
- [x] El historial contiene snapshots no recursivos y no puede registrar intentos rechazados.
- [x] `UNDO` y `RESET` tienen transiciones totales y deterministas, incluido el no-op vacío.
- [x] La UI recibe disponibilidad y callback; no importa reducer ni calcula disponibilidad.
- [x] App obtiene la disponibilidad del dominio y conserva un único mecanismo de anuncio.
- [x] La migración de fixtures evita tanto propiedades opcionales como normalización implícita.
- [x] El primer ledger `PLANNED` es representable por el verificador vigente y existe antes del
  primer Analyze.
- [x] El gate final descubre, valida y agrega todas las features con tripleta completa, aplica
  unicidad global y distingue validación estructural de evidencia de release.
- [x] El segundo pase Tasks se ejecuta después de integrar el gate y antes del segundo Analyze.
- [x] `GameStatus` conserva compatibilidad de fuente para todos sus consumidores existentes.
- [x] Todo test de composición y E2E de Undo entra en RED antes de implementar el cableado en App.
- [x] Ownership, contratos congelados, secuencia de merges y sensores no se solapan.
- [x] No se introducen excepciones constitucionales.

## Architecture

### Dominio

`GameSnapshot` representa exclusivamente `board` y `status`. `GameState` añade un `history` requerido de snapshots. El historial no contiene otros historiales, por lo que el modelo es mínimo, no recursivo y acotado por las nueve jugadas que puede contener un tablero.

El reducer conserva el orden de decisión:

1. `RESET` devuelve el estado inicial y descarta todo historial.
2. `UNDO` restaura la última entrada o devuelve el mismo estado si el historial está vacío.
3. Un estado terminal rechaza `PLAY_CELL` sin alterar estado ni historial.
4. Un índice inválido o una celda ocupada rechaza `PLAY_CELL` sin alterar estado ni historial.
5. Una jugada legal añade exactamente el snapshot previo y calcula victoria, empate o siguiente turno con las reglas existentes.

El dominio expone `canUndo(state)` para que App no deduzca reglas a partir de la representación interna. Ningún código de dominio conoce React, DOM, foco o anuncios.

### Componente de interfaz

El control `UndoButton` es controlado por props:

- `available: boolean`
- `onUndo: () => void`

Usa un `<button type="button">` cuyo nombre visible y accesible es exactamente `Deshacer jugada`. Para mantenerlo en el orden de foco aun cuando no haya historial, la indisponibilidad se expresa con `aria-disabled="true"` y el callback se bloquea en la frontera del componente. Una indicación textual visible `No disponible`, separada del nombre accesible, proporciona la señal no cromática. La semántica nativa cubre puntero, toque, Enter y Espacio.

El componente no recibe `GameState`, no importa el reducer y no calcula si existe historial.

### Compatibilidad congelada de `GameStatus`

El componente existente conserva `status` como prop requerida y añade exactamente una prop opcional:

```ts
type GameStatusProps = Readonly<{
  status: Status
  announcement?: string
}>
```

- Con `announcement === undefined`, renderiza exactamente el texto canónico actual derivado de
  `status`; por tanto, `<GameStatus status={status} />` sigue compilando y conserva los 42 AC previos.
- Con `announcement`, presenta exactamente ese texto en el mismo nodo `role="status"`.
- `GameStatus` no decide cuándo ocurrió Undo, no traduce acciones y no crea una segunda región viva.
- La opcionalidad permite que interfaz implemente y compile su contrato desde la base paralela sin
  esperar cambios en `src/App.tsx`.

### Composition root

`src/App.tsx`:

- conserva `useReducer(gameReducer, initialState)`;
- obtiene `available` exclusivamente con `canUndo(state)`;
- despacha `{ type: 'UNDO' }` desde el callback;
- coloca el control después del tablero y antes de Reiniciar;
- mantiene el nodo del control estable para que el foco permanezca tras Undo;
- conserva el único `role="status"` visible y le entrega el anuncio exacto de Undo sin mover foco;
- limpia el anuncio específico al producirse una jugada o reinicio posterior;
- no inspecciona snapshots ni implementa victoria, empate, historial o restauración.

Una activación aceptada marca un evento Undo pendiente y despacha la acción. Después de que el
reducer publique el estado restaurado, App consume ese evento una sola vez y selecciona el anuncio
desde el `status` ya restaurado: `PLAYING_X` produce `Jugada deshecha. Turno de X` y `PLAYING_O`
produce `Jugada deshecha. Turno de O`. App no consulta snapshots ni predice el próximo estado. El
callback no puede ejecutarse cuando `canUndo` es falso, por lo que no se crea un evento pendiente ni
se emite un anuncio falso.

## Compatibility and Migration Strategy

La migración es deliberadamente estricta:

1. `history` pasa a ser una propiedad requerida de `GameState`; no se admite `history?`, unión legacy ni normalización silenciosa.
2. `INITIAL_STATE` incluye un historial vacío inmutable.
3. Los tests unitarios que construyen estados usan un helper local que siempre devuelve el estado completo.
4. Los fixtures de componentes que hoy entregan literales a `App.initialState` se convierten previamente en valores creados por un helper local con `history: []`. Al pasar una variable estructural, esa migración puede prepararse en paralelo sobre la base antigua y satisface el contrato nuevo al integrar dominio.
5. Los fixtures terminales de render con historial vacío continúan significando explícitamente “estado inicializado sin puntos de Undo”; los escenarios de Undo terminal se crean mediante jugadas legales o snapshots completos con historial coherente.
6. No se cambia la semántica de victoria, empate, bloqueo terminal, celda ocupada o reinicio existente, salvo el descarte explícito de historial de `RESET`.

Esto mantiene una única representación de runtime y evita estados donde la ausencia de `history` tenga significado ambiguo.

## Multi-feature Traceability Gate

`scripts/verify-traceability.mjs` se extenderá bajo `GATE-MULTIFEATURE-001` sin cambiar `npm run verify:traceability`.

### Ciclo de vida del ledger

El ledger declara exactamente una fase: `PLANNED`, `IMPLEMENTING`, `RELEASE_CANDIDATE` o
`VERIFIED`. El parser normaliza el valor declarado sin distinguir mayúsculas de minúsculas, de modo
que los encabezados existentes `Planned` y `Verified` de las features 001/002 conservan
compatibilidad. Un valor ausente o desconocido es error determinista.

#### Pase bootstrap compatible

1. El primer `speckit-tasks` conserva `T062/T063` para el gate y asigna a cada AC un único par
   canónico RED/GREEN. No introduce todavía pares suplementarios para el mismo AC.
2. `traceability.md` se crea como `PLANNED` con 34 filas AC y una fila
   `GATE-MULTIFEATURE-001`. Solo SHA y resultados futuros usan `PENDING`.
3. El verificador vigente en `--phase=tasks` debe aceptar esa forma antes del primer Analyze.
4. El primer Analyze en GO autoriza exclusivamente la implementación RED/GREEN de `T062/T063`;
   todavía no autoriza worktrees ni tareas de producto.

#### Migración del gate

5. `T063` añade el modelo de ciclo de vida y la representación de múltiples pares RED/GREEN por AC.
6. En `--phase=tasks`, `PLANNED` e `IMPLEMENTING` aceptan evidencia `PENDING`, pero no aceptan
   cobertura, tests, ownership o enlaces estructurales ausentes.
7. En `--phase=final`, todas las tripletas se descubren y participan en parsing, unicidad global y
   unión de Task IDs. La evidencia de commit/test completa se exige a
   `RELEASE_CANDIDATE` y `VERIFIED`; `PLANNED` e `IMPLEMENTING` se reportan y validan
   estructuralmente sin convertir su evidencia futura en un fallo del baseline de release.
8. `RELEASE_CANDIDATE` y `VERIFIED` rechazan cualquier `PENDING`, evidencia ausente o SHA
   incongruente con `git log`.

#### Pase ampliado y cierre

9. Después de `T063`, se regenera Tasks preservando Task IDs ya commiteados y anexando IDs globales
   nuevos para evidencia suplementaria de integración/E2E y para las transiciones de ciclo de vida
   propiedad del orquestador.
10. El ledger incorpora esa evidencia con el esquema ampliado; el nuevo `--phase=tasks` debe pasar y
    se ejecuta un segundo Analyze.
11. Tras un segundo Analyze en GO, el orquestador congela contratos, cambia y commitea
    `IMPLEMENTING`, y ejecuta el baseline completo sobre ese commit exacto. Solo PASS permite crear
    worktrees de producto.
12. Tras reemplazar todos los `PENDING` con SHAs reales, el orquestador cambia a
    `RELEASE_CANDIDATE`, ejecuta el gate final y solo después de PASS cambia a `VERIFIED` y repite
    la validación.

Ningún worker edita el ledger. El orquestador completa evidencias desde handoffs y `git log`; nunca
inventa ni reconstruye retrospectivamente el mapeo.

## Swarm Runner Gate

`GATE-SWARM-001` protege la frontera previa a `launch-parallel` sin añadir dependencias:

- un test Node en `scripts/swarm.test.mjs` inspecciona `scripts/swarm.sh` y exige que
  `PROMPT_ROOT` apunte a `.prompts/`;
- el test exige que existan los prompts versionados
  `.prompts/09-speckit-implement-domain.md` y
  `.prompts/10-speckit-implement-interfaz.md`;
- RED debe fallar por la ruta legacy `prompts/`, antes de modificar el runner;
- GREEN cambia únicamente la resolución de ruta y el texto de ayuda asociado;
- un segundo par RED/GREEN exige que cada worktree tenga acceso explícito al `node_modules` ya
  validado en la raíz, mediante un enlace local no versionado, antes de invocar Codex;
- ese segundo par exige que los prompts domain/interfaz nombren el gate estructural y una auditoría
  de diff limitada a su ownership, en vez de referirse a un “gate de frontera” inexistente;
- un tercer par valida el contrato de la CLI instalada: prohíbe `--ask-for-approval` y fija
  `-c 'approval_policy="never"'` junto con `--ephemeral` y `--sandbox`;
- un cuarto par reproduce el preflight real bajo `set -u` y prohíbe declaraciones `local` que
  referencien una variable en la misma sentencia donde se inicializa;
- el gate queda verde y con SHAs reales antes de cambiar el ledger a `IMPLEMENTING`;
- `launch-parallel` conserva sus comprobaciones de rama, árbol limpio y baseline completo antes de
  crear worktrees o invocar Codex.

Los tests del gate no lanzan agentes ni crean worktrees. Demuestran estáticamente que el runner
localiza prompts versionados, prepara dependencias, usa opciones aceptadas por Codex CLI y entrega
comandos de frontera inequívocos.

### Descubrimiento

- Enumerar directorios inmediatos de `specs/` que coincidan con `NNN-*`, ordenados lexicográficamente.
- Descubrir toda feature que contenga la tripleta `spec.md`, `tasks.md` y `traceability.md`, con
  independencia de su fase de ciclo de vida.
- Leer `**Phase**` de cada ledger y normalizarlo al enum interno sin exigir cambios retroactivos de
  capitalización a feature 001.
- En fase final, reportar de forma determinista cualquier feature numerada parcialmente formada en vez de excluirla silenciosamente.
- Mantener `.specify/feature.json` como selector de la feature activa para los comandos Spec Kit y las fases parciales; no usarlo para limitar la validación final.

### Validación y agregación

- Ejecutar la validación existente por separado para cada feature completa.
- Prefijar cada diagnóstico con el slug de feature y ordenar feature, categoría e ID.
- Construir una unión de modelos únicamente después de que cada feature haya sido parseada.
- Exigir unicidad global de definiciones `AC-*`, `GATE-*` y declaraciones `Tnnn`; las referencias repetidas válidas dentro de tests, commits y ledger no cuentan como nuevas definiciones.
- Parsear `git log` una vez y cruzarlo contra la unión de tasks de todas las tripletas descubiertas,
  evitando que commits de una feature verificada aparezcan como Task IDs desconocidos al activar otra.
- Aplicar obligaciones de evidencia según el ciclo de vida sin excluir ninguna feature del
  descubrimiento, la unicidad global o la unión de tasks.
- Agregar conteos por feature y globales; cualquier diagnóstico produce exit code `1`, ausencia de diagnósticos produce `0`.
- Conservar la compatibilidad de parsing y mensajes relevantes de la feature 001.

### RED/GREEN del gate

- `T062` será el test RED de `GATE-MULTIFEATURE-001` en `scripts/verify-traceability.test.mjs`.
- `T063` será la implementación GREEN en `scripts/verify-traceability.mjs`.
- Los tests usarán utilidades de Node ya disponibles y fixtures temporales: dos features válidas,
  duplicados globales de AC/GATE/Task, feature parcial, orden determinista, selección activa
  independiente, commits contra la unión, fases válidas/inválidas, `PLANNED` compatible con
  baseline final, `RELEASE_CANDIDATE` con `PENDING` rechazado y evidencia suplementaria con varios
  pares RED/GREEN por AC.
- Cada test nuevo contendrá literalmente `GATE-MULTIFEATURE-001`.

## Test Strategy

RED precede a GREEN y se conserva en commits separados. El contrato `contracts/traceability-contract.md` asigna los 34 AC a nombres de test concretos; cada test contiene literalmente su AC-ID.

| Nivel | Propietario | Alcance principal | Sensores |
|---|---|---|---|
| Unit | domain | historial, una jugada, repetición, vacío, rechazadas, terminales, reset, selector | `npm run test:unit` |
| Component | interfaz | visibilidad controlada, disponibilidad, nombre, puntero/teclado, foco propio, señal no cromática | `npm run test:component` |
| Integration | e2e | composición real, disponibilidad, restauración, orden/permanencia de foco, anuncios exactos y ausencia de anuncio falso | `npm run test:component` |
| E2E | e2e | toque, los tres terminales, repetición hasta vacío, reset irreversible, secuencia solo teclado, zoom, cuatro anchos y regresión | `npm run test:e2e` |
| Gate | orquestador | descubrimiento multi-feature, unicidad global, unión de commits, errores, exit code y resolución de prompts del swarm | `node --test scripts/verify-traceability.test.mjs`, `node --test scripts/swarm.test.mjs` y `npm run verify:traceability` |

Los escenarios con tablero y estado restaurados mantienen assertions separadas. Los escenarios sin historial prueban por separado tablero, estado, indisponibilidad y ausencia de anuncio. La suite final incluye los 42 criterios de la feature 001 sin editar sus IDs ni su spec.

### Orden TDD obligatorio para composición

La evidencia suplementaria se materializa en el segundo pase Tasks, después de que `T063` pueda
representarla y antes del segundo Analyze. El bloque e2e no puede introducir `UndoButton`,
`canUndo`, `dispatch(UNDO)`, anuncios ni estilos en App antes de crear toda la evidencia RED que
depende de esa composición:

1. RED de integración para ubicación/disponibilidad, restauración separada de tablero y estado,
   turno, una jugada, foco, orden, anuncios X/O y ausencia de anuncio falso.
2. RED E2E para toque, `WON_X`, `WON_O`, `DRAW`, Undo repetido hasta vacío, reset irreversible,
   secuencia completa solo teclado, señal no cromática y responsive/zoom.
3. Confirmación de que ambos grupos fallan por ausencia de la composición Undo, no por setup.
4. Solo entonces GREEN de `src/App.tsx` y estilos, seguido de ambos sensores completos.

Las RED se separan por familia observable: shell/orden/disponibilidad, restauración, terminales,
repetición/vacío, reset, puntero/toque, teclado, foco/anuncios y responsive/señal no cromática.
Todas preceden al bloque GREEN. Las GREEN se dividen por responsabilidad de producción:

1. shell, orden y disponibilidad;
2. conexión única `onUndo` → dominio para restauración y flujos;
3. anuncio y permanencia de foco;
4. estilos responsive y señal no cromática.

El ledger ampliado puede enlazar varios pares a un AC y varias GREEN a un bloque RED cohesivo, pero
ningún commit reclama comportamientos no declarados en su task ni agrupa familias no relacionadas.

## Contracts Freeze

Después del segundo pase Tasks y del segundo Analyze en GO, antes del fan-out se congelan:

- `contracts/domain-contract.md`: tipos, acciones, selector, invariantes y tabla de transiciones.
- `contracts/ui-contract.md`: props, DOM, firma opcional compatible de `GameStatus`, accesibilidad,
  foco, anuncio e integración.
- `contracts/traceability-contract.md`: IDs, RED/GREEN, matriz AC-test, gate multi-feature y
  preflight del swarm.

Después del freeze, cualquier cambio material de firma o semántica detiene el trabajo y vuelve a Plan/Analyze; ningún agente adapta el contrato unilateralmente.

## Ownership and Merge Order

| Fase | Propietario | Escritura permitida | Dependencias |
|---|---|---|---|
| Bootstrap SDD | orquestador | `tasks.md` y `traceability.md` canónicos | Plan; antes del primer Analyze |
| Gate fundacional | orquestador | `scripts/verify-traceability.mjs`, su test y evidencia de su fila del ledger | Primer Analyze GO; autoriza solo T062/T063 |
| SDD ampliado | orquestador | `tasks.md` y `traceability.md` suplementarios | Gate integrado; nuevo `--phase=tasks`; antes del segundo Analyze |
| Dominio | domain | `src/domain/**` y tests unitarios | Segundo Analyze GO, baseline verde y contratos congelados |
| Interfaz | interfaz | nuevo componente y tests, extensión contratada de `GameStatus` y migración de fixtures bajo `src/components/**` | Segundo Analyze GO, baseline verde y contrato UI congelado |
| Integración | e2e | `src/App.tsx`, test de integración de App, `tests/e2e/**`, estilos globales asignados | Domain e interfaz integrados |
| Consolidación incremental | orquestador | campos de evidencia de `traceability.md`, SHAs y merges | Handoff de cada propietario |
| Auditoría | reviewer | solo lectura | Diff consolidado y `speckit-converge` completado |

Domain e interfaz parten de la misma base verde y trabajan en paralelo. Se integra domain y se ejecutan sus sensores; luego interfaz y sus sensores. E2E nace de la base que ya contiene ambos merges. No se comparten archivos de escritura entre agentes.

## Project Structure

### Documentation for this feature

```text
specs/002-undo/
├── spec.md                         # Fuente de verdad, sin cambios en Plan
├── plan.md                         # Este documento
├── research.md                     # Decisiones y alternativas
├── data-model.md                   # Estado, historial e invariantes
├── quickstart.md                   # Orden de ejecución y validación
├── contracts/
│   ├── domain-contract.md
│   ├── ui-contract.md
│   └── traceability-contract.md
└── checklists/                     # Checklists existentes, sin reemplazo
```

### Source tree affected during later implementation

```text
src/
├── domain/
│   ├── game.ts
│   └── game.test.ts
├── components/
│   ├── UndoButton.tsx
│   ├── UndoButton.test.tsx
│   └── ...fixtures/tests existentes migrados por su propietario
├── App.tsx
└── styles.css

tests/e2e/
└── game.spec.ts

scripts/
├── verify-traceability.mjs
├── verify-traceability.test.mjs
├── swarm.sh
└── swarm.test.mjs
```

**Structure Decision**: Se mantiene la estructura actual. No se crean capas, paquetes ni dependencias nuevas. El único componente nuevo es presentacional; el historial permanece dentro del modelo de dominio existente.

## Phase 0: Research Outcome

`research.md` cierra la forma no recursiva del historial, la migración requerida, la firma compatible
de `GameStatus`, el ciclo de vida en dos pases del ledger, el mecanismo de anuncio, el gate
multi-feature y la estrategia TDD granular de integración. No quedan incógnitas técnicas abiertas.

## Phase 1: Design Outcome

`data-model.md` define entidades e invariantes. Los tres contratos congelan fronteras y trazabilidad.
`quickstart.md` fija el orden bootstrap→Analyze A→gate→Tasks ampliadas→Analyze B→fan-out→merges y los
comandos de aceptación. Plan no crea código, tests, `tasks.md` ni `traceability.md`; exige regenerar
ambos artefactos derivados para que adopten el nuevo ciclo antes de repetir Analyze.

## Final Verification Commands

```bash
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability
```

## Complexity Tracking

No existen violaciones constitucionales que justificar. El snapshot separado evita recursión; el selector evita reglas en App; el gate se amplía en el script existente; la migración hace obligatorio el historial sin capa de compatibilidad permanente.
