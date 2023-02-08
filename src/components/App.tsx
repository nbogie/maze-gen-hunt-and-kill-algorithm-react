import { useState } from 'react';
import { carveMazeMutates } from "../core/carver";
import { createMaze, Maze } from '../core/mazeGen';
import { MazeView } from './MazeView';

function App() {
  const [maze, setMaze] = useState<Maze>(() => createMaze(8));

  function handleCarveRandom() {
    //TODO: shallow copy is not good enough.  Some maintained cells will be mutated.
    const mazeCopy = { ...maze };
    carveMazeMutates(mazeCopy)
    setMaze(mazeCopy)
  }

  return (
    <div className="App">
      <MazeView maze={maze} />
      <button onClick={handleCarveRandom}>Carve!</button>
      <a href="https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm">Based on original article by Jamis Buck</a>
    </div>
  )
}

export default App

