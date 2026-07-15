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

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESET') {
    return state;
  }

  if (state.board[action.index] !== null) {
    return state;
  }

  const player: Player = state.status === 'PLAYING_O' ? 'O' : 'X';
  const board = [...state.board] as Cell[];
  board[action.index] = player;

  return {
    board: board as unknown as Board,
    status: player === 'X' ? 'PLAYING_O' : 'PLAYING_X',
  };
}
