type MyDir = "N" | "S" | "E" | "W";
interface MyCell {
    id: number;
    wallDirs: MyDir[]; // in hindsight this should have been marked readonly
    hasWall: (dir: MyDir) => boolean;
}
export function demonstrateSubtleBug(): void {
    {
        //bad way of creating cell will mean its hasWall method only works correctly if we don't carve using reassignment of the wallDirs property
        const cell1 = badCreateCell(1);
        carveEastWallWithReassignment(cell1);
        const cell2 = okCreateCell(2);
        carveEastWallWithReassignment(cell2);
        runTestsOnCell(cell1);
        runTestsOnCell(cell2);
    }
    {
        //If we carve with mutation it doesn't matter how we create the cell - the aliasing will be maintained
        const cell1 = badCreateCell(1);
        carveEastWallWithMutation(cell1);
        const cell2 = okCreateCell(2);
        carveEastWallWithMutation(cell2);
        runTestsOnCell(cell1);
        runTestsOnCell(cell2);
    }

    function runTestsOnCell(fromCell: MyCell) {
        const direction = "E";

        //Note we'll get two different answers, right after carving
        //Ask the cell using its method - it thinks there's 4 walls (the original walls?)
        const answerFromMethod = fromCell.hasWall(direction);

        //interrogate the cell's data more directly without the method (will correctly reflect that some walls have been removed):
        const wallDirsProperty = fromCell.wallDirs;
        const answerWhenAvoidingMethod = wallDirsProperty.includes(direction);
        console.log({
            answerFromMethod,
            answerWhenAvoidingMethod,
            wallDirsProperty,
        });
    }
}

//This version leads to a bug.  (the enclosed wallDirs and the object's wallDirs property are one and the same reference here INITIALLY, but we may this aliasing during carving by reassigning to the object's wallDirs property - it's not readonly!)

function badCreateCell(id: number) {
    const wallDirs: MyDir[] = ["N", "E", "S", "W"];
    return {
        id,
        wallDirs,
        hasWall: function (dir: MyDir) {
            return wallDirs.includes(dir);
        },
    };
}

//This is the fix.  the hasWall function references the object's own wallDirs property, not the original wallDirs, so it doesn't matter if they've drifted.
function okCreateCell(id: number) {
    const initialWallDirs: MyDir[] = ["N", "E", "S", "W"];
    return {
        id,
        wallDirs: initialWallDirs,
        hasWall: function (dir: MyDir) {
            return this.wallDirs.includes(dir);
        },
    };
}

function carveEastWallWithReassignment(cell: MyCell): void {
    //problems arise when we reassign the property, rather than mutate it, if the cell has been created with badCreateCell
    cell.wallDirs = ["N", "S", "W"];
}

function carveEastWallWithMutation(cell: MyCell): void {
    const ix = cell.wallDirs.findIndex((w) => w === "E");
    if (ix === -1) {
        throw new Error("expected to find E wall");
    }
    cell.wallDirs.splice(ix, 1);
}

demonstrateSubtleBug();
