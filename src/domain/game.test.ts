import { describe, expect, test } from 'vitest';

import { gameReducer, INITIAL_STATE } from './game';

describe('estado inicial', () => {
  test('AC-US1-ESTADO-001 inicia en PLAYING_X', () => {
    expect(INITIAL_STATE.status).toBe('PLAYING_X');
  });

  test('AC-US1-ESTADO-010 inicia con nueve celdas vacías', () => {
    expect(INITIAL_STATE.board).toEqual(Array(9).fill(null));
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
});
