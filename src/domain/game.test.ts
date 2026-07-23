import { describe, expect, test } from 'vitest';

import {
  canUndo,
  gameReducer,
  INITIAL_STATE,
  WINNING_LINES,
  type Board,
  type GameState,
  type GameStatus,
} from './game';

function stateWithEmptyHistory(board: Board, status: GameStatus): GameState {
  return { board, status, history: [] };
}

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
      const result = gameReducer(
        stateWithEmptyHistory(board as unknown as Board, 'PLAYING_X'),
        { type: 'PLAY_CELL', index: final },
      );
      expect(result.status).toBe('WON_X');
    }
  });

  test('AC-US2-DOMINIO-002 detecta las ocho líneas ganadoras de O', () => {
    expect(WINNING_LINES).toHaveLength(8);
    for (const [first, second, final] of WINNING_LINES) {
      const board = Array(9).fill(null) as Array<'O' | null>;
      board[first] = 'O';
      board[second] = 'O';
      const result = gameReducer(
        stateWithEmptyHistory(board as unknown as Board, 'PLAYING_O'),
        { type: 'PLAY_CELL', index: final },
      );
      expect(result.status).toBe('WON_O');
    }
  });

  test('AC-US2-DOMINIO-005 resuelve DRAW en la novena jugada sin línea ganadora', () => {
    const drawBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null] as const;
    expect(
      gameReducer(stateWithEmptyHistory(drawBoard, 'PLAYING_X'), { type: 'PLAY_CELL', index: 8 }).status,
    ).toBe('DRAW');

    const winningNinth = ['X', 'O', 'O', 'O', 'X', 'X', 'X', 'X', null] as const;
    expect(
      gameReducer(stateWithEmptyHistory(winningNinth, 'PLAYING_X'), { type: 'PLAY_CELL', index: 8 }).status,
    ).toBe('WON_X');
  });

  test('AC-US2-UNWANTED-007 conserva el tablero en estados terminales', () => {
    const board = [null, 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O'] as const;
    for (const status of ['WON_X', 'WON_O', 'DRAW'] as const) {
      expect(gameReducer(stateWithEmptyHistory(board, status), { type: 'PLAY_CELL', index: 0 }).board).toEqual(board);
    }
  });

  test('AC-US2-UNWANTED-008 conserva el estado terminal vigente', () => {
    const board = [null, 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O'] as const;
    for (const status of ['WON_X', 'WON_O', 'DRAW'] as const) {
      expect(gameReducer(stateWithEmptyHistory(board, status), { type: 'PLAY_CELL', index: 0 }).status).toBe(status);
    }
  });
});

describe('reinicio', () => {
  const markedBoard = ['X', 'O', 'X', null, null, null, null, null, null] as const;
  const statuses = ['PLAYING_X', 'PLAYING_O', 'WON_X', 'WON_O', 'DRAW'] as const;

  test('AC-US3-ESTADO-002 vacía las nueve celdas al reiniciar', () => {
    for (const status of statuses) {
      expect(gameReducer(stateWithEmptyHistory(markedBoard, status), { type: 'RESET' }).board).toEqual(Array(9).fill(null));
    }
  });

  test('AC-US3-ESTADO-003 vuelve a PLAYING_X al reiniciar', () => {
    for (const status of statuses) {
      expect(gameReducer(stateWithEmptyHistory(markedBoard, status), { type: 'RESET' }).status).toBe('PLAYING_X');
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

describe('historial de jugadas legales', () => {
  test('AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal', () => {
    const result = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });

    expect(result.history).toHaveLength(1);
    expect(result.history[0]).toEqual({
      board: INITIAL_STATE.board,
      status: INITIAL_STATE.status,
    });
  });

  test('AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada', () => {
    const afterLegalMove = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    const afterRejectedMove = gameReducer(afterLegalMove, { type: 'PLAY_CELL', index: 0 });

    expect(afterRejectedMove).toBe(afterLegalMove);
    expect(afterRejectedMove.history).toHaveLength(1);
  });

  test('AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal', () => {
    const terminalState = [0, 3, 1, 4, 2].reduce(
      (state, index) => gameReducer(state, { type: 'PLAY_CELL', index }),
      INITIAL_STATE,
    );
    const afterRejectedMove = gameReducer(terminalState, { type: 'PLAY_CELL', index: 5 });

    expect(terminalState.status).toBe('WON_X');
    expect(afterRejectedMove).toBe(terminalState);
    expect(afterRejectedMove.history).toHaveLength(5);
  });
});

describe('restauración de una jugada', () => {
  test('AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    const afterO = gameReducer(afterX, { type: 'PLAY_CELL', index: 1 });

    expect(gameReducer(afterO, { type: 'UNDO' }).board).toEqual(afterX.board);
  });

  test('AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    const afterO = gameReducer(afterX, { type: 'PLAY_CELL', index: 1 });

    expect(gameReducer(afterO, { type: 'UNDO' }).status).toBe(afterX.status);
  });

  test('AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });

    expect(gameReducer(afterX, { type: 'UNDO' }).status).toBe('PLAYING_X');
  });

  test('AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    const afterO = gameReducer(afterX, { type: 'PLAY_CELL', index: 1 });
    const restored = gameReducer(afterO, { type: 'UNDO' });

    expect(restored.board.filter((cell) => cell !== null)).toHaveLength(1);
  });
});

