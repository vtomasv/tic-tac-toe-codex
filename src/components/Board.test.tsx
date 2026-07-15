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

  test('AC-US4-A11Y-009 expone fila columna y contenido en el nombre de cada celda', () => {
    const board = ['X', 'O', null, null, null, null, null, null, null] as const;
    render(<Board board={board} status="PLAYING_X" onCellActivate={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, X' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fila 1, columna 2, O' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fila 1, columna 3, vacía' })).toBeInTheDocument();
  });

  test('AC-US4-VISUAL-017 muestra un contorno al apuntar una celda vacía', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, vacía' })).toHaveClass('cell--playable');
  });

  test('AC-US4-A11Y-020 expone las celdas como no disponibles en estados terminales', () => {
    const emptyBoard = [null, null, null, null, null, null, null, null, null] as const;
    for (const status of ['WON_X', 'WON_O', 'DRAW'] as const) {
      const view = render(<Board board={emptyBoard} status={status} onCellActivate={() => undefined} />);
      for (const cell of screen.getAllByRole('button')) {
        expect(cell).toHaveAttribute('aria-disabled', 'true');
      }
      view.unmount();
    }
  });

  test('AC-US1-INTERACCION-003 coloca la marca del jugador del turno en una celda vacía', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Fila 1, columna 1, vacía' }));
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, X' })).toHaveTextContent('X');
  });

  test('AC-US4-INTERACCION-001 activa una celda vacía mediante clic', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Fila 1, columna 1, vacía' }));
    expect(screen.getByRole('button', { name: 'Fila 1, columna 1, X' })).toBeInTheDocument();
  });
});
