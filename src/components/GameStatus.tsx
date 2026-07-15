import type { GameStatus as Status } from '../domain/game';

const STATUS_TEXT: Record<Status, string> = {
  PLAYING_X: 'Turno de X',
  PLAYING_O: 'Turno de O',
  WON_X: 'Ganó X',
  WON_O: 'Ganó O',
  DRAW: 'Empate',
};

interface GameStatusProps {
  readonly status: Status;
}

export function GameStatus({ status }: GameStatusProps) {
  return <p className="game-status">{STATUS_TEXT[status]}</p>;
}
