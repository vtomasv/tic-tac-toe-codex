import type { Ref } from 'react';

import type { Board as BoardState, GameStatus } from '../domain/game';

interface BoardProps {
  readonly board: BoardState;
  readonly status: GameStatus;
  readonly onCellActivate: (index: number) => void;
  readonly firstCellRef?: Ref<HTMLButtonElement>;
}

const isTerminal = (status: GameStatus): boolean =>
  status === 'WON_X' || status === 'WON_O' || status === 'DRAW';

export function Board({ board, status, onCellActivate, firstCellRef }: BoardProps) {
  return (
    <div
      aria-colcount={3}
      aria-label="Tablero de Tres en Raya"
      aria-rowcount={3}
      className="board"
      role="grid"
    >
      {[0, 1, 2].map((row) => (
        <div className="board__row" role="row" key={row}>
          {[0, 1, 2].map((column) => {
            const index = row * 3 + column;
            const content = board[index];
            const unavailable = content !== null || isTerminal(status);
            const label = `Fila ${row + 1}, columna ${column + 1}, ${content ?? 'vacía'}`;
            return (
              <div role="gridcell" key={index}>
                <button
                  aria-disabled={unavailable ? 'true' : undefined}
                  aria-label={label}
                  className={`cell${unavailable ? '' : ' cell--playable'}`}
                  onClick={() => {
                    if (!unavailable) {
                      onCellActivate(index);
                    }
                  }}
                  ref={index === 0 ? firstCellRef : undefined}
                  type="button"
                >
                  {content}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
