# Release Gate de Calidad de Requisitos: Deshacer la última jugada

**Purpose**: Evaluar formalmente la claridad, completitud, consistencia, medibilidad y trazabilidad de los requisitos de Undo antes de aprobar su planificación o un PR.
**Created**: 2026-07-22
**Feature**: [spec.md](../spec.md)
**Audience**: Autor de la feature y reviewer de PR
**Depth**: Release gate formal

**Note**: Este checklist evalúa exclusivamente la calidad de los requisitos escritos; no evalúa implementación ni resultados de pruebas.

## Claridad de estado e historial

- [ ] CHK001 ¿Es inequívoca la definición de “Deshacer jugada” como restauración de exactamente una jugada legal individual, sin admitir la interpretación de una ronda X+O? [Clarity, Spec §Definitions; §Clarifications]
- [ ] CHK002 ¿Está especificado con precisión cuál es el instante de referencia para restaurar las nueve celdas: el contenido inmediatamente anterior a la última jugada legal aceptada? [Clarity, Spec §Definitions; AC-US5-DOMINIO-005]
- [ ] CHK003 ¿Están separados como observables independientes la restauración exacta del tablero y la restauración exacta del estado canónico? [Completeness, Spec §AC-US5-DOMINIO-005; AC-US5-ESTADO-006]
- [ ] CHK004 ¿Es inequívoca la relación entre la jugada legal retirada, el estado restaurado y el jugador que recupera el turno? [Clarity, Spec §AC-US5-ESTADO-006; AC-US5-ESTADO-007]
- [ ] CHK005 ¿Está definido que cada jugada legal aceptada añade exactamente un único punto al historial disponible? [Completeness, Spec §Definitions; AC-US5-HISTORIAL-015; FR-002]
- [ ] CHK006 ¿Está especificado que un intento rechazado sobre una celda ocupada no modifica la cantidad de jugadas disponibles para deshacer? [Coverage, Spec §AC-US5-HISTORIAL-016; FR-003]
- [ ] CHK007 ¿Está especificado que un intento rechazado durante un estado terminal no modifica la cantidad de jugadas disponibles para deshacer? [Coverage, Spec §AC-US5-HISTORIAL-017; FR-003]
- [ ] CHK008 ¿Es inequívoco el orden de consumo del historial disponible, desde la jugada legal más reciente hasta la más antigua, una por activación aceptada? [Clarity, Spec §AC-US5-HISTORIAL-010; §Key Entities]
- [ ] CHK009 ¿Son consistentes las definiciones de historial disponible, punto de deshacer y activación aceptada en Definitions, Key Entities y Functional Requirements? [Consistency, Spec §Definitions; §Key Entities; FR-002–FR-006]

## Cobertura de escenarios y casos límite

- [ ] CHK010 ¿Están nombrados explícitamente `WON_X`, `WON_O` y `DRAW` como los tres estados terminales desde los que se permite “Deshacer jugada”? [Completeness, Spec §Definitions; §Clarifications; SC-004]
- [ ] CHK011 ¿Está especificado que deshacer desde un estado terminal elimina solo la jugada legal que produjo ese estado y restaura el estado de juego anterior? [Clarity, Spec §AC-US5-TERMINAL-009; §Edge Cases]
- [ ] CHK012 ¿Está definido el comportamiento de activaciones repetidas hasta alcanzar las nueve celdas vacías y el turno de X? [Coverage, Spec §AC-US5-HISTORIAL-010–011; SC-005]
- [ ] CHK013 ¿Están especificados por separado, para historial no disponible, la conservación del tablero, la conservación del estado y la permanencia de la indisponibilidad? [Completeness, Spec §AC-US5-UNWANTED-012–014]
- [ ] CHK014 ¿Está definido que “Reiniciar partida” vacía el tablero, restaura `PLAYING_X` y elimina el historial disponible como tres efectos explícitos? [Completeness, Spec §AC-US5-RESET-018–020; SC-006]
- [ ] CHK015 ¿Es inequívoco que ningún estado anterior al último reinicio puede recuperarse mediante “Deshacer jugada”? [Clarity, Spec §FR-007–FR-008; §Clarifications]
- [ ] CHK016 ¿Está documentado el caso de una nueva jugada legal después de deshacer, incluida su relación con el historial disponible y la exclusión de Redo? [Coverage, Spec §Edge Cases; §Assumptions; §Out of Scope]

## Completitud de interacción y accesibilidad

