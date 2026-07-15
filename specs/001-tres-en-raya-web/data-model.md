# Data Model: Tres en Raya web local

This model is in-memory domain state only. It defines no database, persisted record or network shape.

## Domain Types

### Player

- Values: `X`, `O`.
- Identity exists only for the current local game.

### Cell

- Values: empty, `X`, `O`.
- Domain representation: `null | Player`.
- Position: index 0 through 8.
- Presentation coordinates:
  - row = integer division of index by 3, plus 1;
  - column = index modulo 3, plus 1.

### Board

- Fixed-length ordered collection of exactly nine cells.
- Row-major order: indices 0–2, 3–5 and 6–8.
- New and reset boards contain nine empty cells.

### GameStatus

Exactly one of:

- `PLAYING_X`
- `PLAYING_O`
- `WON_X`
- `WON_O`
- `DRAW`

### GameState

- `board`: immutable Board.
- `status`: GameStatus.

### GameAction

- `PLAY_CELL(index)`: requests activation of one board position.
- `RESET`: requests the canonical initial state.

### WinningLine

- Immutable triple of distinct board indices.
- `WINNING_LINES` contains exactly eight triples: three rows, three columns and two diagonals.
- The constant is the only source used for winner detection.

## Invariants

1. A board always contains exactly nine cells.
2. Each cell is empty, X or O.
3. `PLAYING_X` identifies X as the current player; `PLAYING_O` identifies O.
4. `WON_X` requires at least one complete X winning line.
5. `WON_O` requires at least one complete O winning line.
6. `DRAW` requires nine occupied cells and no complete winning line.
7. A terminal state rejects every `PLAY_CELL` without changing board or status.
8. An occupied cell rejects `PLAY_CELL` without changing board or status.
9. `RESET` from any canonical status yields exactly `INITIAL_STATE`.
10. Winner evaluation precedes full-board evaluation.

## State Transitions

| Current state | Action and condition | Result |
|---------------|----------------------|--------|
| Not mounted | Initialize | Empty board, `PLAYING_X` |
| `PLAYING_X` | Legal non-terminal X move | Mark X, `PLAYING_O` |
| `PLAYING_O` | Legal non-terminal O move | Mark O, `PLAYING_X` |
| `PLAYING_X` | X completes any winning line | Mark X, `WON_X` |
| `PLAYING_O` | O completes any winning line | Mark O, `WON_O` |
| Playing | Ninth occupied cell without winner | `DRAW` |
| Playing | Occupied-cell action | Same state object |
| Terminal | Any cell action | Same state object |
| Any canonical state | `RESET` | Empty board, `PLAYING_X` |

## Presentation-Only State

React may keep deterministic announcement revision/event information and a reference to the first
cell. These values do not change game rules and are not part of `GameState`.

## Excluded Models

There is no user, account, score, history, saved game, remote session, AI player or persistence model.
