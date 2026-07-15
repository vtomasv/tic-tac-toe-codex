import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import App from '../App';
import { Board } from './Board';

describe('tablero de Tres en Raya', () => {
  test('AC-US1-DOMINIO-002 presenta una cuadrícula de tres por tres', () => {
    render(<App />);
    const grid = screen.getByRole('grid', { name: 'Tablero de Tres en Raya' });
    expect(within(grid).getAllByRole('row')).toHaveLength(3);
    expect(within(grid).getAllByRole('button')).toHaveLength(9);
  });
});
