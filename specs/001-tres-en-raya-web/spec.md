# Feature Specification: Tres en Raya web local

**Feature Branch**: No creada; no existe un hook `before_specify` configurado

**Created**: 2026-07-14

**Status**: Draft

**Input**: Aplicación web gráfica de tres en raya para dos jugadores locales que comparten un dispositivo.

## Definitions

- **Activar una celda**: hacer clic sobre ella, tocarla o pulsar Enter o Espacio cuando tiene el foco.
- **Jugada legal**: activar una celda vacía mientras el estado es `PLAYING_X` o `PLAYING_O`.
- **Estado de juego**: `PLAYING_X` o `PLAYING_O`.
- **Estados canónicos**: `PLAYING_X`, `PLAYING_O`, `WON_X`, `WON_O` y `DRAW`.
- **Líneas ganadoras**: las tres filas, las tres columnas y las dos diagonales del tablero.
- **Estado terminal**: cualquiera de `WON_X`, `WON_O` o `DRAW`.
- **Primera celda**: celda situada en la fila 1 y la columna 1.
- **Contenido de celda**: uno de los valores “vacía”, “X” u “O”.

## User Scenarios & Testing *(mandatory)*

### US-001 - Jugar una partida válida (Priority: P1)

Dos jugadores locales comparten un dispositivo, colocan marcas por turnos y reciben una indicación
inequívoca de a quién corresponde jugar.

**Why this priority**: Proporciona el ciclo mínimo de juego sobre el que se apoyan los resultados,
el reinicio y la experiencia accesible.

**Independent Test**: Iniciar una partida, activar celdas vacías en turnos sucesivos y comprobar el
tablero, el estado y el rechazo de una celda ocupada sin necesitar alcanzar un resultado terminal.

**Acceptance Criteria (EARS)**:

- **AC-US1-ESTADO-001** — **EARS: Event-driven**: Cuando comienza una partida, la aplicación Tres en Raya DEBE presentar el estado `PLAYING_X`.
- **AC-US1-DOMINIO-002** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE presentar un tablero compuesto por exactamente tres filas y tres columnas.
- **AC-US1-INTERACCION-003** — **EARS: Event-driven**: Cuando el jugador del turno activa una celda vacía, la aplicación Tres en Raya DEBE mostrar su marca en esa celda.
- **AC-US1-ESTADO-004** — **EARS: Event-driven**: Cuando X completa una jugada legal que no produce un estado terminal, la aplicación Tres en Raya DEBE presentar el estado `PLAYING_O`.
- **AC-US1-ESTADO-005** — **EARS: Event-driven**: Cuando O completa una jugada legal que no produce un estado terminal, la aplicación Tres en Raya DEBE presentar el estado `PLAYING_X`.
- **AC-US1-UNWANTED-006** — **EARS: Unwanted behavior**: Si una persona activa una celda ocupada, entonces la aplicación Tres en Raya DEBE conservar las nueve celdas sin cambios.
- **AC-US1-UNWANTED-007** — **EARS: Unwanted behavior**: Si una persona activa una celda ocupada, entonces la aplicación Tres en Raya DEBE conservar el estado canónico vigente.
- **AC-US1-ESTADO-008** — **EARS: State-driven**: Mientras el estado sea `PLAYING_X`, la aplicación Tres en Raya DEBE identificar a X como jugador del turno.
- **AC-US1-ESTADO-009** — **EARS: State-driven**: Mientras el estado sea `PLAYING_O`, la aplicación Tres en Raya DEBE identificar a O como jugador del turno.
- **AC-US1-ESTADO-010** — **EARS: Event-driven**: Cuando comienza una partida, la aplicación Tres en Raya DEBE presentar nueve celdas vacías.

---

### US-002 - Resolver victoria o empate (Priority: P2)

Los jugadores reciben un resultado correcto cuando alguien completa una línea ganadora o cuando el
tablero se llena sin ganador, y no pueden alterar una partida terminada.

**Why this priority**: Completa las reglas del juego y garantiza que cada partida tenga un desenlace
determinista.

**Independent Test**: Preparar secuencias para cada una de las ocho líneas ganadoras y una secuencia
de empate; verificar el estado, el resultado mostrado y el bloqueo posterior.

