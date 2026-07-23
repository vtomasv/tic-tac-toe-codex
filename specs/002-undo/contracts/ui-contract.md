# UI Contract: Deshacer jugada

## Component boundary

El nuevo componente es presentacional y controlado. Su contrato mínimo es:

```ts
type UndoButtonProps = Readonly<{
  available: boolean
  onUndo: () => void
}>
```

No recibe `GameState`, historial, turno ni status. No importa acciones o reducer de dominio.

## Existing `GameStatus` compatibility contract

La extensión del componente existente queda congelada con esta firma exacta:

```ts
type GameStatusProps = Readonly<{
  status: Status
  announcement?: string
}>
```

- `status` continúa requerido y conserva su tipo actual.
- `announcement` es opcional para que todos los consumidores existentes sigan compilando sin cambios.
- Si `announcement` es `undefined`, el componente presenta exactamente el mensaje canónico actual
  correspondiente a `status`.
- Si `announcement` contiene texto, el componente presenta exactamente ese texto.
- Ambos casos usan el mismo elemento estable `role="status"`; no se crea otra región viva.
- El componente no detecta acciones, no decide si Undo fue aceptado y no selecciona X u O.

La rama interfaz debe poder ejecutar component y build con el `App.tsx` anterior, que continúa usando
`<GameStatus status={state.status} />`. La integración posterior, propiedad de e2e, es la única que
empieza a proporcionar `announcement`.

## Render contract

El componente produce siempre:

- un botón nativo de tipo `button`;
- texto visible exacto `Deshacer jugada` dentro del botón;
- nombre accesible exacto `Deshacer jugada`;
- posición DOM estable suministrada por App después del tablero y antes de Reiniciar partida.

Cuando `available` es falso:

- el botón permanece renderizado y en el orden de foco;
- expone `aria-disabled="true"`;
- cualquier intento de invocar el handler queda bloqueado antes de llamar `onUndo`;
- se muestra una indicación textual `No disponible` fuera del nombre del botón;
- la indicación textual es la señal primaria no dependiente del color.

Cuando `available` es verdadero:

- no expone indisponibilidad;
- cada activación nativa aceptada llama `onUndo` una vez;
- clic, toque, Enter y Espacio dependen de semántica nativa, sin listeners globales.

## Focus contract

El orden DOM y de foco es:

1. nueve botones de celda en orden de filas;
2. `Deshacer jugada`;
3. `Reiniciar partida`.

Obligaciones:

- el botón Undo no se desmonta, reemplaza ni cambia de `key` por disponibilidad;
- una activación aceptada deja el foco sobre el mismo nodo;
- pasar a `aria-disabled="true"` tras deshacer la última jugada no mueve el foco;
- Undo no llama `focus()` sobre tablero, estado o reinicio;
- los estilos conservan un indicador de foco visible que no depende solo del color.

## App integration contract

`src/App.tsx` es el único composition root y debe:

```text
state --canUndo(state)--> available --prop--> UndoButton
UndoButton --onUndo--> dispatch({ type: UNDO })
reducer --restored status--> exact announcement
```

App no:

- consulta `history.length`;
- retira marcas;
- calcula jugador previo;
- detecta si una jugada fue legal;
- reconstruye victoria, empate o turno.

App sí:

- coloca el control entre tablero y Reiniciar;
- despacha `UNDO` una sola vez por callback;
- registra que existe un evento Undo aceptado pendiente antes de despachar;
- consume ese evento una sola vez después de recibir el `status` efectivamente restaurado;
- deriva el texto de anuncio exclusivamente de ese `status` restaurado;
- evita crear anuncio si el callback no fue aceptado;
- conserva el nodo enfocado.

## Status and announcement contract

La aplicación conserva una sola región visible con `role="status"`. App entrega el texto mediante la
prop opcional `announcement`; omitirla restaura el mensaje canónico.

Después de un Undo aceptado:

- `PLAYING_X` se presenta exactamente como `Jugada deshecha. Turno de X`;
- `PLAYING_O` se presenta exactamente como `Jugada deshecha. Turno de O`.

La región:

- permanece en el mismo nodo estable;
- no recibe foco;
- conserva `aria-live="polite"` y `aria-atomic="true"` si ya forman parte del contrato existente;
- vuelve al mensaje canónico normal con una jugada o RESET posterior;
- no cambia por interacción con Undo no disponible.

La extensión compatible del componente de estado es responsabilidad de interfaz. Sus tests de
componente prueban fallback y presentación exacta de la prop; no reclaman que App haya seleccionado
el mensaje correcto. Los tests de integración de App son la evidencia obligatoria de
`AC-US5-A11Y-029` y `AC-US5-A11Y-030`, incluidos el origen X/O y el consumo único del evento.

## Reset integration

Al activar Reiniciar partida:

- App despacha únicamente `RESET`;
- el dominio devuelve historial vacío;
- `canUndo` pasa a falso;
- Undo permanece visible y muestra su estado no disponible;
- se conserva el comportamiento de foco existente de Reiniciar partida;
- no aparece un anuncio de Undo.

## Responsive contract

El bloque de acciones admite el control adicional sin cambiar el tablero:

- 320 px: sin overflow horizontal y sin superposición;
- 1920 px: orden y proximidad conservados;
- zoom 200 %: controles legibles, activables y sin solapamiento;
- el texto `Deshacer jugada` no se oculta ni se reemplaza por icono;
- la señal `No disponible` permanece perceptible.

Los estilos se asignan a e2e/integración porque forman parte de la composición global. El componente puede exponer clases estables, pero no reglas de dominio.

## Component test contract

Los tests de componente demuestran, con AC-ID literal:

- render visible en ambas disponibilidades;
- nombre visible y accesible exacto;
- `aria-disabled` y bloqueo de callback;
- callback único por clic, Enter y Espacio cuando está disponible;
- permanencia de foco sobre la misma instancia;
- indicación textual no cromática.

Los tests de integración/E2E demuestran ubicación, orden completo de foco, toque real, anuncio, terminales, repetición, reset y responsive.

## Composition TDD boundary

Este bloque se materializa en el segundo pase Tasks, después de integrar `T063`, validar
`--phase=tasks` y obtener el segundo Analyze en GO. Antes de editar `src/App.tsx` o
`src/styles.css`, e2e crea un bloque RED consecutivo con:

- todos los tests de `src/components/App.integration.test.tsx` asignados a Undo;
- todos los tests de `tests/e2e/game.spec.ts` asignados a Undo;
- evidencia de fallo causada por la ausencia de la composición, no por fixture o servidor.

Las RED se dividen por familia observable. Solo después se permiten GREEN pequeñas para:
shell/orden/disponibilidad, conexión Undo al dominio, anuncio/foco y estilos responsive/no
cromáticos. No se admite una GREEN previa que renderice `UndoButton` con callback temporal ni que
despache `UNDO` antes de que los tests de interacción, restauración, anuncios y flujos E2E hayan
demostrado RED; tampoco se agrupan todas las familias en un único commit GREEN.
