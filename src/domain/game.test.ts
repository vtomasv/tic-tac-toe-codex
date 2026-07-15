import { describe, expect, test } from 'vitest';

import { gameReducer, INITIAL_STATE, WINNING_LINES, type Board } from './game';

describe('estado inicial', () => {
  test('AC-US1-ESTADO-001 inicia en PLAYING_X', () => {
    expect(INITIAL_STATE.status).toBe('PLAYING_X');
  });

  test('AC-US1-ESTADO-010 inicia con nueve celdas vacías', () => {
    expect(INITIAL_STATE.board).toEqual(Array(9).fill(null));
  });
});

describe('resultados', () => {
  test('AC-US2-DOMINIO-001 detecta las ocho líneas ganadoras de X', () => {
    expect(WINNING_LINES).toHaveLength(8);
    for (const [first, second, final] of WINNING_LINES) {
      const board = Array(9).fill(null) as Array<'X' | null>;
      board[first] = 'X';
      board[second] = 'X';
      const result = gameReducer({ board: board as unknown as Board, status: 'PLAYING_X' }, { type: 'PLAY_CELL', index: final });
      expect(result.status).toBe('WON_X');
    }
  });

  test('AC-US2-DOMINIO-002 detecta las ocho líneas ganadoras de O', () => {
    expect(WINNING_LINES).toHaveLength(8);
    for (const [first, second, final] of WINNING_LINES) {
      const board = Array(9).fill(null) as Array<'O' | null>;
      board[first] = 'O';
      board[second] = 'O';
      const result = gameReducer({ board: board as unknown as Board, status: 'PLAYING_O' }, { type: 'PLAY_CELL', index: final });
      expect(result.status).toBe('WON_O');
    }
  });

  test('AC-US2-DOMINIO-005 resuelve DRAW en la novena jugada sin línea ganadora', () => {
    const drawBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null] as const;
    expect(gameReducer({ board: drawBoard, status: 'PLAYING_X' }, { type: 'PLAY_CELL', index: 8 }).status).toBe('DRAW');

    const winningNinth = ['X', 'O', 'O', 'O', 'X', 'X', 'X', 'X', null] as const;
    expect(gameReducer({ board: winningNinth, status: 'PLAYING_X' }, { type: 'PLAY_CELL', index: 8 }).status).toBe('WON_X');
  });

  test('AC-US2-UNWANTED-007 conserva el tablero en estados terminales', () => {
    const board = [null, 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O'] as const;
    for (const status of ['WON_X', 'WON_O', 'DRAW'] as const) {
      expect(gameReducer({ board, status }, { type: 'PLAY_CELL', index: 0 }).board).toEqual(board);
    }
  });

  test('AC-US2-UNWANTED-008 conserva el estado terminal vigente', () => {
    const board = [null, 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O'] as const;
    for (const status of ['WON_X', 'WON_O', 'DRAW'] as const) {
      expect(gameReducer({ board, status }, { type: 'PLAY_CELL', index: 0 }).status).toBe(status);
    }
  });
});

describe('jugadas legales', () => {
  test('AC-US1-ESTADO-004 cambia de X a PLAYING_O tras una jugada no terminal', () => {
    expect(gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 }).status).toBe('PLAYING_O');
  });

  test('AC-US1-ESTADO-005 cambia de O a PLAYING_X tras una jugada no terminal', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    expect(gameReducer(afterX, { type: 'PLAY_CELL', index: 1 }).status).toBe('PLAYING_X');
  });

  test('AC-US1-UNWANTED-006 conserva el tablero al activar una celda ocupada', () => {
    const occupied = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    expect(gameReducer(occupied, { type: 'PLAY_CELL', index: 0 }).board).toEqual(occupied.board);
  });

  test('AC-US1-UNWANTED-007 conserva el estado al activar una celda ocupada', () => {
    const occupied = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    expect(gameReducer(occupied, { type: 'PLAY_CELL', index: 0 }).status).toBe(occupied.status);
  });
});
