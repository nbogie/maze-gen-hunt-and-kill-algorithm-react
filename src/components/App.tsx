import { useState } from 'react';
import { carveMazeMutates } from "../core/carver";
import { createMaze, Maze } from '../core/mazeGen';
import { MazeView } from './MazeView';

function App() {
  const [maze, setMaze] = useState<Maze>(() => createMaze(5, 5));

  function handleCarveRandom() {
    const mazeCopy = { ...maze };//not good enough - shallow
    carveMazeMutates(mazeCopy)
    setMaze(mazeCopy)
  }

  return (
    <div className="App">
      <MazeView maze={maze} />
      <button onClick={handleCarveRandom}>CarveRandom</button>
    </div>
  )
}

export default App

