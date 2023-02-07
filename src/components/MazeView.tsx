import { useMemo } from 'react';
import { createMaze, Maze } from '../core/mazeGen';
import { CellView } from './CellView';


interface MazeViewProps {
    maze: Maze;
}
export function MazeView({ maze }: MazeViewProps) {

    const cellList = [];
    for (let gX = 0; gX < maze.width; gX++) {
        for (let gY = 0; gY < maze.width; gY++) {
            const cell = maze.get(gX, gY);
            if (!cell) {
                throw new Error(`no cell at ${gX}, ${gY}`);
            }
            cellList.push(<CellView {...{ gX, gY, cell }} />);
        }
    }
    return (
        <div className="mazeView">
            {cellList}
        </div>
    );
}


