import { Maze } from '../core/maze';
import { CellView } from './CellView';


interface MazeViewProps {
    maze: Maze;
}
export function MazeView({ maze }: MazeViewProps) {

    //This, to tell css grid how many rows and cols.  Probably possible in pure css.
    const styleWithVar = { "--numColumnsInGrid": maze.width } as React.CSSProperties;
    return (
        <div className="mazeView" style={styleWithVar}>
            {
                maze.cells.map(
                    cell => <CellView key={cell.id} cell={cell} />
                )
            }
        </div>
    );
}


