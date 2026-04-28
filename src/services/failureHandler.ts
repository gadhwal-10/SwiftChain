// ─── Failure Handler Service ────────────────────────────────────────────────
// Detects delivery failures, flags at-risk orders, and triggers reassignment.

import { RIDER_INACTIVE_THRESHOLD_MINS, MAX_DELIVERY_RETRIES } from '@/lib/constants';

export type FailureReason =
  | 'RIDER_INACTIVE'
  | 'RIDER_OFFLINE'
  | 'DELIVERY_TIMEOUT'
  | 'CUSTOMER_UNREACHABLE'
  | 'WRONG_ADDRESS'
  | 'VEHICLE_BREAKDOWN'
  | 'MANUAL_REPORT';

export interface FailureEvent {
  orderId: string;
  riderId: string;
  reason: FailureReason;
  details?: string;
  timestamp: Date;
}

export interface AtRiskOrder {
  orderId: string;
  riderId: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: Date;
}

/**
 * Check if a rider is inactive based on their last GPS ping.
 */
export function isRiderInactive(lastPingAt: Date | null, thresholdMins: number = RIDER_INACTIVE_THRESHOLD_MINS): boolean {
  if (!lastPingAt) return true;
  const elapsed = (Date.now() - lastPingAt.getTime()) / 60000;
  return elapsed > thresholdMins;
}

/**
 * Determine failure severity based on order priority and failure type.
 */
export function assessFailureSeverity(
  orderPriority: string,
  reason: FailureReason,
  retryCount: number
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (orderPriority === 'URGENT') return 'CRITICAL';
  if (reason === 'VEHICLE_BREAKDOWN' || reason === 'RIDER_OFFLINE') return 'HIGH';
  if (retryCount >= MAX_DELIVERY_RETRIES) return 'HIGH';
  if (orderPriority === 'HIGH') return 'MEDIUM';
  return 'LOW';
}

/**
 * Determine the appropriate action for a failure.
 */
export function determineFailureAction(
  retryCount: number,
  maxRetries: number = MAX_DELIVERY_RETRIES
): 'REASSIGN' | 'WAREHOUSE_RETURN' | 'EXTERNAL_DELIVERY' | 'MARK_FAILED' {
  if (retryCount < maxRetries) return 'REASSIGN';
  if (retryCount === maxRetries) return 'WAREHOUSE_RETURN';
  return 'MARK_FAILED';
}

/**
 * Check if an order delivery has timed out.
 * An order times out if it hasn't been delivered within 2x the estimated time.
 */
export function isDeliveryTimedOut(
  assignedAt: Date | null,
  estimatedMins: number | null,
  timeoutMultiplier: number = 2.0
): boolean {
  if (!assignedAt || !estimatedMins) return false;
  const elapsed = (Date.now() - assignedAt.getTime()) / 60000;
  return elapsed > estimatedMins * timeoutMultiplier;
}

export default {
  isRiderInactive,
  assessFailureSeverity,
  determineFailureAction,
  isDeliveryTimedOut,
};
