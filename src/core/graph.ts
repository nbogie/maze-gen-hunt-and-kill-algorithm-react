export type AdjacencyList = { [key: number]: number[] };
export type NodeId = number;

function connectionsFrom(
    nodeId: NodeId,
    adjacencyList: AdjacencyList
): NodeId[] {
    return adjacencyList[nodeId];
}

export const demoGraph: AdjacencyList = {
    0: [1, 2],
    1: [3],
    2: [3],
    3: [4],
    4: [],
};

//TODO: this will go round in circles - it's not correctly dealing with cycles, yet.

export function findShortestPaths(
    startNodeId: NodeId,
    adjacencyList: AdjacencyList
): { prevs: (null | NodeId)[]; dists: (null | NodeId)[] } {
    const prevs: (NodeId | undefined)[] = [undefined];
    const dists: (NodeId | undefined)[] = [];
    dists[startNodeId] = 0;
    // debugger;
    console.log("findShortestPaths: ", { startNodeId, adjacencyList });
    const toVisit: { [nodeId: NodeId]: number } = {};
    toVisit[startNodeId] = 0;
    while (Object.keys(toVisit).length > 0) {
        //TODO: there are many large optimisations to use for this step
        const [currentNodeId, _unusedCostToCurrentNode]: [NodeId, number] =
            findMostPromisingToVisitNode(toVisit);

        //take most promising next node:
        const currentCost = toVisit[currentNodeId];

        console.log("taking next node from toVisit: ", {
            cheapestNodeId: currentNodeId,
            currentCost,
        });

        //remove it - we'll complete its processing in this pass
        delete toVisit[currentNodeId];

        const connectedNodeIds = adjacencyList[currentNodeId];

        for (let connectedNodeId of connectedNodeIds) {
            const costToCurrentNode = dists[currentNodeId];
            if (costToCurrentNode === undefined) {
                throw new Error(
                    "unexpectedly missing costToCurrentNode from dists array: " +
                        JSON.stringify({ dists })
                );
            }
            const edgeCost = 1; //TODO: we would have the costs to each connected node, too.
            const prevBestCostToConnectedNode = dists[connectedNodeId];
            if (
                prevBestCostToConnectedNode === undefined ||
                costToCurrentNode + edgeCost < prevBestCostToConnectedNode
            ) {
                dists[connectedNodeId] = costToCurrentNode + edgeCost;
                prevs[connectedNodeId] = currentNodeId;
            }

            const upToDateBestCostToConnectedNode = dists[connectedNodeId];
            if (upToDateBestCostToConnectedNode === undefined) {
                throw new Error(
                    `unexpectedly missing entry for connected node id ${connectedNodeId} from dists ${JSON.stringify(
                        dists
                    )}`
                );
            }
            if (
                !(connectedNodeId in toVisit) ||
                toVisit[connectedNodeId] > upToDateBestCostToConnectedNode
            ) {
                toVisit[connectedNodeId] = upToDateBestCostToConnectedNode;
            } else {
                //it's already in toVisit with a better score - don't replace it
            }
        }
    }

    return { prevs, dists };
}
function findMostPromisingToVisitNode(toVisit: {
    [nodeId: number]: number;
}): [number, number] {
    const entries = Object.entries(toVisit);
    if (entries.length === 0) {
        throw new Error(
            "Empty to-visit table given!  Can't find most-promising!"
        );
    }

    let recordNodeId: NodeId | null = null;
    let recordCost: number | null = null;

    for (const pair of entries) {
        const [nodeId, cost] = pair;
        if (recordCost === null || cost < recordCost) {
            recordCost = cost;
            recordNodeId = parseInt(nodeId); //TODO: consider that the node id - the key -  always comes out as string from this data structure.
        }
    }

    if (recordNodeId === null || recordCost === null) {
        throw new Error(
            "Found no most-promising to-visit node.  Should not occur - tested not empty." +
                JSON.stringify(toVisit)
        );
    }

    return [recordNodeId, recordCost];
}