**Acceptance Criteria (EARS)**:

- **AC-US2-DOMINIO-001** — **EARS: Event-driven**: Cuando una jugada legal hace que X ocupe cualquiera de las ocho líneas ganadoras, la aplicación Tres en Raya DEBE presentar el estado `WON_X`.
- **AC-US2-DOMINIO-002** — **EARS: Event-driven**: Cuando una jugada legal hace que O ocupe cualquiera de las ocho líneas ganadoras, la aplicación Tres en Raya DEBE presentar el estado `WON_O`.
- **AC-US2-ESTADO-003** — **EARS: State-driven**: Mientras el estado sea `WON_X`, la aplicación Tres en Raya DEBE identificar a X como ganador.
- **AC-US2-ESTADO-004** — **EARS: State-driven**: Mientras el estado sea `WON_O`, la aplicación Tres en Raya DEBE identificar a O como ganador.
- **AC-US2-DOMINIO-005** — **EARS: Event-driven**: Cuando una jugada legal ocupa la novena celda sin completar una línea ganadora, la aplicación Tres en Raya DEBE presentar el estado `DRAW`.
- **AC-US2-ESTADO-006** — **EARS: State-driven**: Mientras el estado sea `DRAW`, la aplicación Tres en Raya DEBE identificar el resultado como empate.
- **AC-US2-UNWANTED-007** — **EARS: Unwanted behavior**: Si una persona activa una celda durante un estado terminal, entonces la aplicación Tres en Raya DEBE conservar las nueve celdas sin cambios.
- **AC-US2-UNWANTED-008** — **EARS: Unwanted behavior**: Si una persona activa una celda durante un estado terminal, entonces la aplicación Tres en Raya DEBE conservar el estado terminal vigente.

---

### US-003 - Reiniciar la partida (Priority: P3)

Las personas pueden descartar la partida actual e iniciar inmediatamente una partida nueva sin
recargar la aplicación.

**Why this priority**: Permite repetir el ciclo de juego en el mismo dispositivo y recuperarse de
cualquier estado de la partida.

**Independent Test**: Desde cada estado canónico, activar la acción de reinicio y comprobar por
separado el tablero vacío, el turno inicial y la ubicación del foco.

**Acceptance Criteria (EARS)**:

- **AC-US3-INTERACCION-001** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE presentar una acción denominada “Reiniciar partida” en cada estado canónico.
- **AC-US3-ESTADO-002** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE presentar nueve celdas vacías.
- **AC-US3-ESTADO-003** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE presentar el estado `PLAYING_X`.
- **AC-US3-FOCO-004** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE colocar el foco en la primera celda del tablero.

---

### US-004 - Utilizar una interfaz accesible y responsive (Priority: P4)

Las personas pueden comprender y operar el juego mediante puntero, tacto, teclado o tecnología
asistiva, y pueden hacerlo en pantallas estrechas o ampliadas.

**Why this priority**: Garantiza que el ciclo completo sea perceptible y operable sin depender de un
único dispositivo de entrada, tamaño de pantalla o percepción del color.

**Independent Test**: Preparar por separado cada estado canónico sin depender de las transiciones de
otras user stories y verificar estructura accesible, anuncios, foco, clic, tacto y teclado; después,
verificar la presentación en anchos de 320 a 1920 píxeles y con ampliación del 200 %.

**Acceptance Criteria (EARS)**:

