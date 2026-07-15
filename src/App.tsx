import { useReducer, useRef, useState } from 'react';

import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { gameReducer, INITIAL_STATE, type GameState } from './domain/game';

interface AppProps {
  readonly initialState?: GameState;
}

export default function App({ initialState = INITIAL_STATE }: AppProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [announcementRevision, setAnnouncementRevision] = useState(0);
  const firstCellRef = useRef<HTMLButtonElement>(null);

  const restart = () => {
    dispatch({ type: 'RESET' });
    setAnnouncementRevision((revision) => revision + 1);
    firstCellRef.current?.focus();
  };

  return (
    <main className="game">
      <h1>Tres en Raya</h1>
      <GameStatus key={state.status + '-' + announcementRevision} status={state.status} />
      <Board
        board={state.board}
        firstCellRef={firstCellRef}
        status={state.status}
        onCellActivate={(index) => dispatch({ type: 'PLAY_CELL', index })}
      />
      <button className="restart" onClick={restart} type="button">
        Reiniciar partida
      </button>
    </main>
  );
}
