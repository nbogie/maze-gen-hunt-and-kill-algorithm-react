import { allDirs, Dir, directionAsOffset, PosOffset, reciprocalDir } from "./direction";
import { Maze, Cell, DirectedCell } from "./maze";

export function carveMazeMutates(maze: Maze): void {
    //start location = choose starting location at random

    //while start location is not null
    //   while current cell has unvisited neighbours
    //      carve through to random unvisited neighbour
    //
    //   start location = hunt for new start location matching criteria (else null)
    //   if new start location
    //      connect up new start location to an adjacent explored cell

    let location: Cell | null = pick(maze.cells);
    const visitedCells: Cell[] = [];

    while (location !== null) {
        randomWalkCarvingMutates(visitedCells, location, maze);
        location = huntAndConnectToExistingMutates(visitedCells, maze);
    }
}

function huntAndConnectToExistingMutates(visitedCells: Cell[], maze: Maze) {
    const location = huntForNewStart(maze, visitedCells);

    if (location) {
        //Carve to connect new start location to an adjacent *visited* cell
        const possibleConnectionCells = visitedNeighboursOf(location, maze, visitedCells);
        carveFromToMutates(maze, location, pick(possibleConnectionCells));
    }
    return location;
}

function randomWalkCarvingMutates(visitedCells: Cell[], location: Cell, maze: Maze): Cell {
    visitedCells.push(location);
    while (unvisitedNeighboursOf(location, maze, visitedCells).length > 0) {
        const unvis = unvisitedNeighboursOf(location, maze, visitedCells);
        const next = pick(unvis);
        carveFromToMutates(maze, location, next);
        location = next.cell;
        visitedCells.push(location);
    }
    return location;
}

export function carveFromToMutates(maze: Maze, from: Cell, to: DirectedCell) {
    from.wallDirs = from.wallDirs.filter(wd => wd !== to.dir);
    to.cell.wallDirs = to.cell.wallDirs.filter(wd => wd !== reciprocalDir(to.dir));
}

function huntForNewStart(maze: Maze, visitedCells: Cell[]): Cell | null {
    return maze.cells.find(c =>
        isUnvisited(visitedCells, c) &&
        isAdjactedToVisitedCell(c, visitedCells, maze)
    ) ?? null;
}

export function getNeighbourInDirection(maze: Maze, fromCell: Cell, direction: Dir): Cell | null {
    const offset: PosOffset = directionAsOffset(direction);
    return maze.get(fromCell.pos.x + offset.x, fromCell.pos.y + offset.y);
}

/** Get all neighbours, including the direction the lie in */
export function getAllNeighboursWithTheirDirs(loc: Cell, maze: Maze): DirectedCell[] {
    return (allDirs
        .map((dir) => ({ dir, cell: getNeighbourInDirection(maze, loc, dir) }))
        .filter(n => n.cell) as DirectedCell[]
    );
}

export function unvisitedNeighboursOf(loc: Cell, maze: Maze, visitedCells: Cell[]): DirectedCell[] {
    return getAllNeighboursWithTheirDirs(loc, maze)
        .filter((nWithDir) => isUnvisited(visitedCells, nWithDir.cell));
}

export function visitedNeighboursOf(loc: Cell, maze: Maze, visitedCells: Cell[]): DirectedCell[] {
    return getAllNeighboursWithTheirDirs(loc, maze)
        .filter((nWithDir) => isVisited(visitedCells, nWithDir.cell));
}

function isVisited(visitedCells: Cell[], soughtCell: Cell): boolean {
    return !!visitedCells.find(vc => vc.id === soughtCell.id)
}

function isUnvisited(visitedCells: Cell[], soughtCell: Cell): boolean {
    return !isVisited(visitedCells, soughtCell);
}

function isAdjactedToVisitedCell(c: Cell, visitedCells: Cell[], maze: Maze): boolean {
    const neighbourCells = getAllNeighboursWithTheirDirs(c, maze).map(v => v.cell);
    return neighbourCells.some(nc => visitedCells.find(vc => vc.id === nc.id));
}

export function pick<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Tried to pick() from empty array');
    }
    return arr[Math.floor(Math.random() * arr.length)];
}