// ─── Dijkstra's Shortest Path Algorithm ─────────────────────────────────────
// Graph-based shortest path for internal routing decisions.

export interface GraphEdge {
  to: string;
  weight: number;
}

export interface WeightedGraph {
  [node: string]: GraphEdge[];
}

export interface DijkstraResult {
  path: string[];
  distance: number;
  visited: Set<string>;
}

/**
 * Find the shortest path between two nodes in a weighted graph.
 * Uses a priority queue (min-heap via sorted array) for efficiency.
 */
export function dijkstra(
  graph: WeightedGraph,
  source: string,
  target: string
): DijkstraResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const queue: Array<{ node: string; distance: number }> = [];

  // Initialize
  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[source] = 0;
  queue.push({ node: source, distance: 0 });

  while (queue.length > 0) {
    // Sort to simulate priority queue (sufficient for moderate graph sizes)
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift()!;

    if (visited.has(current.node)) continue;
    visited.add(current.node);

    if (current.node === target) break;

    const neighbors = graph[current.node] || [];
    for (const edge of neighbors) {
      if (visited.has(edge.to)) continue;

      const newDist = distances[current.node] + edge.weight;
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        previous[edge.to] = current.node;
        queue.push({ node: edge.to, distance: newDist });
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = target;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  // If first element isn't source, no path exists
  if (path[0] !== source) {
    return { path: [], distance: Infinity, visited };
  }

  return { path, distance: distances[target], visited };
}

/**
 * Build a weighted graph from a set of points using haversine distances.
 * Creates a complete graph (every node connected to every other node).
 */
export function buildCompleteGraph(
  points: Array<{ id: string; latitude: number; longitude: number }>,
  distanceFn: (lat1: number, lng1: number, lat2: number, lng2: number) => number
): WeightedGraph {
  const graph: WeightedGraph = {};

  for (const point of points) {
    graph[point.id] = [];
    for (const other of points) {
      if (point.id === other.id) continue;
      graph[point.id].push({
        to: other.id,
        weight: distanceFn(point.latitude, point.longitude, other.latitude, other.longitude),
      });
    }
  }

  return graph;
}

export default dijkstra;
