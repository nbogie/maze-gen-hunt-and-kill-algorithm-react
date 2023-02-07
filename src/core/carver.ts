import { allDirs, Dir, directionAsOffset, PosOffset, reciprocalDir } from "./direction";
import { Maze, Cell, DirectedCell } from "./mazeGen";

export function carveMazeMutates(maze: Maze): void {
    //start location = choose starting location at random
    //while start location is not null
    //   while current cell has unvisited neighbours
    //      carve through to random unvisited neighbour
    //   start location = hunt for new start location matching criteria (else null)
    let location: Cell | null = maze.randomCell();
    const visitedCells = [];
    visitedCells.push(location);
    let counter = 0;
    while (location) {
        while (unvisitedNeighboursOf(location, maze, visitedCells).length > 0) {
            const unvis = unvisitedNeighboursOf(location, maze, visitedCells);
            const next = pick(unvis);
            carveFromToMutates(maze, location, next);
            location = next.cell;
            console.log("updating location to ", location)
            visitedCells.push(location);
        }
        counter++;
        location = huntForNewStart(maze, visitedCells);
        console.log("hunted up new location: ", location)
        if (counter > 10) {
            console.log("stopping due to overrun")
            return;
        }
    }
}
function huntForNewStart(maze: Maze, visitedCells: Cell[]): Cell | null {
    return maze.cells.find(c =>
        isUnvisited(visitedCells, c) &&
        isAdjactedToVisitedCell(c, visitedCells, maze)
    ) ?? null;
}

export function carveFromToMutates(maze: Maze, from: Cell, to: DirectedCell) {
    from.wallDirs = from.wallDirs.filter(wd => wd !== to.dir);
    to.cell.wallDirs = from.wallDirs.filter(wd => wd !== reciprocalDir(to.dir));
}

export function getNeighbourInDirection(maze: Maze, fromCell: Cell, direction: Dir): Cell | null {
    const offset: PosOffset = directionAsOffset(direction);
    console.log(offset)
    return maze.get(fromCell.pos.x + offset.x, fromCell.pos.y + offset.y);
}
/** Get all neighbours including the direction the lie in */
export function getAllNeighboursIncDirs(loc: Cell, maze: Maze) {
    return allDirs.map((dir) => {
        return { dir, cell: getNeighbourInDirection(maze, loc, dir) };
    }).filter(n => n.cell) as DirectedCell[];
}
export function unvisitedNeighboursOf(
    loc: Cell,
    maze: Maze,
    visitedCells: Cell[]
): DirectedCell[] {
    const nsWithDirs = getAllNeighboursIncDirs(loc, maze);
    console.log("Neighbours of ", loc, " are ", nsWithDirs.map(ns => ns.cell.id))
    return nsWithDirs.filter((nWithDir) => nWithDir.cell && isUnvisited(visitedCells, nWithDir.cell)) as DirectedCell[];
}

function isUnvisited(visitedCells: Cell[], soughtCell: Cell): boolean {
    return !visitedCells.find(vc => vc.id === soughtCell.id)
}

export function pick<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Tried to pick() from empty array');
    }
    return arr[Math.floor(Math.random() * arr.length)];
}
function isAdjactedToVisitedCell(c: Cell, visitedCells: Cell[], maze: Maze): boolean {
    const neighbourCells = getAllNeighboursIncDirs(c, maze).map(v => v.cell);
    return neighbourCells.some(nc => visitedCells.find(vc => vc.id === nc.id));
}

