
export const allDirs = ['N', 'E', 'S', 'W'] as const;

export type Dir = typeof allDirs[number];

const offsetsLookup: { [key: string]: PosOffset } = {
    E: { x: 1, y: 0 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
    N: { x: 0, y: -1 },
};

export type PosOffset = { x: 0 | 1 | -1, y: 0 | 1 | -1 }
export function directionAsOffset(dir: Dir): PosOffset {

    return offsetsLookup[dir];
}


export function reciprocalDir(dir: Dir) {
    const recipLookup: Record<Dir, Dir> = {
        'N': 'S',
        'E': 'W',
        'S': 'N',
        'W': 'E'
    }

    return recipLookup[dir];
}
