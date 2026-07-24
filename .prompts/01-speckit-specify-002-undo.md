# Prompt: crear la feature 002 Undo con Spec Kit

Ejecutar en la sesión principal:

```text
$speckit-specify

Crea una nueva feature independiente bajo `specs/002-undo/` para añadir el mecanismo "Deshacer jugada" a la aplicación existente `tic-tac-toe-codex`.

REGLA DE AISLAMIENTO
- Esta invocación solo crea la especificación y el checklist inicial que produzca Spec Kit.
- No modifiques la feature `specs/001-tres-en-raya-web/`.
- Persiste `.specify/feature.json` apuntando a `specs/002-undo`.
- No escribas código, plan, tasks ni decisiones de implementación.

IDENTIDAD Y TRAZABILIDAD GLOBAL
- La nueva historia debe ser `US-005 - Deshacer la última jugada`, aunque viva en la feature 002, para mantener IDs globalmente únicos respecto de US-001..US-004.
- Usa exclusivamente IDs `AC-US5-CATEGORIA-nnn`, únicos en todo el repositorio.
- No reinicies la numeración semántica de historias.
- Incluye un Traceability Contract que exija criterio -> tarea -> commit -> test y que los Task IDs continúen después del máximo existente del repositorio.

DEFINICIONES
- "Jugada legal": activación aceptada de una celda vacía durante PLAYING_X o PLAYING_O.
- "Deshacer una jugada": restaurar exactamente el tablero y estado canónico existentes inmediatamente antes de la última jugada legal aceptada.
- "Historial disponible": existe al menos una jugada legal aceptada desde el inicio o último reinicio.
- Estados canónicos existentes: PLAYING_X, PLAYING_O, WON_X, WON_O y DRAW.

COMPORTAMIENTO OBLIGATORIO
1. Una activación de "Deshacer jugada" revierte exactamente una jugada individual, no una ronda X+O.
2. Después de deshacer, vuelve el turno del jugador cuya jugada fue retirada.
3. Se puede deshacer desde PLAYING_X, PLAYING_O, WON_X, WON_O y DRAW cuando existe historial.
4. Deshacer desde un estado terminal elimina la jugada terminal y restaura el estado de juego anterior.
5. Se puede deshacer repetidamente hasta llegar al tablero inicial vacío.
6. Con historial vacío, el estado y las nueve celdas permanecen sin cambios y no se crea historial adicional.
7. Solo las jugadas legales crean puntos de deshacer. Intentos sobre celdas ocupadas o en estado terminal no crean entradas.
8. "Reiniciar partida" vacía el tablero, devuelve PLAYING_X y elimina todo el historial; después no es posible recuperar la partida anterior mediante Undo.
9. No existe Redo.

INTERFAZ
- Presenta una acción visible con texto exacto "Deshacer jugada" en todos los estados canónicos.
- La acción se ubica después del tablero y antes de "Reiniciar partida".
- Orden de foco: nueve celdas en orden de filas, luego "Deshacer jugada", luego "Reiniciar partida".
- Cuando no hay historial, la acción permanece visible pero se expone como no disponible y no puede activarse.
- Cuando hay historial, admite clic, toque, Enter y Espacio mediante semántica nativa.
- Después de una activación aceptada, el foco permanece en "Deshacer jugada".
- La indisponibilidad debe comunicarse con semántica y una señal no dependiente solo del color.

TECNOLOGÍA ASISTIVA
- Nombre visible y accesible exacto: "Deshacer jugada".
- Después de deshacer con jugadas restantes o al llegar al tablero vacío, anunciar exactamente:
  - "Jugada deshecha. Turno de X", o
  - "Jugada deshecha. Turno de O",
  según el estado restaurado.
- Cuando la acción está no disponible, no anunciar un falso cambio de estado.
- El anuncio no mueve el foco.

RESPONSIVE
- El nuevo control debe conservar la operabilidad existente entre 320 y 1920 píxeles y al 200 % de ampliación, sin desplazamiento horizontal ni superposición de controles.

CRITERIOS EARS
- Cada criterio debe usar explícitamente Ubiquitous, Event-driven, State-driven, Optional feature o Unwanted behavior.
- Cada criterio debe tener una única respuesta observable principal.
- Usa como sistema exactamente "la aplicación Tres en Raya".
- Evita términos vagos como correctamente, intuitivo, rápido, apropiado o cuando sea posible.
- Cubre como mínimo y separadamente: visibilidad, disponibilidad, restauración de tablero, restauración de estado/turno, una sola jugada, repetición, no-op vacío, terminales, historial de jugadas legales, rechazo sin historial, reset, teclado/puntero, foco, orden de foco, nombre accesible, anuncio, ausencia de anuncio falso, responsive y señal no cromática.

FUERA DE ALCANCE
- Redo.
- Elegir cuántas jugadas deshacer en una sola acción.
- Mostrar una lista o timeline de historial.
- Persistir historial al recargar/cerrar.
- Backend, red, cuentas, puntuación, IA o juego remoto.
- Atajos de teclado globales adicionales.

RESULTADOS MEDIBLES
Incluye outcomes verificables: restauración exacta en el 100 % de secuencias legales cubiertas, no alteración con historial vacío, recuperación desde los tres estados terminales, operación completa por teclado, anuncios exactos, compatibilidad responsive y trazabilidad completa.

COMPATIBILIDAD
- Los 42 criterios de la feature 001 deben permanecer sin cambios y en verde.
- No redefinas estados canónicos ni reglas de victoria/empate existentes.
- No selecciones tecnología ni estructura de archivos en la spec.
```
