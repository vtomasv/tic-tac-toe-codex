# Data Model: Deshacer la última jugada

## Scope

Este modelo amplía el estado en memoria de la aplicación. No introduce persistencia, serialización, red ni backend. Las reglas existentes de tablero, victoria, empate y turnos conservan su autoridad.

## Existing value types

### Player

- Valores: `X`, `O`.
- Invariante: solo uno puede ser el siguiente jugador en un estado de juego.

### Cell

- Valores: `X`, `O`, `null`.
- `null` representa una celda vacía.

### Board

- Tupla readonly de exactamente nueve `Cell`.
- El orden es por filas, de índice 0 a 8.
- Una transición nunca muta un `Board` publicado.

### GameStatus

- `PLAYING_X`
- `PLAYING_O`
- `WON_X`
- `WON_O`
- `DRAW`

No se añaden ni renombran estados canónicos.

## New and extended entities

### GameSnapshot

Representación canónica mínima de un instante restaurable.

| Campo | Tipo | Requerido | Regla |
|---|---|---:|---|
| `board` | `Board` | Sí | Tablero exacto anterior a una jugada legal |
| `status` | `GameStatus` | Sí | Estado/turno exacto correspondiente al tablero |

Un snapshot no contiene historial. Esta restricción evita recursión y hace atómica la restauración de tablero y estado.

### GameHistory

Colección readonly y ordenada de `GameSnapshot`.

- El primer elemento es el snapshot anterior a la jugada legal más antigua todavía deshacible.
- El último elemento es el snapshot inmediatamente anterior a la última jugada legal aceptada.
- Solo `PLAY_CELL` aceptado añade una entrada.
- `UNDO` elimina exactamente el último elemento.
- `RESET` elimina todos los elementos.
- El historial disponible contiene entre 1 y 9 snapshots; el historial vacío contiene 0.

### GameState

| Campo | Tipo | Requerido | Regla |
|---|---|---:|---|
| `board` | `Board` | Sí | Tablero canónico actual |
| `status` | `GameStatus` | Sí | Estado canónico actual |
| `history` | `GameHistory` | Sí | Puntos de Undo disponibles |

`history` nunca es opcional. Un objeto sin historial no es un `GameState` válido.

### GameAction

| Variante | Datos | Efecto autorizado |
|---|---|---|
| `PLAY_CELL` | `index` | Aceptar una jugada legal o devolver no-op |
| `UNDO` | Ninguno | Restaurar una entrada o devolver no-op vacío |
| `RESET` | Ninguno | Devolver estado inicial e historial vacío |

No existe acción `REDO`.

## Initial state

El estado inicial tiene:

- nueve celdas `null`;
- `status: PLAYING_X`;
- `history: []` readonly.

El mismo conjunto de valores resulta de `RESET`, sin importar el estado o historial previo.

## Derived values

### Historial disponible

`canUndo(state)` es verdadero si y solo si el dominio tiene al menos una entrada restaurable. App y los componentes consumen el selector; no derivan la regla de los campos internos.

### Current player

- `PLAYING_X` corresponde al turno de X.
- `PLAYING_O` corresponde al turno de O.
- Los estados terminales no tienen siguiente jugador hasta que `UNDO` restaura un snapshot de juego.

## Invariants

1. `board`, `status` e `history` cambian en una única transición atómica.
2. Cada snapshot es un par coherente de tablero y estado que existió inmediatamente antes de una jugada legal.
3. El reducer no modifica arrays existentes; crea tablero e historial nuevos cuando hay cambio.
4. Un intento sobre celda ocupada, índice inválido o estado terminal devuelve el mismo estado y no crea snapshot.
5. Una jugada legal aumenta la longitud del historial exactamente en uno.
6. `UNDO` con historial aumenta cero marcas, restaura el último snapshot y reduce la longitud exactamente en uno.
7. `UNDO` sin historial devuelve el mismo estado y conserva las nueve celdas.
8. `RESET` produce exactamente el estado inicial y no conserva referencia recuperable al historial previo desde el nuevo estado.
9. Todo estado terminal alcanzado por juego legal tiene al menos una entrada de historial y puede volver al estado de juego inmediatamente anterior.
10. Después de Undo, el `status` restaurado determina el jugador cuya jugada fue retirada.

## Transition table

| Estado actual | Acción / condición | Tablero resultante | Estado resultante | Historial resultante |
|---|---|---|---|---|
| Cualquiera | `RESET` | Vacío | `PLAYING_X` | Vacío |
| Cualquiera con historial | `UNDO` | Último snapshot | `status` del último snapshot | Sin su última entrada |
| Cualquiera sin historial | `UNDO` | Sin cambios | Sin cambios | Sin cambios |
| `WON_X`, `WON_O`, `DRAW` | `PLAY_CELL` | Sin cambios | Sin cambios | Sin cambios |
| `PLAYING_X`, `PLAYING_O` | Índice inválido | Sin cambios | Sin cambios | Sin cambios |
| `PLAYING_X`, `PLAYING_O` | Celda ocupada | Sin cambios | Sin cambios | Sin cambios |
| `PLAYING_X` | Jugada X no terminal | Marca X aplicada | `PLAYING_O` | Añade snapshot previo |
| `PLAYING_O` | Jugada O no terminal | Marca O aplicada | `PLAYING_X` | Añade snapshot previo |
| `PLAYING_X` | Jugada X ganadora | Marca X aplicada | `WON_X` | Añade snapshot previo |
| `PLAYING_O` | Jugada O ganadora | Marca O aplicada | `WON_O` | Añade snapshot previo |
| Estado de juego | Jugada que llena sin ganador | Marca aplicada | `DRAW` | Añade snapshot previo |

## Undo sequence examples

### One move

```text
Initial: board empty, PLAYING_X, history []
PLAY_CELL(0): X at 0, PLAYING_O, history [Initial snapshot]
UNDO: board empty, PLAYING_X, history []
```

### Two moves

```text
S0 --legal X--> S1, history [S0]
S1 --legal O--> S2, history [S0, S1]
S2 --UNDO--> S1, history [S0]
S1 --UNDO--> S0, history []
S0 --UNDO--> S0, history []
```

### Terminal move

```text
S4 PLAYING_X --legal winning X--> S5 WON_X, history [..., S4]
S5 --UNDO--> S4 PLAYING_X, history without S4
```

El mismo patrón aplica a `WON_O` y `DRAW`.

## Validation rules for constructed fixtures

- Todo fixture anotado como `GameState` incluye `history` explícito.
- Un fixture de render terminal con `history: []` declara de forma intencional que no representa una secuencia deshacible.
- Un fixture destinado a probar Undo contiene snapshots coherentes o se obtiene aplicando jugadas legales desde `INITIAL_STATE`.
- Los helpers de test no aceptan un historial omitido si retornan `GameState`; si ofrecen un default, el nombre y uso dejan explícito que construyen `history: []`.
- No existe adaptador runtime que complete estados antiguos.

## Out of scope data

- Futuro para Redo.
- Timeline o metadatos de jugadas.
- Timestamps, autores o puntuación.
- Historial persistido al recargar.
- Estado remoto o sincronización.
