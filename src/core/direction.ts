
export type Dir = 'N' | 'E' | 'S' | 'W';
export const offsetsLookup: { [key: string]: [0 | 1 | -1, 0 | 1 | -1]; } = {
    E: [1, 0],
    S: [0, 1],
    W: [-1, 0],
    N: [0, -1],
};
export function reciprocalDir(dir: string) {
    return {
        'N': 'S', 'E': 'W', 'S': 'N', 'W': 'E'
    }[dir];
}
