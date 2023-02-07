import { reciprocalDir, offsetsLookup } from "./direction";
import { Maze, Cell, DirectedCell } from "./mazeGen";

export function carveFromTo(maze: Maze, from: Cell, to: DirectedCell) {
    from.wallDirs = from.wallDirs.filter(wd => wd !== to.dir);
    to.cell.wallDirs = from.wallDirs.filter(wd => wd !== reciprocalDir(to.dir));
}
export function carveMaze(maze: Maze): void {
    //start location = choose starting location at random
    //while start location is not null
    //   while current cell has unvisited neighbours
    //      carve through to random unvisited neighbour
    //   start location = hunt for new start location matching criteria (else null)
    let location: Cell | null = maze.randomCell();
    const visitedCells = [];
    visitedCells.push(location);
    while (location) {
        while (unvisitedNeighboursOf(location, maze, visitedCells).length > 0) {
            const unvis = unvisitedNeighboursOf(location, maze, visitedCells);
            const next = pick(unvis);
            carveFromTo(maze, location, next);
            location = next.cell;
            visitedCells.push(location);
        }
        location = null; // huntForNewStart(maze);
    }
}

export function unvisitedNeighboursOf(
    loc: Cell,
    maze: Maze,
    visitedCells: Cell[]
): DirectedCell[] {
    const allDirs = ['N', 'E', 'S', 'W'];
    const nsWithDirs = allDirs.map((dir) => {
        const offset = offsetsLookup[dir];
        return {
            dir,
            cell: maze.get(loc.pos.x + offset[0], loc.pos.y + offset[1]),
        };
    });

    return nsWithDirs.filter((nWithDir) => nWithDir.cell && !visitedCells.includes(nWithDir.cell)) as DirectedCell[];
}

export function pick<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Tried to pick() from empty array');
    }
    return arr[Math.floor(Math.random() * arr.length)];
}
