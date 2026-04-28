// ─── Route Optimizer Service ────────────────────────────────────────────────
// Orchestrates the optimization pipeline: Nearest Neighbor → 2-opt improvement.

import { nearestNeighborTSP, type TSPPoint } from '@/algorithms/nearestNeighbor';
import { twoOptImprove } from '@/algorithms/twoOpt';
import { haversine, estimateTravelTime, totalRouteDistance } from '@/algorithms/haversine';
import { VEHICLE_SPEEDS } from '@/lib/constants';
import type { OptimizedRoute, Point } from '@/types/route';

/**
 * Optimize delivery route for a set of orders starting from a warehouse.
 * Uses Nearest Neighbor for initial solution, then 2-opt for improvement.
 */
export function optimizeRoute(
  warehouse: Point,
  destinations: Point[],
  vehicleType: string = 'BIKE'
): OptimizedRoute {
  if (destinations.length === 0) {
    return { waypoints: [], totalDistanceKm: 0, totalDurationMins: 0, segments: [] };
  }

  if (destinations.length === 1) {
    const dist = haversine(warehouse.latitude, warehouse.longitude, destinations[0].latitude, destinations[0].longitude);
    const speed = VEHICLE_SPEEDS[vehicleType] || 25;
    const duration = estimateTravelTime(dist, speed);
    return {
      waypoints: destinations,
      totalDistanceKm: Math.round(dist * 100) / 100,
      totalDurationMins: Math.ceil(duration),
      segments: [{
        from: warehouse,
        to: destinations[0],
        distanceKm: Math.round(dist * 100) / 100,
        durationMins: Math.ceil(duration),
      }],
    };
  }

  // Convert to TSP points
  const start: TSPPoint = { ...warehouse, id: 'warehouse', label: 'Warehouse' };
  const tspDestinations: TSPPoint[] = destinations.map((d, i) => ({
    ...d,
    id: d.id || `dest_${i}`,
    label: d.label || `Stop ${i + 1}`,
  }));

  // Step 1: Nearest Neighbor initial solution
  const nnResult = nearestNeighborTSP(start, tspDestinations);

  // Step 2: 2-opt improvement
  const improved = twoOptImprove(nnResult.route, start, 150);

  // Calculate improvement percentage
  const improvementPercent = nnResult.totalDistance > 0
    ? Math.round(((nnResult.totalDistance - improved.totalDistance) / nnResult.totalDistance) * 100)
    : 0;

  // Build segments
  const speed = VEHICLE_SPEEDS[vehicleType] || 25;
  const segments = [];
  let prevPoint: Point = warehouse;

  for (const point of improved.route) {
    const dist = haversine(prevPoint.latitude, prevPoint.longitude, point.latitude, point.longitude);
    segments.push({
      from: prevPoint,
      to: point as Point,
      distanceKm: Math.round(dist * 100) / 100,
      durationMins: Math.ceil(estimateTravelTime(dist, speed)),
    });
    prevPoint = point as Point;
  }

  const totalDuration = segments.reduce((sum, s) => sum + s.durationMins, 0);

  return {
    waypoints: improved.route as Point[],
    totalDistanceKm: Math.round(improved.totalDistance * 100) / 100,
    totalDurationMins: totalDuration,
    segments,
    improvementPercent,
  };
}

/**
 * Build a distance matrix between all points.
 */
export function buildDistanceMatrix(points: Point[]): number[][] {
  const n = points.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist = haversine(
        points[i].latitude, points[i].longitude,
        points[j].latitude, points[j].longitude
      );
      matrix[i][j] = dist;
      matrix[j][i] = dist;
    }
  }

  return matrix;
}

export default optimizeRoute;
