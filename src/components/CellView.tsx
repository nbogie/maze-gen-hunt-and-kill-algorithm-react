import { Cell } from '../core/mazeGen';
import { Dir } from "../core/direction";

interface CellViewProps {
    gX: number;
    gY: number;
    cell: Cell;
}
export function CellView(props: CellViewProps) {
    return <div className={"cell"}>
        {props.cell.wallDirs.map(dir => (
            <div className={"wall " +
                wallPresence(props.cell, dir) + " " + dir
            }>
            </div>
        ))
        }
        cell
    </div >;
}


function wallPresence(cell: Cell, dir: Dir): string {
    return (cell.hasWall(dir)) ? "present" : "absent"
}