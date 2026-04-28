// ─── 2-opt Route Improvement ────────────────────────────────────────────────
// Iteratively reverses sub-routes to reduce total distance.
// Typically improves Nearest Neighbor solutions by 15-25%.

import { haversine } from './haversine';
import type { TSPPoint } from './nearestNeighbor';

/**
 * Apply 2-opt improvement to an existing route.
 * Reverses segments of the route when doing so reduces total distance.
 * 
 * @param route - Current route (ordered array of points)
 * @param start - Starting point (warehouse)
 * @param maxIterations - Maximum improvement iterations
 * @returns Improved route and total distance
 */
export function twoOptImprove(
  route: TSPPoint[],
  start: TSPPoint,
  maxIterations: number = 100
): { route: TSPPoint[]; totalDistance: number; iterations: number } {
  if (route.length <= 2) {
    return {
      route: [...route],
      totalDistance: calculateTotalDistance(route, start),
      iterations: 0,
    };
  }

  let bestRoute = [...route];
  let bestDistance = calculateTotalDistance(bestRoute, start);
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.length; j++) {
        // Try reversing the segment between i and j
        const newRoute = twoOptSwap(bestRoute, i, j);
        const newDistance = calculateTotalDistance(newRoute, start);

        if (newDistance < bestDistance - 0.001) {
          // Found improvement (with small epsilon to avoid floating point issues)
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return { route: bestRoute, totalDistance: bestDistance, iterations };
}

/**
 * Perform a 2-opt swap: reverse the segment between index i and j.
 */
function twoOptSwap(route: TSPPoint[], i: number, j: number): TSPPoint[] {
  const newRoute: TSPPoint[] = [];

  // Add points before i
  for (let k = 0; k < i; k++) {
    newRoute.push(route[k]);
  }

  // Add reversed segment from i to j
  for (let k = j; k >= i; k--) {
    newRoute.push(route[k]);
  }

  // Add points after j
  for (let k = j + 1; k < route.length; k++) {
    newRoute.push(route[k]);
  }

  return newRoute;
}

/**
 * Calculate total route distance including start point.
 */
function calculateTotalDistance(route: TSPPoint[], start: TSPPoint): number {
  if (route.length === 0) return 0;

  let total = haversine(start.latitude, start.longitude, route[0].latitude, route[0].longitude);

  for (let i = 0; i < route.length - 1; i++) {
    total += haversine(
      route[i].latitude, route[i].longitude,
      route[i + 1].latitude, route[i + 1].longitude
    );
  }

  return total;
}

export default twoOptImprove;
