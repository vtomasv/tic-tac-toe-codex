import { describe, expect, test } from 'vitest';

import { INITIAL_STATE } from './game';

describe('estado inicial', () => {
  test('AC-US1-ESTADO-001 inicia en PLAYING_X', () => {
    expect(INITIAL_STATE.status).toBe('PLAYING_X');
  });
});
