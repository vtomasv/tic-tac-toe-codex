# Feature Specification: Deshacer la última jugada

**Feature Branch**: No creada; no existe un hook `before_specify` configurado

**Created**: 2026-07-22

**Status**: Draft

**Input**: Añadir una acción accesible y responsive para deshacer, de una en una, las jugadas legales de la partida local existente.

## Definitions

- **Jugada legal**: Activación aceptada de una celda vacía durante `PLAYING_X` o `PLAYING_O`.
- **“Deshacer jugada”**: Acción que restaura exactamente el tablero y el estado canónico existentes inmediatamente antes de la última jugada legal aceptada.
- **Historial disponible**: Existe al menos una jugada legal aceptada desde el inicio o el último reinicio que todavía no ha sido deshecha.
- **Punto de deshacer**: Tablero y estado canónico existentes inmediatamente antes de una jugada legal aceptada.
- **Activación aceptada de “Deshacer jugada”**: Activación de la acción mientras existe historial disponible.
- **Estados canónicos**: `PLAYING_X`, `PLAYING_O`, `WON_X`, `WON_O` y `DRAW`.
- **Estado de juego**: `PLAYING_X` o `PLAYING_O`.
- **Estado terminal**: `WON_X`, `WON_O` o `DRAW`.

## Clarifications

### Session 2026-07-22

- Q: ¿Cuántas jugadas revierte una activación aceptada de “Deshacer jugada”? → A: Exactamente una jugada legal individual.
- Q: ¿Desde qué estado terminal se permite “Deshacer jugada”? → A: Desde cualquiera: `WON_X`, `WON_O` o `DRAW`, restaurando el estado de juego anterior.
- Q: ¿Hasta dónde puede repetirse “Deshacer jugada”? → A: Hasta presentar el tablero inicial vacío.
- Q: ¿Qué ocurre sin historial disponible? → A: Tablero y estado no cambian, la acción permanece visible y no disponible, y no se anuncia un cambio falso.
- Q: ¿Cuál es el texto visible y accesible? → A: “Deshacer jugada”.
- Q: ¿Dónde se ubica “Deshacer jugada”? → A: Después del tablero y antes de “Reiniciar partida”.
- Q: ¿Cuál es el orden de foco? → A: Nueve celdas, “Deshacer jugada” y “Reiniciar partida”.
- Q: ¿Dónde queda el foco después de una activación aceptada? → A: En “Deshacer jugada”.
- Q: ¿Qué anuncio sigue a una activación aceptada? → A: “Jugada deshecha. Turno de X” o “Jugada deshecha. Turno de O”, según el estado restaurado.
- Q: ¿Qué efecto tiene “Reiniciar partida” sobre el historial disponible? → A: Lo elimina y la partida anterior no puede recuperarse con “Deshacer jugada”.
- Q: ¿Existe Redo? → A: No; Redo está fuera de alcance.

## User Scenarios & Testing *(mandatory)*

### US-005 - Deshacer la última jugada (Priority: P1)

Dos jugadores locales pueden corregir la última jugada legal sin reiniciar la partida, recuperar el
turno correspondiente y repetir la acción hasta volver al tablero inicial. La misma operación sigue
siendo comprensible y utilizable mediante puntero, tacto, teclado o tecnología asistiva.

**Why this priority**: Permite corregir una decisión accidental conservando el progreso anterior y
mantiene la experiencia accesible de la aplicación existente.

**Independent Test**: Iniciar una partida, producir por separado estados `PLAYING_X`, `PLAYING_O`,
`WON_X`, `WON_O` y `DRAW`, y activar “Deshacer jugada” mediante cada entrada admitida. Comprobar en
cada caso el tablero, estado, turno, puntos restantes del historial disponible, foco y anuncio; repetir
hasta el tablero vacío y verificar también el rechazo sin historial disponible y su eliminación al reiniciar.

**Acceptance Criteria (EARS)**:

