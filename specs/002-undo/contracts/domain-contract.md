# Domain Contract: Undo

## Authority

`src/domain/` es la única capa autorizada para decidir si una jugada es legal, registrar historial, determinar disponibilidad y aplicar `PLAY_CELL`, `UNDO` o `RESET`. El contrato es puro, total, determinista e independiente de React y browser.

## Public model

La implementación conservará el significado de los tipos existentes y añadirá conceptualmente:

```ts
type GameSnapshot = Readonly<{
  board: Board
  status: GameStatus
}>

type GameHistory = readonly GameSnapshot[]

type GameState = Readonly<{
  board: Board
  status: GameStatus
  history: GameHistory
}>

type GameAction =
  | { readonly type: 'PLAY_CELL'; readonly index: number }
  | { readonly type: 'UNDO' }
  | { readonly type: 'RESET' }
```

Los nombres concretos pueden alinearse con el módulo existente, pero no puede cambiar la semántica, volver opcional el historial ni exponer una representación mutable.

## Public operations

### `gameReducer(state, action): GameState`

- Acepta todo `GameState` válido y toda variante de `GameAction`.
- Devuelve un `GameState` válido para todas las entradas.
- No lanza para una acción válida del contrato.
- No muta `state`, `state.board`, `state.history` ni snapshots.
- Un no-op puede y debe devolver la misma referencia de estado.

### `canUndo(state): boolean`

- Devuelve verdadero exactamente cuando el estado contiene al menos un snapshot restaurable.
- No modifica estado.
- Es la única fuente que App usa para configurar disponibilidad.

### `INITIAL_STATE`

- Tablero vacío.
- `PLAYING_X`.
- Historial vacío readonly.

## Action contracts

### `PLAY_CELL`

Una acción se acepta solo si:

1. `status` es `PLAYING_X` o `PLAYING_O`;
2. `index` identifica una de las nueve celdas;
3. la celda indicada está vacía.

Si se acepta:

- se captura un solo `GameSnapshot` de tablero y estado previos;
- se añade exactamente una entrada al final del historial;
- se aplica una sola marca del jugador actual;
- se usan sin cambios las reglas existentes para siguiente turno, victoria o empate.

Si se rechaza:

- tablero, estado e historial permanecen iguales;
- no se crea snapshot intermedio o descartable observable.

### `UNDO`

Con historial disponible:

- selecciona el último snapshot;
- restaura exactamente su tablero;
- restaura exactamente su estado canónico;
- devuelve el historial anterior sin esa última entrada;
- no modifica entradas anteriores;
- revierte una jugada individual.

Sin historial:

- devuelve el mismo estado;
- no crea historial;
- no comunica efectos de interfaz.

`UNDO` se evalúa antes del bloqueo terminal, por lo que funciona desde los cinco estados canónicos cuando existe historial.

### `RESET`

- Devuelve los valores de `INITIAL_STATE`.
- Descarta todas las entradas, aun si el estado era terminal.
- No permite que un `UNDO` posterior restaure el estado previo.

## Transition obligations

| Acción | Precondición | Cambio de tablero | Cambio de status | Cambio de historial |
|---|---|---|---|---|
| `PLAY_CELL` legal | Estado de juego + celda vacía | Una marca | Turno o terminal existente | `+1` snapshot previo |
| `PLAY_CELL` rechazado | Terminal, ocupada o índice inválido | Ninguno | Ninguno | Ninguno |
| `UNDO` | Historial disponible | Último snapshot | Último snapshot | `-1` última entrada |
| `UNDO` | Historial vacío | Ninguno | Ninguno | Ninguno |
| `RESET` | Cualquier estado | Vacío | `PLAYING_X` | Vacío |

## Immutability obligations

- Toda jugada legal crea un tablero nuevo.
- Toda adición o eliminación de historial crea una colección nueva.
- Los snapshots publicados no cambian después de crearse.
- Restaurar un snapshot puede reutilizar su tablero readonly; no puede mutarlo.
- No se usa variable de módulo para historial, cache mutable ni efecto lateral.

## Compatibility obligations

- `history` es requerido en el tipo público.
- Los unit tests migran todos los literales `GameState` incompletos.
- La migración no cambia las combinaciones ganadoras, la detección de empate ni alternancia de turnos.
- Los tests previos conservan sus AC-ID literales y continúan verdes.
- No se introduce Redo ni persistencia.

## Required domain test evidence

Los tests unitarios RED/GREEN deben cubrir con IDs literales:

- restauración independiente de tablero y estado/turno;
- eliminación de una sola jugada;
- repetición hasta vacío;
- no-op con historial vacío;
- los tres estados terminales;
- historial creado solo por jugadas legales;
- rechazos por ocupada y terminal sin entrada;
- RESET y pérdida de historial;
- selector disponible/no disponible.

La matriz exacta vive en `traceability-contract.md`.
