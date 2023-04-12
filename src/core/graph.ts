export type GraphNode = { id: number };

export type AdjacencyList = { [key: number]: number[] };
const adjacencyList: AdjacencyList = {};

function connectionsFrom<T extends GraphNode>(node: T): T[] {
    return [];
}
