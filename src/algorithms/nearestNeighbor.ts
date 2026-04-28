// ─── Nearest Neighbor TSP Heuristic ─────────────────────────────────────────
// Greedy algorithm: always visit the nearest unvisited city next.
// Time complexity: O(n²) — fast and practical for delivery routing.

import { haversine } from './haversine';

export interface TSPPoint {
  latitude: number;
  longitude: number;
  id: string;
  label?: string;
}

/**
 * Solve TSP using Nearest Neighbor heuristic.
 * 
 * @param start - Starting point (e.g., warehouse)
 * @param destinations - Array of delivery destinations
 * @param returnToStart - Whether to return to starting point
 * @returns Ordered array of destinations in visit order
 */
export function nearestNeighborTSP(
  start: TSPPoint,
  destinations: TSPPoint[],
  returnToStart: boolean = false
): { route: TSPPoint[]; totalDistance: number } {
  if (destinations.length === 0) return { route: [], totalDistance: 0 };
  if (destinations.length === 1) {
    const dist = haversine(start.latitude, start.longitude, destinations[0].latitude, destinations[0].longitude);
    const total = returnToStart ? dist * 2 : dist;
    return { route: [...destinations], totalDistance: total };
  }

  const visited = new Set<number>();
  const route: TSPPoint[] = [];
  let currentPoint = start;
  let totalDistance = 0;

  while (visited.size < destinations.length) {
    let nearestIdx = -1;
    let nearestDist = Infinity;

    for (let i = 0; i < destinations.length; i++) {
      if (visited.has(i)) continue;

      const dist = haversine(
        currentPoint.latitude, currentPoint.longitude,
        destinations[i].latitude, destinations[i].longitude
      );

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    if (nearestIdx === -1) break;

    visited.add(nearestIdx);
    route.push(destinations[nearestIdx]);
    totalDistance += nearestDist;
    currentPoint = destinations[nearestIdx];
  }

  // Return to start if needed
  if (returnToStart && route.length > 0) {
    const lastPoint = route[route.length - 1];
    totalDistance += haversine(lastPoint.latitude, lastPoint.longitude, start.latitude, start.longitude);
  }

  return { route, totalDistance };
}

export default nearestNeighborTSP;
