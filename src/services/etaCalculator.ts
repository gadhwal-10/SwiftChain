// ─── ETA Calculator Service ─────────────────────────────────────────────────
// Continuous ETA estimation and recalculation for active deliveries.

import { haversine, estimateTravelTime } from '@/algorithms/haversine';
import { VEHICLE_SPEEDS } from '@/lib/constants';

export interface ETAEstimate {
  orderId: string;
  riderId: string;
  estimatedArrival: Date;
  remainingDistanceKm: number;
  remainingMins: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Calculate ETA from rider's current position to destination.
 */
export function calculateETA(
  riderLat: number,
  riderLng: number,
  destLat: number,
  destLng: number,
  vehicleType: string = 'BIKE'
): { distanceKm: number; durationMins: number; arrival: Date } {
  const distanceKm = haversine(riderLat, riderLng, destLat, destLng);
  const speed = VEHICLE_SPEEDS[vehicleType] || 25;

  // Apply road factor (roads are ~1.3x haversine distance)
  const roadDistanceKm = distanceKm * 1.3;
  const baseDuration = estimateTravelTime(roadDistanceKm, speed);

  // Traffic adjustment based on time of day
  const hour = new Date().getHours();
  let trafficMultiplier = 1.0;
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    trafficMultiplier = 1.4; // Rush hour
  } else if (hour >= 11 && hour <= 16) {
    trafficMultiplier = 1.15; // Moderate traffic
  }

  const adjustedDuration = Math.ceil(baseDuration * trafficMultiplier);
  const arrival = new Date(Date.now() + adjustedDuration * 60000);

  return {
    distanceKm: Math.round(roadDistanceKm * 100) / 100,
    durationMins: adjustedDuration,
    arrival,
  };
}

/**
 * Determine ETA confidence based on data freshness.
 */
export function getETAConfidence(lastPingAge: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (lastPingAge < 60000) return 'HIGH';     // < 1 min
  if (lastPingAge < 300000) return 'MEDIUM';  // < 5 min
  return 'LOW';                                // > 5 min
}

/**
 * Recalculate ETA for a multi-stop route based on current rider position.
 */
export function recalculateMultiStopETA(
  riderLat: number,
  riderLng: number,
  remainingStops: Array<{ latitude: number; longitude: number; orderId: string }>,
  vehicleType: string = 'BIKE'
): ETAEstimate[] {
  const estimates: ETAEstimate[] = [];
  let currentLat = riderLat;
  let currentLng = riderLng;
  let cumulativeMins = 0;

  for (const stop of remainingStops) {
    const eta = calculateETA(currentLat, currentLng, stop.latitude, stop.longitude, vehicleType);
    cumulativeMins += eta.durationMins;

    estimates.push({
      orderId: stop.orderId,
      riderId: '',
      estimatedArrival: new Date(Date.now() + cumulativeMins * 60000),
      remainingDistanceKm: eta.distanceKm,
      remainingMins: cumulativeMins,
      confidence: 'MEDIUM',
    });

    currentLat = stop.latitude;
    currentLng = stop.longitude;
  }

  return estimates;
}

export default calculateETA;
