import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { GameStatus } from './GameStatus';

describe('GameStatus', () => {
  test('AC-US5-A11Y-029 acepta anuncio exacto Jugada deshecha Turno de X', () => {
    render(<GameStatus status="PLAYING_X" announcement="Jugada deshecha. Turno de X" />);

    expect(screen.getByRole('status')).toHaveTextContent(/^Jugada deshecha\. Turno de X$/);
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  test('AC-US5-A11Y-030 acepta anuncio exacto Jugada deshecha Turno de O', () => {
    render(<GameStatus status="PLAYING_O" announcement="Jugada deshecha. Turno de O" />);

    expect(screen.getByRole('status')).toHaveTextContent(/^Jugada deshecha\. Turno de O$/);
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});
