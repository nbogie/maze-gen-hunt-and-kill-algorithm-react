import { useMemo, useState } from 'react'
import { Maze, createMaze } from '../core/mazeGen';
import { carveMaze } from "../core/carver";
import { MazeView } from './MazeView'

function App() {
  const [maze, setMaze] = useState<Maze>(() => createMaze(5, 5));

  function handleCarveRandom() {
    const mazeCopy = { ...maze };//not good enough - shallow
    carveMaze(mazeCopy)
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

