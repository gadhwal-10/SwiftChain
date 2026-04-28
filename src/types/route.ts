// ─── Route Types ────────────────────────────────────────────────────────────

export interface Point {
  latitude: number;
  longitude: number;
  id?: string;
  label?: string;
}

export interface RouteSegment {
  from: Point;
  to: Point;
  distanceKm: number;
  durationMins: number;
  polyline?: string;
}

export interface OptimizedRoute {
  waypoints: Point[];
  totalDistanceKm: number;
  totalDurationMins: number;
  segments: RouteSegment[];
  polyline?: string;
  improvementPercent?: number;
}

export interface DistanceMatrix {
  points: Point[];
  distances: number[][];
  durations: number[][];
}
