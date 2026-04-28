// ─── Haversine Distance Calculator ──────────────────────────────────────────
// Calculates the great-circle distance between two points on Earth

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two geographic points using the Haversine formula.
 * @returns Distance in kilometers
 */
export function haversine(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Estimate travel time based on distance and vehicle speed.
 * @returns Duration in minutes
 */
export function estimateTravelTime(distanceKm: number, speedKmh: number = 25): number {
  return (distanceKm / speedKmh) * 60;
}

/**
 * Calculate total route distance for a sequence of points.
 */
export function totalRouteDistance(
  points: Array<{ latitude: number; longitude: number }>
): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversine(
      points[i].latitude, points[i].longitude,
      points[i + 1].latitude, points[i + 1].longitude
    );
  }
  return total;
}

export default haversine;