- **AC-US5-INTERACCION-001** — **EARS: Ubiquitous**: En todo estado canónico, la aplicación Tres en Raya DEBE presentar una acción visible con el texto exacto “Deshacer jugada”.
- **AC-US5-INTERACCION-002** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE ubicar “Deshacer jugada” después del tablero y antes de “Reiniciar partida”.
- **AC-US5-DISPONIBILIDAD-003** — **EARS: State-driven**: Mientras exista historial disponible, la aplicación Tres en Raya DEBE exponer “Deshacer jugada” como disponible para activación.
- **AC-US5-DISPONIBILIDAD-004** — **EARS: State-driven**: Mientras no exista historial disponible, la aplicación Tres en Raya DEBE exponer “Deshacer jugada” mediante semántica de acción no disponible.
- **AC-US5-DOMINIO-005** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” ocurre, la aplicación Tres en Raya DEBE restaurar las nueve celdas exactamente al contenido existente inmediatamente antes de la última jugada legal aceptada.
- **AC-US5-ESTADO-006** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” ocurre, la aplicación Tres en Raya DEBE restaurar exactamente el estado canónico existente inmediatamente antes de la última jugada legal aceptada.
- **AC-US5-ESTADO-007** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” ocurre, la aplicación Tres en Raya DEBE identificar como jugador del turno a quien realizó la jugada retirada.
- **AC-US5-DOMINIO-008** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” ocurre, la aplicación Tres en Raya DEBE retirar solamente la marca de la última jugada legal aceptada.
- **AC-US5-TERMINAL-009** — **EARS: Event-driven**: Cuando “Deshacer jugada” se activa con historial disponible desde un estado terminal, la aplicación Tres en Raya DEBE presentar el estado de juego existente antes de la jugada legal que produjo el estado terminal.
- **AC-US5-HISTORIAL-010** — **EARS: Event-driven**: Cuando “Deshacer jugada” se activa nuevamente y todavía existe historial disponible, la aplicación Tres en Raya DEBE deshacer la siguiente jugada legal más reciente.
- **AC-US5-HISTORIAL-011** — **EARS: Event-driven**: Cuando “Deshacer jugada” retira la última jugada legal disponible, la aplicación Tres en Raya DEBE presentar nueve celdas vacías.
- **AC-US5-UNWANTED-012** — **EARS: Unwanted behavior**: Si una persona intenta activar “Deshacer jugada” sin historial disponible, entonces la aplicación Tres en Raya DEBE conservar las nueve celdas sin cambios.
- **AC-US5-UNWANTED-013** — **EARS: Unwanted behavior**: Si una persona intenta activar “Deshacer jugada” sin historial disponible, entonces la aplicación Tres en Raya DEBE conservar el estado canónico vigente.
- **AC-US5-UNWANTED-014** — **EARS: Unwanted behavior**: Si una persona intenta activar “Deshacer jugada” sin historial disponible, entonces la aplicación Tres en Raya DEBE mantener “Deshacer jugada” como no disponible.
- **AC-US5-HISTORIAL-015** — **EARS: Event-driven**: Cuando una jugada legal es aceptada, la aplicación Tres en Raya DEBE añadir exactamente un punto de deshacer.
- **AC-US5-HISTORIAL-016** — **EARS: Unwanted behavior**: Si una activación sobre una celda ocupada es rechazada, entonces la aplicación Tres en Raya DEBE conservar sin cambios la cantidad de jugadas disponibles para deshacer.
- **AC-US5-HISTORIAL-017** — **EARS: Unwanted behavior**: Si una activación de celda durante un estado terminal es rechazada, entonces la aplicación Tres en Raya DEBE conservar sin cambios la cantidad de jugadas disponibles para deshacer.
- **AC-US5-RESET-018** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE presentar nueve celdas vacías.
- **AC-US5-RESET-019** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE presentar el estado `PLAYING_X`.
- **AC-US5-RESET-020** — **EARS: Event-driven**: Cuando una persona activa “Reiniciar partida”, la aplicación Tres en Raya DEBE exponer “Deshacer jugada” como no disponible.
- **AC-US5-PUNTERO-021** — **EARS: Event-driven**: Cuando una persona hace clic en “Deshacer jugada” con historial disponible, la aplicación Tres en Raya DEBE retirar la marca de la última jugada legal aceptada.
- **AC-US5-PUNTERO-022** — **EARS: Event-driven**: Cuando una persona toca “Deshacer jugada” con historial disponible, la aplicación Tres en Raya DEBE retirar la marca de la última jugada legal aceptada.
- **AC-US5-TECLADO-023** — **EARS: Event-driven**: Cuando una persona pulsa Enter mientras “Deshacer jugada” tiene el foco y existe historial disponible, la aplicación Tres en Raya DEBE retirar la marca de la última jugada legal aceptada.
- **AC-US5-TECLADO-024** — **EARS: Event-driven**: Cuando una persona pulsa Espacio mientras “Deshacer jugada” tiene el foco y existe historial disponible, la aplicación Tres en Raya DEBE retirar la marca de la última jugada legal aceptada.
- **AC-US5-FOCO-025** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” ocurre, la aplicación Tres en Raya DEBE conservar el foco en “Deshacer jugada”.
- **AC-US5-FOCO-026** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE ordenar el foco secuencialmente por las nueve celdas en orden de filas, luego por “Deshacer jugada” y después por “Reiniciar partida”.
- **AC-US5-FOCO-027** — **EARS: State-driven**: Mientras “Deshacer jugada” tenga el foco, la aplicación Tres en Raya DEBE mostrar un contorno continuo alrededor de esa acción.
- **AC-US5-A11Y-028** — **EARS: Ubiquitous**: En todo momento, la aplicación Tres en Raya DEBE exponer a tecnología asistiva el nombre accesible exacto “Deshacer jugada”.
- **AC-US5-A11Y-029** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” restaura `PLAYING_X`, la aplicación Tres en Raya DEBE anunciar exactamente “Jugada deshecha. Turno de X”.
- **AC-US5-A11Y-030** — **EARS: Event-driven**: Cuando una activación aceptada de “Deshacer jugada” restaura `PLAYING_O`, la aplicación Tres en Raya DEBE anunciar exactamente “Jugada deshecha. Turno de O”.
- **AC-US5-A11Y-031** — **EARS: Unwanted behavior**: Si una persona intenta activar “Deshacer jugada” sin historial disponible, entonces la aplicación Tres en Raya NO DEBE anunciar un cambio de estado.
- **AC-US5-RESPONSIVE-032** — **EARS: State-driven**: Mientras el ancho visible esté entre 320 y 1920 píxeles, la aplicación Tres en Raya DEBE presentar el tablero, “Deshacer jugada” y “Reiniciar partida” sin desplazamiento horizontal.
- **AC-US5-RESPONSIVE-033** — **EARS: State-driven**: Mientras la vista esté ampliada al 200 %, la aplicación Tres en Raya DEBE presentar “Deshacer jugada” sin superponerlo con otro control.
- **AC-US5-VISUAL-034** — **EARS: State-driven**: Mientras “Deshacer jugada” no esté disponible, la aplicación Tres en Raya DEBE comunicar esa indisponibilidad mediante una señal perceptible que no dependa solo del color.

