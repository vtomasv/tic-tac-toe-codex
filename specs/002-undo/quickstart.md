# Quickstart: Feature 002 Undo

## Purpose

Esta guía fija el orden de trabajo y validación para implementar posteriormente `US-005 - Deshacer la última jugada`. Plan no autoriza todavía cambios de producción ni tests.

## Prerequisites

- Feature activa de Spec Kit `002-undo`; `.specify/feature.json` apunta a `specs/002-undo`.
- Los branches/worktrees de producto se crean solo después del gate fundacional integrado, el
  segundo Analyze en GO y el baseline completo verde.
- El primer Analyze autoriza únicamente el tooling `T062/T063`; no autoriza producto.
- `spec.md`, constitución y contratos de este directorio sin cambios materiales.
- `tasks.md` generado con IDs posteriores a `T061`.
- `traceability.md` bootstrap en fase `PLANNED`, con 35 filas canónicas y evidencias futuras
  `PENDING`.
- `speckit-analyze` sin hallazgos CRITICAL/HIGH antes del gate y repetido sin bloqueantes después de
  regenerar Tasks con el modelo ampliado.
- Sin dependencia nueva, lockfile modificado ni ownership solapado.

## Required artifact order

```text
Specify → Clarify → Checklist → Plan
                                  ↓
                Tasks bootstrap → Ledger PLANNED → Analyze A
                                                       ↓ GO: solo T062/T063
                                                Gate RED/GREEN
                                                       ↓
                  Tasks ampliadas → Ledger ampliado → Analyze B → baseline
                                                                    ↓
                                      domain ────────┐
                                                     ├─ integration/e2e
                                      interfaz ──────┘
                                                                    ↓
                                      RELEASE_CANDIDATE → final → VERIFIED
                                                                    ↓
                                                        Converge → Review
```

Si el análisis encuentra una contradicción material entre spec, plan, contratos y tasks, el trabajo se detiene y vuelve al artefacto fuente correspondiente.

## Contract freeze

Después del segundo Analyze en GO y antes del fan-out, el orquestador registra como congelados:

- `contracts/domain-contract.md`;
- `contracts/ui-contract.md`;
- `contracts/traceability-contract.md`;
- `data-model.md`.

El freeze incluye `GameState.history` requerido, `GameAction.UNDO`, `canUndo`, props del botón,
`GameStatus(status, announcement?)`, anuncio único, ciclo del ledger, `GATE-MULTIFEATURE-001`,
`GATE-SWARM-001` y orden de merges.

## Stage 0: Bootstrap ledger and Analyze A

El primer pase `speckit-tasks`:

1. conserva `T062/T063` como RED/GREEN de `GATE-MULTIFEATURE-001`;
2. asigna un único par canónico RED/GREEN a cada AC, sin pares suplementarios;
3. crea `traceability.md` en fase `PLANNED` con 34 filas AC y una fila del gate;
4. registra archivos y nombres literales de test y usa `PENDING` solo para evidencia futura;
5. ejecuta el verificador vigente en `--phase=tasks`;
6. ejecuta `speckit-analyze` como Analyze A.

Analyze A debe evaluar una forma que el verificador actual pueda representar. Si tiene CRITICAL/HIGH,
no se inicia `T062`. Si está en GO, autoriza solo las dos tasks del gate; no se crean worktrees de
producto.

## Stage 1: Foundational traceability gate

El orquestador trabaja primero y de forma secuencial:

1. `T062` añade tests RED con `GATE-MULTIFEATURE-001` a `scripts/verify-traceability.test.mjs`.
2. Se confirma que fallan por falta de descubrimiento/agregación multi-feature, no por setup.
3. Se registra un commit tooling RED con el formato constitucional.
4. `T063` implementa GREEN en `scripts/verify-traceability.mjs`.
5. Se confirma compatibilidad de feature 001, orden determinista y exit code binario.
6. Se registra un commit tooling GREEN.
7. El orquestador reemplaza los `PENDING` de la fila del gate por los SHA reales.
8. Se prueban las cuatro fases de ledger, la unión global de tasks y la evidencia suplementaria.
9. El gate queda integrado antes de regenerar el grafo ampliado.

