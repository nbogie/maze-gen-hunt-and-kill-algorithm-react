export type AdjacencyList = { [key: number]: number[] };
export type NodeId = number;

export const demoGraph: AdjacencyList = {
    0: [1, 2],
    1: [3],
    2: [3],
    3: [4],
    4: [],
};

export interface PathfindingResult {
    dists: (NodeId | null)[];
    prevs: (NodeId | null)[];
}

/* 
Algorithm for Dijkstra's shortest distances:

function findAllShortestDistances(sourceNode, graph):

    track best known distance to all nodes:
        infinite initially, except source node (0 dist)
    track a previous node for each node - allows us to track routes taken

    track visited nodes
    track queue of nodes to visit (prioritised by promise)
    
   while queue is not empty:
       current = Dequeue the node with the smallest distance from the priority queue.       
       if current has been visited
           continue

       Mark the node as visited.
       
       //Check all neighbouring nodes to see if their distances need to be updated
       for neighbour in nodes accessible from current
           Calculate the tentative distance to the neighbour VIA current
           
           If the tentative distance is smaller than the current distance to the neighbour
                update the distance
                update the previous node recorded for the neighbour (for pathing)

               And enqueue the neighbour with its new distance to be considered for visitation in the future.               

            
   Return the calculated distances from the source to all other nodes in the graph.
 
*/
export function findShortestPaths(
    startNodeId: NodeId,
    adjacencyList: AdjacencyList
): PathfindingResult {
    console.log("findShortestPaths: ", { startNodeId, adjacencyList });

    // track visited nodes
    const visited: { [nodeId: NodeId]: boolean } = Object.fromEntries(
        Object.keys(adjacencyList).map((id) => [id, false])
    );

    // track best known distance to all nodes:
    //     infinite initially except source node (0 dist)
    const dists: (NodeId | null)[] = [];
    dists[startNodeId] = 0;

    console.log("findShortestPaths: ", { startNodeId, adjacencyList });
    // track queue of nodes to visit (prioritised by promise)
    const toVisit: { [nodeId: NodeId]: number } = {};
    toVisit[startNodeId] = 0;

    //track the previous node that got us to each node's shortest cost.
    const prevs: (NodeId | null)[] = [null];

    while (Object.keys(toVisit).length > 0) {
        //TODO: there are many large optimisations to use for this step
        const [currentNodeId, _unusedCostToCurrentNode]: [NodeId, number] =
            findMostPromisingToVisitNode(toVisit);

        visited[currentNodeId] = true;
        //take most promising next node:
        const currentCost = toVisit[currentNodeId];

        //remove it - we'll complete its processing in this pass
        delete toVisit[currentNodeId];

        const connectedNodeIds = adjacencyList[currentNodeId];

        for (let connectedNodeId of connectedNodeIds) {
            if (visited[connectedNodeId] === true) {
                // console.log(
                //     `skipping already visited node: ${connectedNodeId}`
                // );
                continue;
            }
            const costToCurrentNode = dists[currentNodeId] ?? null;
            if (costToCurrentNode === null) {
                throw new Error(
                    "unexpectedly missing costToCurrentNode from dists array: " +
                        JSON.stringify({ dists })
                );
            }
            const edgeCost = 1; //TODO: we would have the costs to each connected node, too.
            const prevBestCostToConnectedNode = dists[connectedNodeId] ?? null;
            if (
                prevBestCostToConnectedNode === null ||
                costToCurrentNode + edgeCost < prevBestCostToConnectedNode
            ) {
                dists[connectedNodeId] = costToCurrentNode + edgeCost;
                prevs[connectedNodeId] = currentNodeId;
                toVisit[connectedNodeId] = costToCurrentNode + edgeCost;
            }
        }
    }

    return {
        dists,
        prevs,
    };
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
