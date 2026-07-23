# Research: Deshacer la última jugada

## 1. Historial inmutable no recursivo

**Decision**: Separar `GameSnapshot` (`board` + `status`) de `GameState` (`board` + `status` + `history`). `history` es una colección readonly de snapshots y cada jugada legal añade el snapshot inmediatamente anterior.

**Rationale**: Un historial de `GameState` sería recursivo y duplicaría historiales completos. Un snapshot mínimo contiene exactamente la información canónica que la spec exige restaurar. Como el reducer nunca muta tableros publicados, cada snapshot puede conservar la referencia readonly del tablero anterior y cada transición crea una colección nueva.

**Alternatives considered**:

- Guardar solo índice y jugador: rechazado porque obliga a reconstruir estado y turno, y no representa una restauración exacta por contrato.
- Guardar `GameState` completos: rechazado por recursión y crecimiento innecesario.
- Dos stacks de tableros y estados: rechazado porque permite desincronización entre observables.

## 2. Forma única de `GameState`

**Decision**: `history` es requerido. No se usa propiedad opcional, unión legacy ni fallback a `[]`. Los tests que construyen estados migran a helpers que producen el objeto completo.

**Rationale**: Una propiedad ausente no debe significar a veces “sin historial” y otras “fixture anterior a Undo”. El compilador debe detectar todo constructor incompleto. Un helper local en tests reduce repetición sin introducir una API de compatibilidad en producción.

**Alternatives considered**:

- `history?: GameHistory`: rechazado por estado ambiguo.
- Normalizar `undefined` dentro del reducer: rechazado porque oculta fixtures inválidos y amplía permanentemente el dominio.
- Estado externo separado de `GameState`: rechazado porque permitiría que tablero/estado e historial evolucionaran de forma no atómica.

## 3. Migración paralela de fixtures

**Decision**: Los fixtures de componente se preparan como variables devueltas por un helper que incluye `history: []`, sin anotarlos contra el tipo antiguo. Esos valores son estructuralmente aceptados por la base anterior y satisfacen el nuevo `GameState` requerido tras integrar domain.

**Rationale**: Permite que interfaz trabaje desde la misma base verde que domain sin una unión legacy ni un archivo compartido. Los unit tests del dominio se migran dentro del cambio de tipo, bajo el propietario domain.

**Alternatives considered**:

- Añadir `history` directamente a literales frescos JSX: rechazado porque falla el chequeo de exceso de propiedades sobre la base antigua.
- Esperar a integrar domain antes de iniciar interfaz: rechazado porque elimina el fan-out paralelo definido.
- Hacer que e2e modifique tests de componentes: rechazado por ownership.

## 4. Orden total del reducer

**Decision**: Resolver `RESET`, después `UNDO`, después los rechazos de `PLAY_CELL` y finalmente la jugada legal.

**Rationale**: `UNDO` debe estar permitido desde estados terminales; por eso no puede quedar detrás del bloqueo terminal. `RESET` siempre domina y elimina historial. Los rechazos se evalúan antes de crear el snapshot para asegurar que solo una jugada legal genere una entrada.

**Alternatives considered**:

- Bloqueo terminal antes de `UNDO`: rechazado porque impediría deshacer WON_X, WON_O y DRAW.
- Guardar snapshot antes de validar celda: rechazado porque intentos ocupados o terminales crearían puntos falsos.
- Reducer parcial que lanza para historial vacío: rechazado porque la transición requerida es un no-op determinista.

## 5. Selector de disponibilidad

**Decision**: El dominio expone `canUndo(state): boolean`; App usa el selector y no consulta `history.length`.

**Rationale**: Aunque hoy la disponibilidad equivale a historial no vacío, esa equivalencia es una regla de dominio. El selector conserva la autoridad de `src/domain/` y entrega a la interfaz un contrato mínimo.

**Alternatives considered**:

- Calcular `state.history.length > 0` en App: rechazado por duplicar conocimiento de dominio.
- Entregar todo `GameState` al botón: rechazado porque acopla presentación a reglas e historial.

## 6. Control accesible disponible y no disponible

**Decision**: Usar un botón nativo estable con texto exacto `Deshacer jugada`, `aria-disabled` cuando no esté disponible y un guard en el handler. Mostrar una indicación textual separada `No disponible`, que no forma parte del nombre accesible.