describe('restauración desde estados terminales', () => {
  test('AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW', () => {
    const scenarios = [
      { moves: [0, 3, 1, 4, 2], terminal: 'WON_X', restored: 'PLAYING_X' },
      { moves: [0, 3, 1, 4, 8, 5], terminal: 'WON_O', restored: 'PLAYING_O' },
      { moves: [0, 1, 2, 4, 3, 5, 7, 6, 8], terminal: 'DRAW', restored: 'PLAYING_X' },
    ] as const;

    const results = scenarios.map((scenario) => {
      const terminalState = scenario.moves.reduce(
        (state, index) => gameReducer(state, { type: 'PLAY_CELL', index }),
        INITIAL_STATE,
      );

      return {
        terminal: terminalState.status,
        restored: gameReducer(terminalState, { type: 'UNDO' }).status,
      };
    });

    expect(results).toEqual(scenarios.map(({ terminal, restored }) => ({ terminal, restored })));
  });
});

describe('restauración repetida', () => {
  test('AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente', () => {
    const afterX = gameReducer(INITIAL_STATE, { type: 'PLAY_CELL', index: 0 });
    const afterO = gameReducer(afterX, { type: 'PLAY_CELL', index: 1 });
    const afterSecondX = gameReducer(afterO, { type: 'PLAY_CELL', index: 2 });

    const afterFirstUndo = gameReducer(afterSecondX, { type: 'UNDO' });
    const afterSecondUndo = gameReducer(afterFirstUndo, { type: 'UNDO' });

    expect(afterFirstUndo.board).toEqual(afterO.board);
    expect(afterSecondUndo.board).toEqual(afterX.board);
  });

  test('AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial', () => {
    const played = [0, 1, 2].reduce(
      (state, index) => gameReducer(state, { type: 'PLAY_CELL', index }),
      INITIAL_STATE,
    );
    const restored = [0, 1, 2].reduce(
      (state) => gameReducer(state, { type: 'UNDO' }),
      played,
    );

    expect(restored.board).toEqual(Array(9).fill(null));
  });

  test('AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío', () => {
    const restored = gameReducer(INITIAL_STATE, { type: 'UNDO' });

    expect(restored.board).toBe(INITIAL_STATE.board);
  });

  test('AC-US5-UNWANTED-013 conserva por separado el status con historial vacío', () => {
    const restored = gameReducer(INITIAL_STATE, { type: 'UNDO' });

    expect(restored.status).toBe(INITIAL_STATE.status);
  });

  test('AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío', () => {
    const restored = gameReducer(INITIAL_STATE, { type: 'UNDO' });

    expect(canUndo(restored)).toBe(false);
  });
});

describe('reinicio con historial', () => {
  const played = [0, 1, 2].reduce(
    (state, index) => gameReducer(state, { type: 'PLAY_CELL', index }),
    INITIAL_STATE,
  );

  test('AC-US5-RESET-018 RESET deja nueve celdas vacías', () => {
    expect(gameReducer(played, { type: 'RESET' }).board).toEqual(Array(9).fill(null));
  });

  test('AC-US5-RESET-019 RESET restaura PLAYING_X', () => {
    expect(gameReducer(played, { type: 'RESET' }).status).toBe('PLAYING_X');
  });

  test('AC-US5-RESET-020 RESET elimina historial y deja canUndo falso', () => {
    expect(canUndo(gameReducer(played, { type: 'RESET' }))).toBe(false);
  });
});