El comando npm público no cambia:

```bash
npm run verify:traceability
```

## Stage 2: Expanded Tasks, Analyze B and baseline

Con el gate integrado, el orquestador:

1. repite `speckit-tasks`;
2. preserva todo Task ID ya commiteado y anexa nuevos IDs globales;
3. añade pares suplementarios de integración/E2E sin agrupar familias no relacionadas y tasks del
   orquestador para las transiciones de fase;
4. actualiza el ledger con el esquema ampliado, todavía en `PLANNED`;
5. ejecuta el nuevo `--phase=tasks`;
6. repite `speckit-analyze` como Analyze B;
7. si Analyze B está en GO, ejecuta RED/GREEN de `GATE-SWARM-001` para demostrar que
   `scripts/swarm.sh` resuelve prompts desde `.prompts/`, enlaza dependencias en cada worktree y
   usa opciones soportadas por Codex CLI, además de entregar auditorías de ownership explícitas,
   sin lanzar agentes ni crear worktrees durante tests;
8. congela contratos, cambia el ledger a `IMPLEMENTING` y commitea esa transición mediante su task
   de orquestador;
9. ejecuta unit, component, E2E, build y traceability sobre ese commit exacto;
10. ejecuta `scripts/swarm.sh prepare` y crea los worktrees de producto solo si todo el baseline
    está verde.

En la validación final de baseline, feature 002 sigue descubierta, participa en unicidad global y en
la unión de tasks, pero su evidencia futura `PENDING` no se trata como evidencia de release. Feature
001 permanece validada como `VERIFIED`.

## Stage 3: Parallel product work

### Domain owner

Escritura exclusiva bajo `src/domain/**`:

1. Crea los tests RED unitarios asignados, cada uno con AC-ID literal.
2. Migra todos los fixtures unitarios a `GameState` con historial requerido.
3. Implementa snapshot, historial, `UNDO`, `RESET` y `canUndo`.
4. Conserva las reglas previas y la pureza del reducer.
5. Ejecuta unit y build según las tasks.
6. Entrega commits RED/GREEN y handoff sin tocar componentes o App.

### Interface owner

Escritura exclusiva asignada bajo `src/components/**`:

1. Prepara helpers de fixtures existentes con historial vacío explícito y estructuralmente compatibles con la base anterior.
2. Crea tests RED del componente `UndoButton` con AC-ID literal.
3. Crea RED de frontera de `GameStatus` para los anuncios exactos X/O con AC029/AC030; la suite
   previa y el build confirman el fallback al omitir la prop.
4. Implementa el botón controlado, la indicación `No disponible` y
   `GameStatus(status, announcement?)`.
5. Ejecuta component y build con el `App.tsx` anterior para demostrar independencia.
6. Mantiene reglas fuera de la UI.
7. Entrega commits RED/GREEN y handoff sin tocar App, dominio, E2E o estilos globales.

Ambos propietarios parten de la misma base que contiene el gate verde. No editan archivos del otro y no reinterpretan contratos.

## Stage 4: Integration order

El orquestador:

1. integra domain;
2. ejecuta sus sensores asignados y detiene la integración ante fallo;
3. completa en el ledger las evidencias domain desde su handoff;
4. integra interfaz;
5. ejecuta component/build y detiene la integración ante fallo;
6. completa en el ledger las evidencias interfaz desde su handoff;
7. crea la base e2e solo después de tener ambos merges verdes.

No se corrige de paso un fallo del propietario anterior.

## Stage 5: App and E2E

El propietario e2e trabaja sobre la base integrada y sobre las tasks suplementarias aceptadas por
Analyze B:

1. Crea todo el bloque RED de integración de App con AC-ID literal: disponibilidad, restauración,
   turno, una jugada, ubicación, foco y anuncios X/O/sin anuncio falso.
