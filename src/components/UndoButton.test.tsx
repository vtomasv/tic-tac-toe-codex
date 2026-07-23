import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { UndoButton } from './UndoButton';

describe('UndoButton', () => {
  test('AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true', () => {
    render(<UndoButton available onUndo={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Deshacer jugada' })).not.toHaveAttribute(
      'aria-disabled',
    );
    expect(screen.queryByText('No disponible')).not.toBeInTheDocument();
  });

  test('AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<UndoButton available={false} onUndo={onUndo} />);

    const button = screen.getByRole('button', { name: 'Deshacer jugada' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await user.click(button);
    expect(onUndo).not.toHaveBeenCalled();
  });

  test('AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada', () => {
    render(<UndoButton available={false} onUndo={() => undefined} />);

    const button = screen.getByRole('button', { name: 'Deshacer jugada' });
    expect(button).toHaveTextContent(/^Deshacer jugada$/);
  });

  test('AC-US5-VISUAL-034 comunica No disponible sin depender solo del color', () => {
    render(<UndoButton available={false} onUndo={() => undefined} />);

    expect(screen.getByText('No disponible')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Deshacer jugada' })).toBeInTheDocument();
  });
});
