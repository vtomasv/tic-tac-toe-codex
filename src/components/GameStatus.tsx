import type { GameStatus as Status } from '../domain/game';

const STATUS_TEXT: Record<Status, string> = {
  PLAYING_X: 'Turno de X',
  PLAYING_O: 'Turno de O',
  WON_X: 'Ganó X',
  WON_O: 'Ganó O',
  DRAW: 'Empate',
};

type GameStatusProps = Readonly<{
  status: Status;
  announcement?: string;
}>;

export function GameStatus({ status, announcement }: GameStatusProps) {
  return (
    <p aria-atomic="true" aria-live="polite" className="game-status" role="status">
      {announcement ?? STATUS_TEXT[status]}
    </p>
  );
}
