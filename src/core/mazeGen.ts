import { Dir } from "./direction";

export interface Maze {
    get(x: number, y: number): Cell | null;
    width: number;
    height: number;
    cells: Cell[];
    randomCell: () => Cell;
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

export function createCell(id: number, x: number, y: number) {
    const wallDirs: Dir[] = ['N', 'E', 'S', 'W'];
    return {
        id,
        pos: { x, y },
        wallDirs,
        hasWall: function (dir: Dir) {
            return wallDirs.includes(dir);
        },
    };
}

export function createMaze(w: number, h: number): Maze {
    const cells: Cell[] = [];

    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            const id = 1 + (w * row + col);
            const cell = createCell(id, col, row);
            cells.push(cell);
        }
    }

    const maze: Maze = {
        width: w,
        height: h,
        cells,
        get: function (x, y) {
            if (x < 0 || x >= w || y < 0 || y >= h) {
                return null;
            }
            return cells[y * w + x];
        },
        randomCell: function () {
            const res = this.get(
                Math.floor(Math.random() * w),
                Math.floor(Math.random() * h)
            ) as Cell;
            console.assert(!!res, 'random cell should never be undefined');
            return res;
        },
    };
    return maze;
}