**Rationale**: Un botón HTML aporta activación por clic, toque, Enter y Espacio. `aria-disabled` lo conserva en el orden de foco exigido, a diferencia de `disabled`. La indicación textual hace inequívoca la indisponibilidad sin depender solo del color. El guard evita activaciones incluso si se despacha un evento programático.

**Alternatives considered**:

- Atributo `disabled`: rechazado porque retira el control del orden de foco.
- Enlace con `role="button"`: rechazado porque requeriría reimplementar teclado nativo.
- Señal solo por opacidad o color: rechazada por el criterio no cromático.
- Incluir “no disponible” en el texto del botón: rechazado porque cambiaría el nombre visible y accesible exacto.

## 7. Permanencia del foco

**Decision**: Mantener la misma instancia DOM del botón antes y después de Undo, sin `key`, desmontaje ni foco programático. App no mueve el foco al aceptar Undo.

**Rationale**: La activación nativa de un botón conserva foco. También lo conserva cuando `aria-disabled` cambia a verdadero al llegar a historial vacío. El foco programático añadiría complejidad y riesgo de movimiento inesperado.

**Alternatives considered**:

- Reenfocar siempre con `ref.focus()`: rechazado porque es innecesario y puede interferir con tecnologías asistivas.
- Reemplazar el botón disponible por otro no disponible: rechazado porque perdería foco.

## 8. Anuncio exacto, único y compatible

**Decision**: Conservar una única región visible `role="status"`. `GameStatus` mantiene `status`
requerido y añade `announcement?: string`. Si la prop se omite, conserva exactamente el texto
canónico actual; si se entrega, presenta ese texto en el mismo nodo estable. App controla el anuncio
específico de Undo y una jugada o RESET posterior vuelve al texto canónico normal.

**Rationale**: La prop opcional permite que la rama interfaz compile contra el App existente y que
los consumidores `<GameStatus status={status} />` permanezcan válidos. El texto exacto de Undo
depende del `status` restaurado por el dominio, no de una predicción de App. Reutilizar la región
existente evita anuncios duplicados y mantiene la compatibilidad de la feature 001. Un Undo no
disponible no despacha acción ni modifica el texto.

**Alternatives considered**:

- Crear una segunda región viva oculta: rechazada porque podría duplicar anuncios y alteraría el contrato previo de una sola región.
- Hacer obligatoria la prop nueva: rechazado porque impediría compilar interfaz de forma independiente
  antes de que e2e modifique `src/App.tsx`.
- Hacer que `GameStatus` detecte Undo: rechazado porque trasladaría lógica de composición al
  componente presentacional.
- Anunciar desde el dominio: rechazado porque el dominio no conoce tecnología asistiva.
- Inferir el jugador desde la marca retirada: rechazado porque App duplicaría la transición de dominio.

## 9. Gate de trazabilidad multi-feature

**Decision**: Separar descubrimiento, validación por feature y agregación global. La fase final enumera `specs/NNN-*`, valida cada tripleta completa, reporta tripletas parciales, exige unicidad global y cruza un único `git log` con la unión de tasks.

**Rationale**: Validar solo `.specify/feature.json` deja de observar features previas y colisiones globales. Mantener la validación por feature permite reutilizar reglas existentes y producir diagnósticos precisos. Agregar después evita que referencias válidas entre artefactos se confundan con definiciones duplicadas.

**Alternatives considered**:

- Ejecutar el script una vez por feature desde shell: rechazado porque no detecta duplicados globales ni valida commits contra la unión.
- Concatenar todos los artefactos y validar una vez: rechazado porque pierde contexto por feature y genera errores no deterministas.
- Cambiar el script npm: rechazado porque rompe compatibilidad y no es necesario.
- Usar solo la feature activa: rechazado por el gate multi-feature requerido.

## 10. Diagnósticos deterministas

**Decision**: Ordenar slugs de feature y diagnósticos por categoría/ID; prefijar errores con `[feature:<slug>]`; terminar exclusivamente con exit code `0` o `1`.

**Rationale**: Un orden estable hace reproducibles los tests y facilita revisión en CI. Un resultado binario preserva el contrato actual de `npm run verify:traceability`.