- **AC-US4-INTERACCION-001** — **EARS: Event-driven**: Cuando una persona hace clic sobre una celda vacía mientras existe un estado de juego, la aplicación Tres en Raya DEBE mostrar la marca del jugador del turno en esa celda.
- **AC-US4-INTERACCION-002** — **EARS: Event-driven**: Cuando una persona toca una celda vacía mientras existe un estado de juego, la aplicación Tres en Raya DEBE mostrar la marca del jugador del turno en esa celda.
- **AC-US4-TECLADO-003** — **EARS: Event-driven**: Cuando una persona pulsa Enter mientras una celda vacía tiene el foco y existe un estado de juego, la aplicación Tres en Raya DEBE mostrar la marca del jugador del turno en esa celda.
- **AC-US4-TECLADO-004** — **EARS: Event-driven**: Cuando una persona pulsa Espacio mientras una celda vacía tiene el foco y existe un estado de juego, la aplicación Tres en Raya DEBE mostrar la marca del jugador del turno en esa celda.
- **AC-US4-TECLADO-005** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE ordenar el foco secuencialmente por las celdas de la fila 1 a la fila 3, de izquierda a derecha, y después por “Reiniciar partida”.
- **AC-US4-FOCO-006** — **EARS: State-driven**: Mientras un control interactivo tenga el foco, la aplicación Tres en Raya DEBE mostrar un contorno continuo alrededor de ese control.
- **AC-US4-FOCO-007** — **EARS: Event-driven**: Cuando una activación sobre una celda ocupada es rechazada, la aplicación Tres en Raya DEBE conservar el foco en esa celda.
- **AC-US4-A11Y-008** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE exponer el tablero a tecnología asistiva como una cuadrícula de tres filas y tres columnas.
- **AC-US4-A11Y-009** — **EARS: State-driven**: Mientras una celda sea perceptible por tecnología asistiva, la aplicación Tres en Raya DEBE exponer un nombre que contenga su fila, su columna y su contenido.
- **AC-US4-A11Y-010** — **EARS: Event-driven**: Cuando cambia el turno, la aplicación Tres en Raya DEBE anunciar el jugador del nuevo turno mediante tecnología asistiva.
- **AC-US4-A11Y-011** — **EARS: Event-driven**: Cuando se alcanza `WON_X`, `WON_O` o `DRAW`, la aplicación Tres en Raya DEBE anunciar el resultado mediante tecnología asistiva.
- **AC-US4-RESPONSIVE-012** — **EARS: State-driven**: Mientras el ancho visible esté entre 320 y 1920 píxeles, la aplicación Tres en Raya DEBE presentar el tablero y “Reiniciar partida” sin desplazamiento horizontal.
- **AC-US4-RESPONSIVE-013** — **EARS: State-driven**: Mientras la vista esté ampliada al 200 %, la aplicación Tres en Raya DEBE presentar cada control sin superponerlo con otro control.
- **AC-US4-VISUAL-014** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE distinguir X, O, turno y resultado mediante texto o forma además de cualquier color.
- **AC-US4-UNWANTED-015** — **EARS: Unwanted behavior**: Si un puntero no está disponible y una celda vacía tiene el foco durante un estado de juego, entonces la aplicación Tres en Raya DEBE aceptar Enter o Espacio como activación de esa celda.
- **AC-US4-TECLADO-016** — **EARS: Event-driven**: Cuando “Reiniciar partida” tiene el foco y una persona pulsa Enter o Espacio, la aplicación Tres en Raya DEBE presentar nueve celdas vacías.
- **AC-US4-VISUAL-017** — **EARS: State-driven**: Mientras el puntero permanezca sobre una celda vacía durante un estado de juego, la aplicación Tres en Raya DEBE mostrar un contorno alrededor de esa celda.
- **AC-US4-VISUAL-018** — **EARS: State-driven**: Mientras una celda contenga una marca, la aplicación Tres en Raya DEBE mostrar dentro de esa celda el símbolo “X” u “O” correspondiente.
- **AC-US4-A11Y-019** — **EARS: Event-driven**: Cuando comienza o se reinicia una partida, la aplicación Tres en Raya DEBE anunciar a X como jugador del turno mediante tecnología asistiva.
- **AC-US4-A11Y-020** — **EARS: State-driven**: Mientras exista un estado terminal, la aplicación Tres en Raya DEBE exponer cada celda a tecnología asistiva como no disponible para una jugada.

### Edge Cases

