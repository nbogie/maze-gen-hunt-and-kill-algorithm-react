import { PathfindingResult } from "../core/graph";
import { Maze } from "../core/maze";
import { CellView } from "./CellView";

interface MazeViewProps {
    maze: Maze;
    pathfindingResult: PathfindingResult;
    onCellClick: (cellId: number) => void;
}
export function MazeView({
    maze,
    pathfindingResult,
    onCellClick,
}: MazeViewProps) {
    //This, to tell css grid how many rows and cols.  Probably possible in pure css.
    const styleWithVar = {
        "--numColumnsInGrid": maze.width,
    } as React.CSSProperties;
    return (
        <div className="mazeView" style={styleWithVar}>
            {maze.cells.map((cell) => (
                <CellView
                    key={cell.id}
                    cell={cell}
                    pathfindingResult={pathfindingResult}
                    onClick={onCellClick}
                />
            ))}
        </div>
    );
}