**Alternatives considered**:

- Emitir en el orden de recorrido del filesystem: rechazado porque no es portable.
- Usar códigos de salida distintos por error: rechazado porque el requisito pide salida binaria.

## 11. Tests y commits RED/GREEN

**Decision**: Reservar `T062` para RED y `T063` para GREEN de `GATE-MULTIFEATURE-001`; después, Tasks asignará IDs consecutivos a producto. Cada AC nuevo tiene al menos un test planificado con el ID literal, y tablero/estado se asertan por separado.

**Rationale**: El gate compartido debe quedar verde y congelado antes del fan-out. La separación de commits preserva evidencia falsable y el formato constitucional de trazabilidad.

**Alternatives considered**:

- Implementar el gate junto a Undo: rechazado porque mezcla tooling y producto y retrasa la protección global.
- Un test general sin IDs literales: rechazado por constitución.

## 12. Dependencias y estructura

**Decision**: Reutilizar React, Vitest, Testing Library, Playwright y APIs estándar de Node. No añadir paquetes ni mover capas existentes.

**Rationale**: Todas las capacidades requeridas ya están presentes. El historial máximo es pequeño y no necesita una estructura especializada.

**Alternatives considered**:

- Librería de historial/estado: rechazada por dependencia innecesaria y porque desplazaría autoridad fuera del dominio.
- Persistencia local: rechazada por estar fuera de alcance.

## 13. Bootstrap compatible y dos Analyze

**Decision**: Dividir la generación de Tasks y ledger en dos pases. El pase bootstrap contiene un
único par RED/GREEN canónico por AC, reserva `T062/T063` para el gate y usa fase `PLANNED`; debe ser
aceptado por el verificador vigente antes del primer Analyze. Un primer Analyze en GO autoriza
exclusivamente `T062/T063`. Tras integrar el gate se regenera Tasks con evidencia suplementaria, se
valida con el modelo nuevo y se ejecuta un segundo Analyze antes de cualquier escritor de producto.

**Rationale**: El verificador actual no representa varios pares RED/GREEN por AC ni bloques con
múltiples GREEN. Exigir esa forma antes de implementar el propio gate crea una dependencia circular.
Dos pases preservan la regla constitucional Analyze-antes-de-escribir: el primer análisis acota la
autorización al tooling y el segundo revalida el grafo completo que usarán los workers.

**Alternatives considered**:

- Hacer que el primer Tasks emita ya todas las capas: rechazado porque `--phase=tasks` no puede
  validarlas antes de `T063`.
- Implementar el gate antes de Analyze: rechazado porque incumple la condición constitucional de
  entrada de agentes escritores.
- Omitir el segundo Analyze: rechazado porque el primer análisis no ha visto las tareas
  suplementarias ni su nueva partición.

## 14. Ciclo de vida separado de evidencia de release

**Decision**: Cada ledger declara una fase entre `PLANNED`, `IMPLEMENTING`, `RELEASE_CANDIDATE` y
`VERIFIED`. Todas las features con `spec.md`, `tasks.md` y `traceability.md` participan siempre en
parsing, unicidad global y unión de Task IDs. En fase final, la evidencia completa se exige solo a
`RELEASE_CANDIDATE` y `VERIFIED`; las fases previas conservan validación estructural y pueden
contener `PENDING`. Una candidata no puede pasar a `VERIFIED` hasta ejecutar el gate sin `PENDING`,
y el gate se repite después de cambiar la fase. El parser normaliza la capitalización para aceptar
los encabezados históricos `Planned` y `Verified` sin modificar feature 001.
Las transiciones se incluyen como tasks del orquestador: después de Analyze B se commitea
`IMPLEMENTING` y el baseline se ejecuta sobre ese commit exacto; al cierre se commitean
`RELEASE_CANDIDATE` y `VERIFIED` alrededor de sus validaciones finales.

**Rationale**: Un baseline de release debe permanecer verde mientras una feature legítimamente
planificada todavía no tiene commits, sin ocultarla de la detección multi-feature. Separar
descubrimiento/identidad de madurez de evidencia resuelve el bloqueo sin relajar el cierre: una
feature candidata o verificada sigue obligada a demostrar todos los enlaces y SHA.

**Alternatives considered**:

