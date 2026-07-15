# Domain Contract

## Module

`src/domain/game.ts`

## Public Types

- `Player`: `X | O`
- `Cell`: empty or Player
- `GameStatus`: `PLAYING_X | PLAYING_O | WON_X | WON_O | DRAW`
- `GameState`: immutable board plus explicit status
- `GameAction`: play one indexed cell or reset
- `WinningLine`: immutable triple of board indices

## Public Values and Operations

- `INITIAL_STATE`: nine empty cells and `PLAYING_X`.
- `WINNING_LINES`: exactly the eight accepted row, column and diagonal triples.
- `gameReducer(state, action)`: total, deterministic and pure.
- Pure status/player selectors may be exported only when reused by presentation.

## Behavioral Contract

1. No function imports React or reads browser/global mutable state.
2. Invalid indices are rejected deterministically without state mutation.
3. Occupied and terminal actions return the unchanged state.
4. A legal move uses the player encoded by current status.
5. Winner detection runs before draw detection.
6. Draw detection runs before turn alternation.
7. Reset returns `INITIAL_STATE` from all five canonical states.
8. No timers, random values, network calls, storage or side effects are permitted.

## Verification Boundary

`src/domain/game.test.ts` is the primary test file. Every test title includes one or more AC-IDs from
`traceability.md`; table-driven winning-line cases retain the AC-ID in the parent test title.
