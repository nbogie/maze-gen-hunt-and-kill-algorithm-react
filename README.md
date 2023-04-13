# Maze generator with pathfinding

## 1. Maze generation

The generation of the maze is done [Following Jamis Buck's simple "hunt-and-kill" algorithm](https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm)

## 2. Pathfinding

Pathfinding is done with dijkstra's shortest paths algorithm

### Pseudocode for pathfinding

```
function findAllShortestDistances(sourceNode, graph):

    track best known distance to all nodes:
        infinite initially except source node (0 dist)
    track visited nodes
    track queue of nodes to visit (prioritised by promise)

while queue is not empty:
current = Dequeue the node with the smallest distance from the priority queue.
 if current has been visited
continue

       Mark the node as visited.

       //Check all neighboring nodes to see if their distances need to be updated
       for neighbor in nodes accessible from current
           Calculate the tentative distance to the neighbor VIA current

           If the tentative distance is smaller than the current distance to the neighbor
                update the distance.

               And enqueue the neighbor with its new distance to be considered for visitation in the future.

Return the calculated distances from the source to all other nodes in the graph.
```
