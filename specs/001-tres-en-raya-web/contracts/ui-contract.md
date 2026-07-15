# UI Contract

## App

`src/App.tsx` owns the reducer state and is the only layer that dispatches domain actions.
It accepts an optional immutable `initialState` prop solely to render any canonical state directly in
component tests; production mounting omits it and therefore uses `INITIAL_STATE`.

Responsibilities:

- render one `Board` and one `GameStatus`;
- translate cell activation to `PLAY_CELL`;
- translate reset activation to `RESET`;
- keep reset enabled in every canonical state;
- move focus to row 1, column 1 after reset;
- provide deterministic announcement content/revision without timers.

## Board

`src/components/Board.tsx`

Conceptual props:

- immutable board;
- canonical status;
- `onCellActivate(index)` callback;
- reference/callback for the first-cell focus target.

Semantic contract:

1. The board has an accessible name “Tablero de Tres en Raya”.
2. The board is exposed as a group or 3-by-3 grid with three rows.
3. Each cell is a real `<button type="button">` in row-major DOM order.
4. Each cell name is `Fila N, columna N, vacía|X|O`.
5. Native button activation handles click, touch, Enter and Space; no duplicate key handler.
6. Occupied and terminal cells expose `aria-disabled="true"` and remain focusable.
7. Guarded callbacks and the reducer make unavailable activation a no-op.
8. Reset is outside the blocked board controls and remains operable.

## GameStatus

`src/components/GameStatus.tsx`

Conceptual props:

- canonical status;
- deterministic announcement content or revision token.

Visible status text:

| Status | Text |
|--------|------|
| `PLAYING_X` | `Turno de X` |
| `PLAYING_O` | `Turno de O` |
| `WON_X` | `Ganó X` |
| `WON_O` | `Ganó O` |
| `DRAW` | `Empate` |

The status is one visible, non-intrusive live region with `role="status"`, `aria-live="polite"` and
`aria-atomic="true"`. Initialization and reset announce X; turn changes and terminal results update
the same mechanism.

## Styling Contract

`src/styles.css` must:

- present an exact three-by-three grid;
- preserve row-major reading order;
- fit board and reset without horizontal overflow at 320–1920 CSS pixels;
- prevent control overlap at 200 % zoom;
- show a continuous focus outline;
- show a distinct outline while a playable empty cell is hovered;
- keep X/O, turn and result perceptible without color.

## Component Verification

`src/components/Board.test.tsx` may render `App` when integration across Board, GameStatus and reset is
required. Browser-only layout, actual touch and computed visual behavior are additionally verified in
`tests/e2e/tic-tac-toe.spec.ts`.
