# Prompt: cerrar todas las ambigüedades

```text
$speckit-clarify

Audita la feature activa `specs/002-undo/spec.md` y codifica las aclaraciones en la spec. No modifiques código, plan ni tasks.

DECISIONES YA CERRADAS - NO LAS VUELVAS A PREGUNTAR
- Una activación revierte una jugada individual.
- Undo está permitido desde WON_X, WON_O y DRAW y restaura el estado de juego anterior.
- Undo repetido llega hasta el tablero vacío.
- Historial vacío: no-op determinista; control visible pero no disponible; sin anuncio falso.
- Texto visible/accesible: "Deshacer jugada".
- Ubicación: después del tablero y antes de Reiniciar partida.
- Orden de foco: nueve celdas -> Deshacer jugada -> Reiniciar partida.
- El foco permanece en el botón tras una activación aceptada.
- Anuncio exacto: "Jugada deshecha. Turno de X/O".
- Reiniciar elimina el historial y Undo no recupera la partida anterior.
- Redo está fuera de alcance.

ESCANEO OBLIGATORIO
1. Comprueba que cada AC tiene patrón EARS explícito, ID AC-US5-* único y una sola respuesta observable.
2. Verifica que tablero y estado se restauren como dos observables separados cuando corresponda.
3. Verifica la semántica de historial: solo jugadas legales aceptadas se registran; intentos rechazados no crean entradas.
4. Verifica terminales, repetición, tablero vacío y reset.
5. Verifica disponibilidad visible, clic/toque/Enter/Espacio, foco, orden de foco, nombre accesible, anuncio y responsive.
6. Verifica que no se introduzcan detalles de React, reducer, arrays, stacks o archivos.
7. Verifica compatibilidad explícita con los 42 AC existentes y fuera de alcance.
8. Normaliza términos: usa siempre "Deshacer jugada", "jugada legal", "historial disponible" y "estado terminal".

PREGUNTAS
Solo formula una pregunta si detectas una contradicción material no resuelta por las decisiones anteriores. Máximo cinco, una por vez. Si no existe ninguna, informa "No critical ambiguities detected worth formal clarification" y finaliza.

SALIDA/GATE
- Cero marcadores NEEDS CLARIFICATION.
- Cero AC duplicados o no EARS.
- Clarifications registra cada respuesta aceptada.
- Revalida el checklist requirements.md si existe.
- Reporta secciones modificadas y cantidad final de AC.
```