- Activar repetidamente una celda ocupada no cambia el tablero ni el turno.
- La jugada que llena la última celda y completa una línea se resuelve como victoria, no como empate.
- Una jugada que completa más de una línea simultáneamente produce un único estado de victoria.
- Las activaciones rápidas posteriores a una jugada terminal no alteran el resultado.
- Reiniciar inmediatamente después de iniciar una partida produce el mismo estado inicial canónico.
- Reiniciar desde cada estado terminal elimina todas las marcas y devuelve el turno a X.
- El foco permanece identificable al pasar entre tablero y reinicio con teclado.
- El contenido esencial sigue disponible sin percepción de color y con ampliación del 200 %.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación Tres en Raya DEBE admitir exactamente dos jugadores locales que comparten un dispositivo.
- **FR-002**: La aplicación Tres en Raya DEBE representar la partida en un tablero de tres filas y tres columnas.
- **FR-003**: La aplicación Tres en Raya DEBE comenzar cada partida con X.
- **FR-004**: La aplicación Tres en Raya DEBE alternar entre X y O después de cada jugada legal no terminal.
- **FR-005**: La aplicación Tres en Raya DEBE aceptar jugadas únicamente sobre celdas vacías durante `PLAYING_X` o `PLAYING_O`.
- **FR-006**: La aplicación Tres en Raya DEBE evaluar las tres filas, las tres columnas y las dos diagonales como líneas ganadoras.
- **FR-007**: La aplicación Tres en Raya DEBE asignar `WON_X` o `WON_O` cuando la marca correspondiente completa una línea ganadora.
- **FR-008**: La aplicación Tres en Raya DEBE asignar `DRAW` cuando las nueve celdas están ocupadas y ninguna línea es ganadora.
- **FR-009**: La aplicación Tres en Raya DEBE impedir nuevas jugadas en `WON_X`, `WON_O` y `DRAW`.
- **FR-010**: La aplicación Tres en Raya DEBE ofrecer una acción para reiniciar desde cualquier estado canónico.
- **FR-011**: La aplicación Tres en Raya DEBE exponer el turno y el resultado como información visible.
- **FR-012**: La aplicación Tres en Raya DEBE permitir operar las celdas mediante clic, tacto, Enter y Espacio.
- **FR-013**: La aplicación Tres en Raya DEBE proporcionar navegación, foco visible y nombres accesibles para todos los controles.
- **FR-014**: La aplicación Tres en Raya DEBE anunciar cambios de turno y resultados a tecnología asistiva.
- **FR-015**: La aplicación Tres en Raya DEBE conservar el juego operable entre 320 y 1920 píxeles de ancho visible y con ampliación del 200 %.
- **FR-016**: La aplicación Tres en Raya DEBE comunicar marcas, turno y resultado mediante una señal que no dependa exclusivamente del color.

### Interface Coverage

- **Visual and interactive states**: El estado visible corresponde siempre a uno de los cinco estados canónicos; los estados terminales identifican victoria o empate y bloquean el tablero.
- **Input**: Clic, tacto, Enter y Espacio activan una celda conforme a la definición común; el reinicio es operable por puntero, tacto y teclado.
- **Focus**: El orden secuencial recorre las nueve celdas por filas de izquierda a derecha y después el reinicio; el control enfocado presenta un contorno continuo y el reinicio devuelve el foco a la primera celda.
- **Assistive technology**: El tablero expone estructura de cuadrícula, cada celda comunica posición y contenido, y los cambios de turno y resultado se anuncian.
- **Responsive behavior**: Tablero, estado y reinicio no generan desplazamiento horizontal entre 320 y 1920 píxeles; ningún control se superpone con otro al 200 % de ampliación.
- **Non-color communication**: Las marcas X y O, el turno y el resultado incluyen texto o forma además de cualquier diferencia cromática.

### Canonical State Model

| Current state | Accepted event | Next state |
|---------------|----------------|------------|
| Partida no iniciada | Comenzar partida | `PLAYING_X` |
| `PLAYING_X` | Jugada legal no terminal de X | `PLAYING_O` |
| `PLAYING_O` | Jugada legal no terminal de O | `PLAYING_X` |
| `PLAYING_X` | X completa una línea | `WON_X` |
| `PLAYING_O` | O completa una línea | `WON_O` |
| `PLAYING_X` o `PLAYING_O` | Novena celda sin línea ganadora | `DRAW` |
| `WON_X`, `WON_O` o `DRAW` | Activar una celda | El mismo estado terminal |
| Cualquier estado canónico | Reiniciar partida | `PLAYING_X` |