2. Crea todo el bloque RED E2E con AC-ID literal: toque, `WON_X`, `WON_O`, `DRAW`, repetición hasta
   vacío, reset irreversible, secuencia solo teclado, señal textual, 320/768/1280/1920 px y zoom
   200 %.
3. Separa esas RED por familia observable y ejecuta component/E2E para registrar que fallan por
   ausencia de composición, no por setup.
4. Implementa GREEN pequeñas en este orden de responsabilidad: shell/orden/disponibilidad;
   conexión Undo al dominio; anuncio/foco; estilos responsive/no cromáticos.
5. Conserva una sola región viva, consume una vez el evento Undo aceptado y mantiene el foco.
6. Ejecuta component, E2E y build completos en GREEN después de cada bloque aplicable.
7. Entrega commits y handoff; no modifica reducer ni decide reglas.

No existe una GREEN temprana de visibilidad con callback temporal. Ningún cableado de Undo en App ni
estilo asociado precede a los dos grupos RED.

## Acceptance scenarios

### Single and repeated Undo

1. Partir de tablero vacío con Undo no disponible.
2. Jugar X y O legalmente.
3. Deshacer una vez: desaparece solo O y vuelve `PLAYING_O`.
4. Deshacer otra vez: desaparece X, vuelve `PLAYING_X` y Undo queda no disponible.
5. Intentar Undo vacío: tablero, estado, disponibilidad y anuncio no cambian.

### Terminal recovery

Cubrir en E2E por secuencias legales separadas:

- `WON_X` → Undo → `PLAYING_X` previo;
- `WON_O` → Undo → `PLAYING_O` previo;
- `DRAW` → Undo → estado de juego previo.

En cada caso se comparan por separado tablero y status.

### Rejected attempts

- Intento sobre celda ocupada no cambia el número de Undo disponibles.
- Intento de celda en estado terminal no cambia el número de Undo disponibles.
- El siguiente Undo elimina la última jugada legal, no el intento rechazado.

### Reset boundary

1. Crear varias entradas de historial.
2. Reiniciar partida.
3. Confirmar tablero vacío, `PLAYING_X` y Undo no disponible.
4. Intentar Undo y confirmar que la partida previa no reaparece.

Este escenario es E2E obligatorio y mantiene tablero, estado y disponibilidad en tests con AC-ID
separados.

### Accessibility and input

- Orden: nueve celdas, Undo, Reiniciar.
- Clic, toque, Enter y Espacio activan una vez con historial.
- Foco permanece en Undo después de aceptación, incluso cuando queda no disponible.
- Nombre exacto `Deshacer jugada`.
- Anuncios exactos X/O en el único status.
- Sin anuncio al intentar Undo vacío.
- Indicación textual `No disponible` y contorno de foco continuo.
- Secuencia E2E completa de jugar, deshacer repetidamente y reiniciar usando únicamente teclado.

### Responsive

- Viewports de 320, 768, 1280 y 1920 px sin overflow horizontal.
- Vista al 200 % sin superposición de tablero, Undo y Reiniciar.
- Todos los controles conservan operabilidad y texto visible.

## Traceability consolidation

El ledger ya existe. Después de integrar e2e:

1. El orquestador registra los SHAs RED/GREEN exactos restantes en `traceability.md`.
2. Cada fila conecta AC/GATE, tasks, commits y archivos de test.
3. Confirma cero `PENDING` y cambia la fase a `RELEASE_CANDIDATE`.
4. Ejecuta los comandos finales; el gate exige evidencia completa para features candidatas y
   verificadas.
5. Solo después de PASS cambia a `VERIFIED` y repite `npm run verify:traceability`.
6. `speckit-converge` agrega cualquier trabajo no construido sin reciclar Task IDs.
7. El reviewer audita en solo lectura el diff, contratos, ledger y sensores.
8. El gate descubre feature 001 y 002 como conjunto, y cruza commits contra la unión.

## Final verification

Ejecutar en este orden y detenerse ante la primera causa real de fallo:

```bash
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability
```

La feature no está lista si cualquiera falla, si existe un ID global duplicado o si alguno de los 42 AC de feature 001 deja de estar verde.
