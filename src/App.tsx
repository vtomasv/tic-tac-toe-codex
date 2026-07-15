import { useReducer, useRef } from 'react';

import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { gameReducer, INITIAL_STATE, type GameState } from './domain/game';

interface AppProps {
  readonly initialState?: GameState;
}

export default function App({ initialState = INITIAL_STATE }: AppProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const firstCellRef = useRef<HTMLButtonElement>(null);

  const restart = () => {
    dispatch({ type: 'RESET' });
    firstCellRef.current?.focus();
  };

  return (
    <main className="game">
      <h1>Tres en Raya</h1>
      <GameStatus status={state.status} />
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