### Edge Cases

- La primera jugada de X se deshace y produce el tablero vacío con turno de X.
- Deshacer una jugada de O devuelve el turno a O; deshacer una jugada de X devuelve el turno a X.
- Deshacer desde `WON_X`, `WON_O` o `DRAW` elimina únicamente la jugada que produjo el resultado y vuelve a un estado de juego.
- Una jugada legal que produce un estado terminal seguida de intentos rechazados sobre celdas no genera puntos de deshacer adicionales.
- Los intentos repetidos sobre una celda ocupada no modifican la cantidad de jugadas disponibles para deshacer.
- Las activaciones repetidas de “Deshacer jugada” consumen un punto del historial disponible por vez hasta llegar al tablero vacío.
- Reiniciar después de una o varias jugadas legales elimina el historial disponible y no permite recuperar el tablero anterior.
- Después de “Deshacer jugada” y realizar una nueva jugada legal, la nueva jugada crea un punto de deshacer sobre el estado restaurado; no aparece Redo.
- La acción permanece visible cuando está no disponible, conserva su nombre y comunica la indisponibilidad sin depender exclusivamente del color.
- Un anuncio de deshacer no cambia el foco ni se sustituye por un anuncio de resultado terminal anterior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación Tres en Raya DEBE ofrecer “Deshacer jugada” en los cinco estados canónicos.
- **FR-002**: La aplicación Tres en Raya DEBE crear un único punto de deshacer por cada jugada legal aceptada.
- **FR-003**: La aplicación Tres en Raya NO DEBE crear puntos de deshacer por activaciones rechazadas de celdas ocupadas o por activaciones de celda en un estado terminal.
- **FR-004**: La aplicación Tres en Raya DEBE restaurar el tablero y estado canónico del punto de deshacer más reciente mediante cada activación aceptada de “Deshacer jugada”.
- **FR-005**: La aplicación Tres en Raya DEBE permitir deshacer repetidamente mientras queden puntos de deshacer.
- **FR-006**: La aplicación Tres en Raya DEBE conservar tablero, estado e historial disponible cuando no exista un punto de deshacer.
- **FR-007**: La aplicación Tres en Raya DEBE eliminar todos los puntos de deshacer al activar “Reiniciar partida”.
- **FR-008**: La aplicación Tres en Raya NO DEBE permitir recuperar mediante “Deshacer jugada” una partida anterior al último reinicio.
- **FR-009**: La aplicación Tres en Raya NO DEBE ofrecer una acción Redo.
- **FR-010**: La aplicación Tres en Raya DEBE admitir clic, tacto, Enter y Espacio para activar “Deshacer jugada” cuando esté disponible.
- **FR-011**: La aplicación Tres en Raya DEBE impedir la activación de “Deshacer jugada” cuando no exista historial disponible.
- **FR-012**: La aplicación Tres en Raya DEBE conservar el foco en “Deshacer jugada” después de cada activación aceptada.
- **FR-013**: La aplicación Tres en Raya DEBE situar “Deshacer jugada” entre el tablero y “Reiniciar partida” tanto en presentación como en orden de foco.
- **FR-014**: La aplicación Tres en Raya DEBE exponer nombre, disponibilidad y foco de “Deshacer jugada” a tecnologías asistivas.
- **FR-015**: La aplicación Tres en Raya DEBE anunciar la frase exacta correspondiente al turno restaurado después de cada activación aceptada de “Deshacer jugada”.
- **FR-016**: La aplicación Tres en Raya NO DEBE anunciar un cambio de estado por una activación no aceptada de “Deshacer jugada”.
- **FR-017**: La aplicación Tres en Raya DEBE mantener el nuevo control operable entre 320 y 1920 píxeles de ancho visible y con ampliación del 200 %.
- **FR-018**: La aplicación Tres en Raya DEBE comunicar la indisponibilidad mediante semántica y mediante una señal que no dependa exclusivamente del color.
- **FR-019**: La aplicación Tres en Raya DEBE conservar sin redefiniciones los cinco estados canónicos y las reglas existentes de victoria y empate.
- **FR-020**: La aplicación Tres en Raya DEBE mantener sin cambios el comportamiento aceptado por los 42 criterios de la feature 001.

