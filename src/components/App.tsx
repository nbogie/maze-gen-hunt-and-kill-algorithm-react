import { useMemo, useState } from "react";
import { carveMazeMutates } from "../core/carver";
import { PathfindingResult, findShortestPaths } from "../core/graph";
import { Maze, buildAdjacencyList, createMaze } from "../core/maze";
import { MazeView } from "./MazeView";

function App() {
    const [gridSize, setGridSize] = useState<number>(8);
    const [maze, setMaze] = useState<Maze>(() => createMaze(gridSize));
    const adjacencyList = useMemo(() => buildAdjacencyList(maze), [maze]);
    const [startNodeId, setStartNodeId] = useState(1);
    const pathfindingResult: PathfindingResult = useMemo(
        () => findShortestPaths(startNodeId, adjacencyList),
        [startNodeId, adjacencyList]
    );

    function handleCarve() {
        //TODO: shallow copy is not good enough.  Some maintained cells will be mutated.
        const mazeCopy = { ...maze };
        carveMazeMutates(mazeCopy);
        setMaze(mazeCopy);
    }

    function handleReset(newGridSize: number | null = null) {
        setMaze(createMaze(newGridSize ?? gridSize));
    }

    function handleChangeGridSize(newGridSize: number): void {
        setGridSize(newGridSize);
        handleReset(newGridSize);
    }

    function handleCellClick(cellId: number): void {
        setStartNodeId(cellId);
    }

    return (
        <div className="App">
            <div className="controls">
                <button onClick={handleCarve}>Carve!</button>

                <button onClick={(e) => handleReset()}>Reset!</button>
                <input
                    type="number"
                    min={3}
                    max={16}
                    value={gridSize}
                    onChange={(e) =>
                        handleChangeGridSize(parseInt(e.target.value))
                    }
                />
                <a href="https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm">
                    Based on original article by Jamis Buck
                </a>
            </div>
            <MazeView
                maze={maze}
                pathfindingResult={pathfindingResult}
                onCellClick={handleCellClick}
            />
        </div>
    );
}

export default App;
