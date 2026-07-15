import { useReducer } from 'react';

import { Board } from './components/Board';
import { INITIAL_STATE, type GameState } from './domain/game';

interface AppProps {
  readonly initialState?: GameState;
}

function staticReducer(state: GameState): GameState {
  return state;
}

export default function App({ initialState = INITIAL_STATE }: AppProps) {
  const [state] = useReducer(staticReducer, initialState);

  return (
    <main className="game">
      <h1>Tres en Raya</h1>
      <Board board={state.board} status={state.status} onCellActivate={() => undefined} />
      <button className="restart" type="button">
        Reiniciar partida
      </button>
    </main>
  );
}