### Interface Coverage

- **Visual and interactive states**: “Deshacer jugada” permanece visible en todos los estados canónicos, se presenta disponible únicamente con historial disponible y ocupa la posición entre el tablero y “Reiniciar partida”.
- **Input**: Clic, tacto, Enter y Espacio producen una activación aceptada solo cuando existe historial disponible.
- **Focus**: El orden secuencial recorre las nueve celdas por filas, “Deshacer jugada” y “Reiniciar partida”; una activación aceptada conserva el foco en “Deshacer jugada” y el foco visible mantiene un contorno continuo.
- **Assistive technology**: La acción expone el nombre exacto “Deshacer jugada”, comunica su disponibilidad y anuncia únicamente una de las dos frases exactas del turno restaurado.
- **Responsive behavior**: El tablero, “Deshacer jugada” y “Reiniciar partida” permanecen operables sin desplazamiento horizontal entre 320 y 1920 píxeles y sin superposición al 200 % de ampliación.
- **Non-color communication**: La indisponibilidad de “Deshacer jugada” se comunica mediante semántica y otra señal perceptible además de cualquier cambio cromático.

### Modelo de estados de “Deshacer jugada”

| Current condition | Accepted event | Observable result |
|-------------------|----------------|-------------------|
| `PLAYING_X` o `PLAYING_O` con historial disponible | Activar “Deshacer jugada” | Tablero y estado del punto de deshacer más reciente |
| Estado terminal con historial disponible | Activar “Deshacer jugada” | Tablero y estado de juego anteriores a la jugada legal que produjo el estado terminal |
| Cualquier estado sin historial disponible | Intentar activar “Deshacer jugada” | Tablero y estado sin cambios; “Deshacer jugada” continúa no disponible |
| Cualquier estado canónico | Activar “Reiniciar partida” | Tablero vacío, `PLAYING_X` y sin historial disponible |

