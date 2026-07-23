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

  test('AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<UndoButton available onUndo={onUndo} />);

    await user.click(screen.getByRole('button', { name: 'Deshacer jugada' }));

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  test('AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<UndoButton available onUndo={onUndo} />);
    screen.getByRole('button', { name: 'Deshacer jugada' }).focus();

    await user.keyboard('{Enter}');

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  test('AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<UndoButton available onUndo={onUndo} />);
    screen.getByRole('button', { name: 'Deshacer jugada' }).focus();

    await user.keyboard(' ');

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  test('AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    const view = render(<UndoButton available onUndo={onUndo} />);
    const button = screen.getByRole('button', { name: 'Deshacer jugada' });
    button.focus();

    await user.keyboard('{Enter}');
    view.rerender(<UndoButton available={false} onUndo={onUndo} />);

    expect(screen.getByRole('button', { name: 'Deshacer jugada' })).toBe(button);
    expect(button).toHaveFocus();
  });
});
