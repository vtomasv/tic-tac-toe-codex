import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import App from '../App';
import { Board } from './Board';
import type { GameStatus } from '../domain/game';

describe('tablero de Tres en Raya', () => {
  test('AC-US1-DOMINIO-002 presenta una cuadrícula de tres por tres', () => {
    render(<App />);
    const grid = screen.getByRole('grid', { name: 'Tablero de Tres en Raya' });
    expect(within(grid).getAllByRole('row')).toHaveLength(3);
    expect(within(grid).getAllByRole('button')).toHaveLength(9);
  });

  test('AC-US3-INTERACCION-001 presenta Reiniciar partida en todos los estados', () => {
    const statuses: GameStatus[] = ['PLAYING_X', 'PLAYING_O', 'WON_X', 'WON_O', 'DRAW'];
    const emptyBoard = [null, null, null, null, null, null, null, null, null] as const;
    for (const status of statuses) {
      const view = render(<App initialState={{ board: emptyBoard, status }} />);
      expect(screen.getByRole('button', { name: 'Reiniciar partida' })).toBeInTheDocument();
      view.unmount();
    }
  });
});