La evaluación de una línea ganadora precede a la evaluación de empate en cada jugada legal.

### Key Entities

- **Partida**: Estado canónico vigente y relación con el tablero; comienza y se reinicia en `PLAYING_X`.
- **Tablero**: Cuadrícula de nueve celdas organizada en tres filas y tres columnas.
- **Celda**: Posición identificada por fila y columna cuyo contenido es vacío, X u O.
- **Línea ganadora**: Uno de los ocho conjuntos de tres celdas que determinan una victoria.
- **Jugador local**: Participante identificado exclusivamente como X u O durante una partida.

## Out of Scope

- Cuentas o identidades persistentes.
- Backend, servicios remotos o almacenamiento persistente.
- Juego en red o entre dispositivos.
- Historial de partidas o jugadas.
- Puntuación acumulada.
- Oponente controlado por inteligencia artificial.
- Selección de quién comienza; X comienza siempre.

## Traceability Contract

La trazabilidad normativa sigue la cadena **criterio → tarea → commit → test**:

1. Cada ID `AC-USn-CATEGORIA-nnn` DEBE aparecer en al menos una tarea de test y en al menos una tarea de implementación de `tasks.md`.
2. Cada tarea de user story DEBE declarar los IDs de todos los criterios que satisface.
3. Cada commit de test o implementación DEBE declarar su Task ID y los IDs de criterio asociados mediante el formato constitucional.
4. Cada nombre de test DEBE incluir literalmente el ID del criterio que verifica.
5. `traceability.md` DEBE registrar una fila por criterio con sus tareas, commits y tests correspondientes.
6. La comprobación automática de trazabilidad DEBE fallar si falta cualquier vínculo de la cadena.
7. Cuando criterios de historias distintas describan el mismo comportamiento observable, PUEDEN
   compartir una única tarea GREEN solamente si todos sus RED se ejecutan y se confirman antes de esa
   tarea. La tarea y su commit DEBEN declarar todos los AC-ID relacionados; esta agrupación no permite
   omitir tests, evidencia RED ni vínculos individuales en `traceability.md`.

| Criterion ID | Test task | Implementation task | Test commit | Implementation commit | Test name |
|--------------|-----------|---------------------|-------------|-----------------------|-----------|
| `AC-USn-CATEGORIA-nnn` | `Tnnn` | `Tnnn` | `test(USn): Tnnn ... [AC-ID]` | `feat(USn): Tnnn ... [AC-ID]` | Contiene `AC-USn-CATEGORIA-nnn` |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las secuencias legales evaluadas alterna X y O sin aceptar una marca sobre una celda ocupada.
- **SC-002**: El 100 % de las ocho líneas ganadoras se identifica correctamente para X y para O.
- **SC-003**: El 100 % de las partidas con nueve celdas ocupadas y sin línea ganadora termina en empate.
- **SC-004**: El 100 % de las activaciones de celda realizadas después de victoria o empate conserva tablero y resultado sin cambios.
- **SC-005**: El reinicio desde cada uno de los cinco estados canónicos produce nueve celdas vacías y turno de X.
- **SC-006**: Una persona puede completar una partida y reiniciarla usando únicamente teclado.
- **SC-007**: Turno, contenido de celdas y resultado son identificables mediante tecnología asistiva en todos los estados canónicos.
- **SC-008**: Las nueve celdas y la acción de reinicio permanecen operables sin desplazamiento horizontal desde 320 hasta 1920 píxeles de ancho visible.
- **SC-009**: Toda información esencial comunicada mediante color dispone también de texto o forma perceptible.
- **SC-010**: El 100 % de los criterios de aceptación mantiene completa la cadena criterio, tarea, commit y test antes de considerar terminada la feature.

## Assumptions

- Los dos jugadores están físicamente presentes y acuerdan quién controla X y quién controla O.
- El dispositivo dispone de un navegador gráfico con entrada de puntero, táctil o teclado según sus capacidades.
- No se conserva información al cerrar o recargar la aplicación.
- El idioma visible y anunciado para esta feature es español.
- Las coordenadas de las celdas se expresan mediante filas y columnas numeradas del 1 al 3.
