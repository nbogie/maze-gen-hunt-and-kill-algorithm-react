type GraphNode = { id: number };

type AdjacencyList = { [key: number]: number[] };
const adjacencyList: AdjacencyList = {};

function connectionsFrom<T extends GraphNode>(node: T): T[] {
    return [];
}
