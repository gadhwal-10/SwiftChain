// ─── Batch Processor Service ────────────────────────────────────────────────
// Groups nearby pending orders for efficient multi-stop delivery.

import { haversine } from '@/algorithms/haversine';
import { BATCH_RADIUS_KM, BATCH_MAX_ORDERS } from '@/lib/constants';
import type { Order } from '@/types/order';

export interface OrderBatch {
  batchId: string;
  orders: Order[];
  centroidLat: number;
  centroidLng: number;
  totalDistance: number;
  estimatedTime: number;
}

/**
 * Cluster nearby orders using simple distance-based grouping.
 * This is a greedy approach — not globally optimal, but fast and practical.
 */
export function batchOrders(
  orders: Order[],
  radiusKm: number = BATCH_RADIUS_KM,
  maxBatchSize: number = BATCH_MAX_ORDERS
): OrderBatch[] {
  if (orders.length === 0) return [];

  // Sort by priority (urgent first)
  const sorted = [...orders].sort((a, b) => {
    const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });

  const assigned = new Set<string>();
  const batches: OrderBatch[] = [];

  for (const seed of sorted) {
    if (assigned.has(seed.id)) continue;

    const batch: Order[] = [seed];
    assigned.add(seed.id);

    // Find nearby unassigned orders
    for (const candidate of sorted) {
      if (assigned.has(candidate.id)) continue;
      if (batch.length >= maxBatchSize) break;

      const dist = haversine(seed.latitude, seed.longitude, candidate.latitude, candidate.longitude);
      if (dist <= radiusKm) {
        batch.push(candidate);
        assigned.add(candidate.id);
      }
    }

    // Calculate centroid
    const centroidLat = batch.reduce((s, o) => s + o.latitude, 0) / batch.length;
    const centroidLng = batch.reduce((s, o) => s + o.longitude, 0) / batch.length;

    // Estimate total distance (simple sum of distances from centroid)
    let totalDistance = 0;
    for (const order of batch) {
      totalDistance += haversine(centroidLat, centroidLng, order.latitude, order.longitude);
    }

    batches.push({
      batchId: `batch-${batches.length + 1}`,
      orders: batch,
      centroidLat,
      centroidLng,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedTime: Math.ceil(totalDistance * 2.5), // Rough estimate: 2.5 min per km
    });
  }

  return batches;
}

export default batchOrders;
