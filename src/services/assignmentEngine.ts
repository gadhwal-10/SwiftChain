// ─── Assignment Engine ──────────────────────────────────────────────────────
// Smart rider-order matching based on weighted scoring of multiple factors.

import { haversine } from '@/algorithms/haversine';
import { ASSIGNMENT_WEIGHTS, VEHICLE_SPEEDS } from '@/lib/constants';
import type { Rider, RiderWithScore } from '@/types/rider';
import type { Order } from '@/types/order';

interface AssignmentScoreBreakdown {
  distanceScore: number;
  workloadScore: number;
  routeEfficiencyScore: number;
  ratingScore: number;
  totalScore: number;
}

/**
 * Calculate assignment score for a rider-order pair.
 * Higher score = better match.
 */
export function calculateAssignmentScore(
  rider: Rider,
  order: Order,
  warehouseLat: number,
  warehouseLng: number
): AssignmentScoreBreakdown {
  // 1. Distance Score (closer rider to warehouse = better for pickup)
  const riderToWarehouse = rider.latitude && rider.longitude
    ? haversine(rider.latitude, rider.longitude, warehouseLat, warehouseLng)
    : 50; // Penalty if no location data
  const maxReasonableDistance = 20; // km
  const distanceScore = Math.max(0, 1 - (riderToWarehouse / maxReasonableDistance));

  // 2. Workload Score (fewer current orders = better)
  const workloadRatio = rider.currentLoad / rider.maxCapacity;
  const workloadScore = Math.max(0, 1 - workloadRatio);

  // 3. Route Efficiency Score (if rider is already near the delivery destination)
  let routeEfficiencyScore = 0.5; // Default neutral
  if (rider.latitude && rider.longitude) {
    const riderToOrder = haversine(rider.latitude, rider.longitude, order.latitude, order.longitude);
    const warehouseToOrder = haversine(warehouseLat, warehouseLng, order.latitude, order.longitude);
    // If rider is closer to destination than warehouse, that's efficient
    routeEfficiencyScore = riderToOrder < warehouseToOrder ? 0.8 : 0.3;
    // If already heading in same direction, bonus
    const totalDetour = riderToWarehouse + haversine(warehouseLat, warehouseLng, order.latitude, order.longitude);
    const directDist = haversine(rider.latitude, rider.longitude, order.latitude, order.longitude);
    if (totalDetour > 0) {
      routeEfficiencyScore = Math.max(routeEfficiencyScore, directDist / totalDetour);
    }
  }

  // 4. Rating Score (higher rated = better, especially for urgent orders)
  const ratingScore = rider.rating / 5.0;
  const priorityMultiplier = order.priority === 'URGENT' ? 1.5 : order.priority === 'HIGH' ? 1.2 : 1.0;

  // Weighted total
  const totalScore =
    ASSIGNMENT_WEIGHTS.distance * distanceScore +
    ASSIGNMENT_WEIGHTS.workload * workloadScore +
    ASSIGNMENT_WEIGHTS.routeEfficiency * routeEfficiencyScore +
    ASSIGNMENT_WEIGHTS.rating * ratingScore * priorityMultiplier;

  return {
    distanceScore,
    workloadScore,
    routeEfficiencyScore,
    ratingScore,
    totalScore: Math.min(1, totalScore),
  };
}

/**
 * Find the best available rider for an order.
 * Returns riders sorted by assignment score (best first).
 */
export function rankRidersForOrder(
  riders: Rider[],
  order: Order,
  warehouseLat: number,
  warehouseLng: number
): RiderWithScore[] {
  const availableRiders = riders.filter(
    (r) => r.status === 'ONLINE' && r.currentLoad < r.maxCapacity && r.isActive
  );

  const scored: RiderWithScore[] = availableRiders.map((rider) => {
    const scores = calculateAssignmentScore(rider, order, warehouseLat, warehouseLng);
    const distToWarehouse = rider.latitude && rider.longitude
      ? haversine(rider.latitude, rider.longitude, warehouseLat, warehouseLng)
      : 999;
    const distToOrder = rider.latitude && rider.longitude
      ? haversine(rider.latitude, rider.longitude, order.latitude, order.longitude)
      : 999;

    return {
      ...rider,
      assignmentScore: scores.totalScore,
      distanceToWarehouse: distToWarehouse,
      distanceToOrder: distToOrder,
    };
  });

  // Sort by score descending (best first)
  scored.sort((a, b) => b.assignmentScore - a.assignmentScore);
  return scored;
}

/**
 * Estimate delivery time for a rider-order assignment.
 * @returns Estimated delivery time in minutes
 */
export function estimateDeliveryTime(
  rider: Rider,
  order: Order,
  warehouseLat: number,
  warehouseLng: number
): number {
  const speed = VEHICLE_SPEEDS[rider.vehicleType] || 25;

  // Time: rider → warehouse → customer
  const riderToWarehouse = rider.latitude && rider.longitude
    ? haversine(rider.latitude, rider.longitude, warehouseLat, warehouseLng)
    : 5;
  const warehouseToCustomer = haversine(warehouseLat, warehouseLng, order.latitude, order.longitude);

  const travelDistanceKm = riderToWarehouse + warehouseToCustomer;
  const travelTimeMins = (travelDistanceKm / speed) * 60;

  // Add buffer for pickup, traffic, etc.
  const pickupBufferMins = 5;
  const trafficMultiplier = 1.3; // 30% traffic buffer

  return Math.ceil((travelTimeMins * trafficMultiplier) + pickupBufferMins);
}
