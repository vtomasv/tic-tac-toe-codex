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

  test('AC-US4-TECLADO-005 ordena el foco por filas y después por reinicio', async () => {
    const user = userEvent.setup();
    render(<App />);
    for (let index = 0; index < 9; index += 1) {
      await user.tab();
      const row = Math.floor(index / 3) + 1;
      const column = (index % 3) + 1;
      expect(screen.getByRole('button', { name: `Fila ${row}, columna ${column}, vacía` })).toHaveFocus();
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'Reiniciar partida' })).toHaveFocus();
  });

  test('AC-US4-FOCO-006 muestra un contorno continuo en el control enfocado', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, vacía' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, vacía' })).toHaveClass('cell');
  });

  test('AC-US4-A11Y-008 expone el tablero como cuadrícula de tres por tres', () => {
    render(<App />);
    const grid = screen.getByRole('grid', { name: 'Tablero de Tres en Raya' });
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '3');
  });
});