Cada activación aceptada consume exactamente un punto de deshacer. Los puntos anteriores permanecen
disponibles en orden de jugada más reciente a más antigua hasta alcanzar el estado inicial. No existe
una transición Redo.

### Key Entities

- **Partida**: Tablero vigente, estado canónico vigente y relación ordenada con los puntos de deshacer disponibles.
- **Punto de deshacer**: Tablero y estado canónico inmediatamente anteriores a una jugada legal aceptada.
- **Historial disponible**: Secuencia de puntos de deshacer todavía disponibles desde el inicio o último reinicio, ordenados de la jugada legal más reciente a la más antigua.
- **Acción “Deshacer jugada”**: Acción visible cuya disponibilidad depende de que exista historial disponible.

## Out of Scope

- Redo o cualquier recuperación de una jugada deshecha.
- Elegir cuántas jugadas deshacer en una sola acción.
- Mostrar una lista, registro o timeline del historial disponible.
- Persistir el historial disponible al recargar o cerrar la aplicación.
- Backend, red, cuentas, puntuación, inteligencia artificial o juego remoto.
- Atajos de teclado globales adicionales.
- Redefinir los estados canónicos o las reglas existentes de victoria y empate.

## Compatibility

- Los 42 criterios de aceptación de la feature 001 permanecen sin cambios y deben continuar en verde.
- “Deshacer jugada” amplía las transiciones disponibles sin cambiar la definición de `PLAYING_X`, `PLAYING_O`, `WON_X`, `WON_O` o `DRAW`.
- Las ocho líneas ganadoras, la precedencia de victoria sobre empate y el rechazo de jugadas en un estado terminal permanecen vigentes.
- “Reiniciar partida” conserva su tablero vacío y estado `PLAYING_X`, y añade únicamente la eliminación del historial disponible.

## Traceability Contract

La trazabilidad normativa de esta feature sigue la cadena **criterio → tarea → commit → test**:

1. Cada `AC-US5-CATEGORIA-nnn` DEBE ser globalmente único en todo el repositorio y DEBE aparecer en al menos una tarea de test y una tarea de implementación futuras.
2. Los Task IDs futuros DEBEN continuar después del máximo global existente `T061`; el primer Task ID elegible es `T062` y ningún Task ID PUEDE repetirse en otra feature.
3. Cada tarea futura DEBE declarar explícitamente todos los AC-ID que satisface y DEBE separar evidencia RED de implementación GREEN.
4. Cada commit de producto futuro DEBE incluir su Task ID y los AC-ID asociados mediante el formato constitucional `<tipo>(US5): Tnnn descripción [AC-ID ...]`.
5. Cada nombre de test futuro DEBE contener literalmente el AC-ID que verifica y DEBE demostrar una respuesta observable con aserciones significativas.
6. El futuro ledger de trazabilidad de esta feature DEBE registrar una fila por criterio con tareas RED/GREEN, commits y tests reales, sin valores inferidos.
7. La comprobación automática de trazabilidad DEBE cubrir conjuntamente las features 001 y 002 y DEBE fallar ante un ID duplicado o un vínculo ausente.
8. Los 42 criterios de la feature 001 DEBEN permanecer sin cambios, trazados y en verde durante la implementación y cierre de esta feature.

| Criterion ID | RED task | GREEN task | RED/GREEN commits | Test name |
|--------------|----------|------------|-------------------|-----------|
| `AC-US5-CATEGORIA-nnn` | `T062` o posterior | `T062` o posterior | Contienen Task ID y AC-ID | Contiene literalmente el AC-ID |

Este contrato gobierna los artefactos derivados posteriores; esta invocación no crea plan, tareas,
tests, commits ni ledger de trazabilidad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las secuencias de jugadas legales cubiertas restaura exactamente el tablero y estado canónico existentes antes de la última jugada legal aceptada.
- **SC-002**: El 100 % de las activaciones aceptadas de “Deshacer jugada” retira exactamente una jugada legal y devuelve el turno al jugador que la realizó.
- **SC-003**: El 100 % de los intentos sin historial disponible conserva las nueve celdas y el estado sin cambios y mantiene “Deshacer jugada” no disponible.
- **SC-004**: Las secuencias cubiertas recuperan un estado de juego desde cada estado terminal: `WON_X`, `WON_O` y `DRAW`.
- **SC-005**: El 100 % de las secuencias con varias jugadas legales permite activar “Deshacer jugada” una vez por cada jugada hasta presentar nueve celdas vacías y turno de X.
- **SC-006**: El reinicio desde cada estado canónico produce tablero vacío, `PLAYING_X` y ausencia de historial disponible sin permitir recuperar la partida anterior.
- **SC-007**: Una persona puede completar una secuencia de jugar, deshacer repetidamente y reiniciar usando únicamente teclado.
- **SC-008**: El 100 % de las activaciones aceptadas de “Deshacer jugada” anuncia exactamente la frase correspondiente a X u O, y el 100 % de los intentos no aceptados produce cero anuncios falsos de cambio de estado.
- **SC-009**: “Deshacer jugada” permanece operable sin desplazamiento horizontal en anchos visibles de 320, 768, 1280 y 1920 píxeles y sin superposición al 200 % de ampliación.
- **SC-010**: Los 42 criterios de la feature 001 permanecen sin cambios y en verde al validar la feature 002.
- **SC-011**: El 100 % de los 34 criterios de esta feature mantiene completa la cadena criterio, tarea, commit y test antes de considerarse terminado.
- **SC-012**: En una evaluación con al menos cinco participantes, el 100 % identifica cuándo “Deshacer jugada” no está disponible sin depender del color y completa al primer intento una secuencia de jugada legal y “Deshacer jugada” con puntero o teclado.

## Assumptions

- Los dos jugadores comparten un dispositivo y el idioma visible y anunciado es español.
- No existe historial disponible al iniciar o reiniciar una partida, y ningún punto de deshacer se conserva al recargar o cerrar.
- Después de deshacer, una nueva jugada legal crea un punto de deshacer sobre el estado restaurado; ningún estado descartado queda disponible mediante Redo.
- La indisponibilidad impide una activación aceptada aunque una persona intente accionar el control.
- Los anuncios de “Deshacer jugada” comunican el turno restaurado y no desplazan el foco.
- La feature existente proporciona los cinco estados canónicos, las reglas de victoria y empate, y el comportamiento de reinicio que esta feature debe preservar.