- Excluir features activas o no terminadas del descubrimiento: rechazado porque permitiría IDs
  duplicados y commits desconocidos.
- Aceptar `PENDING` globalmente en fase final: rechazado porque convertiría evidencia incompleta en
  release válida.
- Inferir la fase por presencia de `PENDING`: rechazado porque hace ambiguo el estado y permite
  transiciones accidentales.

## 15. Evidencia suplementaria después del gate

**Decision**: Mantener una evidencia primaria canónica por AC en el pase bootstrap y añadir los
escenarios obligatorios de composición/E2E solo en el pase Tasks ampliado. El esquema nuevo permite
múltiples pares RED/GREEN por AC y bloques RED cohesivos asociados a varias GREEN explícitas.

**Rationale**: Unit o componente siguen siendo evidencia primaria de una regla o frontera, pero no
demuestran que App y el navegador compongan el comportamiento. Posponer únicamente la
representación suplementaria hasta después de `T063` conserva esa cobertura sin exigir al
verificador antiguo un modelo que todavía no conoce.

**Alternatives considered**:

- Reemplazar la evidencia primaria por E2E: rechazado por pérdida de localización y por mezclar
  autoridad de dominio con composición.
- Confiar únicamente en unit para terminales, repetición y reset: rechazado porque deja sin probar la
  composición real exigida por plan y quickstart.
- Registrar tests adicionales sin tasks/commits propios: rechazado porque rompe la cadena
  criterio → tarea → commit → test.

## 16. Bloque RED previo y GREEN granular de composición

**Decision**: En el pase ampliado, e2e separa las RED por familia observable y confirma todas antes de
modificar App o estilos. Las GREEN se particionan en shell/orden/disponibilidad, conexión Undo al
dominio, anuncio/foco y estilos responsive/no cromáticos. Ningún commit GREEN reclama todas las
familias por una sola modificación incidental.

**Rationale**: Una GREEN temprana puede volver verdes tests futuros que todavía no han demostrado
fallo; una GREEN monolítica con decenas de AC pierde auditabilidad. Un bloque RED completo seguido de
GREEN pequeñas mantiene el orden TDD y permite atribuir qué enlace de producción satisface cada
familia.

**Alternatives considered**:

- Integrar un botón con callback temporal no-op: rechazado porque deja producción deliberadamente
  incompleta y hace ambiguo qué GREEN satisface el contrato.
- Alternar RED/GREEN por cada detalle de App: rechazado porque una conexión compartida puede
  satisfacer por accidente tests futuros aún no escritos.
- Un único commit GREEN para App y estilos: rechazado porque agrupa observables no relacionados y
  dificulta auditar sus AC.

## 17. Raíz única de prompts para el swarm

**Decision**: `scripts/swarm.sh` usa `.prompts/` como raíz única y `GATE-SWARM-001`, implementado con
tests Node sin dependencias, valida la ruta, la presencia de prompts, el acceso de cada worktree al
`node_modules` raíz ya validado, las opciones admitidas por Codex CLI 0.145.0 y los comandos
explícitos de frontera domain/interfaz antes del fan-out.

**Rationale**: Los prompts existentes están versionados bajo `.prompts/`. Una ruta distinta permite
que baseline y `prepare` pasen, pero hace fallar `launch-parallel` después de crear worktrees. El
preflight aislado detecta esa divergencia sin lanzar Codex ni crear estado externo. Los worktrees
Git no copian directorios ignorados, por lo que el runner enlaza localmente `node_modules` después
de crear cada worktree; el enlace también es ignorado y no altera commits.

**Alternatives considered**:

- Copiar los prompts a `prompts/`: rechazado porque duplicaría fuentes y permitiría divergencia.
- Detectar ambas rutas con fallback: rechazado porque ocultaría una configuración incoherente.
- Descubrir el fallo durante `launch-parallel`: rechazado porque ocurre después de mutar worktrees.
- Ejecutar `npm ci` dos veces en paralelo: rechazado porque duplica I/O y acceso de red después de
  que la raíz ya pasó el baseline con el lockfile vigente.
- Conservar `--ask-for-approval never`: rechazado porque esa opción no existe en `codex exec`
  0.145.0; la política se expresa con `-c 'approval_policy="never"'`.
