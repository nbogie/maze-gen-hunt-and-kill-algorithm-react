import {
    getAllNeighboursWithTheirDirs,
    getAllNeighboursWithTheirDirsIfNoWall,
} from "./carver";
import { Dir } from "./direction";
import { AdjacencyList } from "./graph";

export interface Maze {
    get(x: number, y: number): Cell | null;
    width: number;
    height: number;
    cells: Cell[];
}

export interface DirectedCell {
    cell: Cell;
    dir: Dir;
}

export interface Point {
    x: number;
    y: number;
}

export interface Cell {
    id: number;
    pos: Point;
    wallDirs: Dir[];
    hasWall: (dir: Dir) => boolean;
}

export function createCell(id: number, x: number, y: number): Cell {
    return {
        id,
        pos: { x, y },
        wallDirs: ["N", "E", "S", "W"],
        hasWall: function (dir: Dir) {
            return this.wallDirs.includes(dir);
        },
    };
}

export function createMaze(numCellsPerSide: number): Maze {
    const h: number = numCellsPerSide;
    const w: number = numCellsPerSide;
    const cells: Cell[] = [];

    //populate cells
    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            const id = 1 + (w * row + col);
            const cell = createCell(id, col, row);
            cells.push(cell);
        }
    }

    function get(x: number, y: number): Cell | null {
        if (x < 0 || x >= w || y < 0 || y >= h) {
            return null;
        }
        return cells[y * w + x];
    }

    const maze: Maze = {
        width: w,
        height: h,
        cells,
        get,
    };

    return maze;
}

export function buildAdjacencyList(maze: Maze): AdjacencyList {
    const allCells = maze.cells;
    const adjacencyList: [number, number[]][] = allCells.map((cell) => [
        cell.id,
        getAllNeighboursWithTheirDirsIfNoWall(cell, maze).map((v) => v.cell.id),
    ]);
    return Object.fromEntries(adjacencyList);
}
