export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type GameStatus = 'PLAYING_X' | 'PLAYING_O' | 'WON_X' | 'WON_O' | 'DRAW';

export interface GameState {
  readonly board: Board;
  readonly status: GameStatus;
}

export type GameAction =
  | { readonly type: 'PLAY_CELL'; readonly index: number }
  | { readonly type: 'RESET' };

const EMPTY_BOARD: Board = Object.freeze([
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]);

export const INITIAL_STATE: GameState = Object.freeze({
  board: EMPTY_BOARD,
  status: 'PLAYING_X',
});
