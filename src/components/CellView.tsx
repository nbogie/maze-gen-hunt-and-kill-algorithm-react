import { Cell } from "../core/maze";
import { Dir } from "../core/direction";
import { PathfindingResult } from "../core/graph";
import Color from "color";
interface CellViewProps {
    cell: Cell;
    pathfindingResult: PathfindingResult;
    onClick: (cellId: number) => void;
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
    return arg !== null;
}

export function CellView(props: CellViewProps) {
    const cellColour = calcCellColourByDistance(
        props.cell.id,
        props.pathfindingResult
    );

    return (
        <div
            className={"cell"}
            style={cellColour ? { backgroundColor: cellColour.hex() } : {}}
            onClick={() => props.onClick(props.cell.id)}
        >
            {props.cell.wallDirs.map((dir) => (
                <div
                    key={dir}
                    className={
                        "wall " + wallPresence(props.cell, dir) + " " + dir
                    }
                ></div>
            ))}
            <div className="cellAnnotations">
                <div className="cellId">{props.cell.id}</div>
                <div className="cellPos">
                    {props.cell.pos.x}, {props.cell.pos.y}
                </div>
                <div className="cellDist">
                    {props.pathfindingResult.dists[props.cell.id]}
                </div>
            </div>
        </div>
    );
}

function calcCellColourByDistance(
    cellId: number,
    pathfindingResult: PathfindingResult
): Color | null {
    const maxDist = Math.max(...pathfindingResult.dists.filter(isNotNull));
    if (maxDist === 0) return null;

    const colorRed = Color({ r: 255, g: 0, b: 0 });
    const colorGreen = Color({ r: 0, g: 255, b: 0 });
    const dist = pathfindingResult.dists[cellId] ?? 0;
    const cellColour = colorGreen.mix(colorRed, dist / maxDist);
    return cellColour;
}

function wallPresence(cell: Cell, dir: Dir): string {
    return cell.hasWall(dir) ? "present" : "absent";
}
