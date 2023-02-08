import { Cell } from '../core/mazeGen';
import { Dir } from "../core/direction";

interface CellViewProps {
    cell: Cell;
}
export function CellView(props: CellViewProps) {
    return <div className={"cell"}>

        {props.cell.wallDirs.map(dir => (
            <div
                key={dir}
                className={"wall " +
                    wallPresence(props.cell, dir) + " " + dir
                }>
            </div>
        ))
        }
        <div className="cellText">
            {props.cell.id}
            <br />
            {props.cell.pos.x}, {props.cell.pos.y}
        </div>
    </div >;
}


function wallPresence(cell: Cell, dir: Dir): string {
    return (cell.hasWall(dir)) ? "present" : "absent"
}