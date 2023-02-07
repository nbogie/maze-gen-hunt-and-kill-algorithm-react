import { expect, test } from "vitest";
import { getAllNeighboursWithTheirDirs } from "./carver";
import { createMaze } from "./mazeGen";
test("", () => {
    const maze = createMaze(5, 5);
    const mainCell = maze.get(4, 3);
    expect(mainCell).toBeTruthy();
    expect(mainCell?.id).toEqual(20)
    expect(mainCell?.pos).toEqual({ x: 4, y: 3 })
    const neighbourCells = getAllNeighboursWithTheirDirs(mainCell!, maze).map(ns => ns.cell)
    expect(
        new Set(neighbourCells.map(cell => cell.id)))
        .toEqual(new Set([15, 19, 25]));

})
