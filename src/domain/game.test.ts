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
