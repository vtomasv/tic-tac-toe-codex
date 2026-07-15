import { useReducer } from 'react';

import { Board } from './components/Board';
import { gameReducer, INITIAL_STATE, type GameState } from './domain/game';

interface AppProps {
  readonly initialState?: GameState;
}

export default function App({ initialState = INITIAL_STATE }: AppProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <main className="game">
      <h1>Tres en Raya</h1>
      <Board
        board={state.board}
        status={state.status}
        onCellActivate={(index) => dispatch({ type: 'PLAY_CELL', index })}
      />
      <button className="restart" type="button">
        Reiniciar partida
      </button>
    </main>
  );
}