- [ ] CHK017 ¿Está especificada la visibilidad permanente de “Deshacer jugada” con texto exacto en cada uno de los cinco estados canónicos? [Completeness, Spec §AC-US5-INTERACCION-001; FR-001]
- [ ] CHK018 ¿Es inequívoca la correspondencia entre historial disponible y estado disponible/no disponible de la acción? [Clarity, Spec §AC-US5-DISPONIBILIDAD-003–004; FR-011]
- [ ] CHK019 ¿Están definidas de forma consistente la ubicación visual y la posición en el orden de foco entre el tablero y “Reiniciar partida”? [Consistency, Spec §AC-US5-INTERACCION-002; AC-US5-FOCO-026; FR-013]
- [ ] CHK020 ¿Están especificadas por separado las modalidades de puntero mediante clic y toque para una acción con historial disponible? [Coverage, Spec §AC-US5-PUNTERO-021–022]
- [ ] CHK021 ¿Están especificadas por separado las activaciones mediante Enter y Espacio cuando “Deshacer jugada” tiene el foco? [Coverage, Spec §AC-US5-TECLADO-023–024]
- [ ] CHK022 ¿Es inequívoco el orden de foco completo: nueve celdas por filas, “Deshacer jugada” y “Reiniciar partida”? [Clarity, Spec §AC-US5-FOCO-026; §Clarifications]
- [ ] CHK023 ¿Está especificada la permanencia del foco en “Deshacer jugada” para toda activación aceptada, incluida la que consume el último punto del historial disponible? [Coverage, Conflict, Spec §AC-US5-FOCO-025; AC-US5-DISPONIBILIDAD-004]
- [ ] CHK024 ¿Son consistentes el texto visible exacto y el nombre accesible exacto “Deshacer jugada”? [Consistency, Spec §AC-US5-INTERACCION-001; AC-US5-A11Y-028]
- [ ] CHK025 ¿Está definida sin alternativas la correspondencia entre `PLAYING_X`/`PLAYING_O` restaurado y cada anuncio accesible exacto? [Clarity, Spec §AC-US5-A11Y-029–030; FR-015]
- [ ] CHK026 ¿Está especificada la ausencia de anuncio de cambio de estado cuando no existe historial disponible? [Completeness, Spec §AC-US5-A11Y-031; FR-016]
- [ ] CHK027 ¿Es suficientemente concreta la señal perceptible de indisponibilidad para evaluar que no depende solo del color, o permanece abierta una decisión visual material? [Ambiguity, Spec §AC-US5-VISUAL-034; FR-018]

## Requisitos responsive y consistencia multi-feature

- [ ] CHK028 ¿Es consistente el requisito continuo de ausencia de desplazamiento horizontal entre 320 y 1920 píxeles con los anchos discretos enumerados en los outcomes? [Consistency, Spec §AC-US5-RESPONSIVE-032; SC-009]
- [ ] CHK029 ¿Están especificadas conjuntamente la ausencia de superposición al 200 % y la operabilidad del nuevo control bajo ampliación? [Completeness, Spec §AC-US5-RESPONSIVE-033; FR-017; SC-009]
- [ ] CHK030 ¿Está delimitado de forma inequívoca el fuera de alcance —Redo, selección múltiple, timeline, persistencia, backend y atajos globales— sin contradecir los requisitos funcionales? [Consistency, Spec §Out of Scope; FR-009]
- [ ] CHK031 ¿Está especificada la compatibilidad con los 42 AC de la feature 001, incluidos estados canónicos, victoria, empate, rechazo terminal y reinicio? [Completeness, Spec §Compatibility; FR-019–FR-020; SC-010]

## Trazabilidad y calidad de outcomes

- [ ] CHK032 ¿Exige el Traceability Contract IDs `AC-US5-*` globalmente únicos, Task IDs desde `T062` y la cadena criterio → tarea → commit → test para ambas features? [Traceability, Spec §Traceability Contract; SC-011]
- [ ] CHK033 ¿Son cuantificados y objetivamente evaluables los outcomes de restauración exacta, no-op sin historial disponible, recuperación terminal, teclado, anuncios, responsive y compatibilidad? [Measurability, Spec §SC-001–SC-012]

## Notes

- Marcar cada ítem únicamente después de revisar la calidad de la especificación referenciada.
- Registrar hallazgos inline con severidad y referencia a la sección afectada.
- Un ítem no resuelto bloquea el release gate hasta que la spec sea aclarada o corregida.
