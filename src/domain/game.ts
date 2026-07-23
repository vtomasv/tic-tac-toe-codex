export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type GameStatus = 'PLAYING_X' | 'PLAYING_O' | 'WON_X' | 'WON_O' | 'DRAW';

export interface GameSnapshot {
  readonly board: Board;
  readonly status: GameStatus;
}

export type GameHistory = readonly GameSnapshot[];

export interface GameState {
  readonly board: Board;
  readonly status: GameStatus;
  readonly history: GameHistory;
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

export const WINNING_LINES = Object.freeze([
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const);

export const INITIAL_STATE: GameState = Object.freeze({
  board: EMPTY_BOARD,
  status: 'PLAYING_X',
  history: Object.freeze([]),
});

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESET') {
    return INITIAL_STATE;
  }

  if (state.status === 'WON_X' || state.status === 'WON_O' || state.status === 'DRAW') {
    return state;
  }

  if (state.board[action.index] !== null) {
    return state;
  }

  const player: Player = state.status === 'PLAYING_O' ? 'O' : 'X';
  const board = [...state.board] as Cell[];
  board[action.index] = player;

  const won = WINNING_LINES.some(([first, second, third]) =>
    board[first] === player && board[second] === player && board[third] === player,
  );
  const draw = !won && board.every((cell) => cell !== null);
  const snapshot: GameSnapshot = Object.freeze({
    board: state.board,
    status: state.status,
  });

  return {
    board: board as unknown as Board,
    status: won
      ? player === 'X' ? 'WON_X' : 'WON_O'
      : draw ? 'DRAW'
      : player === 'X' ? 'PLAYING_O' : 'PLAYING_X',
    history: Object.freeze([...state.history, snapshot]),
  };
}
