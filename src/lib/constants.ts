// ─── Application Constants ──────────────────────────────────────────────────

export const APP_NAME = 'Tshwane Logistics';
export const APP_DESCRIPTION = 'South Africa delivery operations hub for fleet dispatch, route planning, and real-time tracking.';

// Warehouse defaults (from env)
export const DEFAULT_WAREHOUSE = {
  lat: parseFloat(process.env.DEFAULT_WAREHOUSE_LAT || '-25.7479'),
  lng: parseFloat(process.env.DEFAULT_WAREHOUSE_LNG || '28.2293'),
  name: process.env.DEFAULT_WAREHOUSE_NAME || 'Tshwane Dispatch Hub',
  address: process.env.DEFAULT_WAREHOUSE_ADDRESS || 'Pretoria CBD, Pretoria, South Africa',
};

// Map configuration
export const MAP_CONFIG = {
  defaultCenter: [-25.7479, 28.2293] as [number, number],
  defaultZoom: 12,
  minZoom: 10,
  maxZoom: 18,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
};

// OSRM configuration
export const OSRM_BASE_URL = process.env.OSRM_API_URL || 'https://router.project-osrm.org';

// Assignment engine weights
export const ASSIGNMENT_WEIGHTS = {
  distance: 0.35,
  workload: 0.30,
  routeEfficiency: 0.20,
  rating: 0.15,
};

// Rider configuration
export const RIDER_INACTIVE_THRESHOLD_MINS = 10;
export const MAX_DELIVERY_RETRIES = 2;

// Vehicle speed estimates (km/h)
export const VEHICLE_SPEEDS: Record<string, number> = {
  BIKE: 25,
  SMALL_TRUCK: 35,
  CARGO_TRUCK: 20,
};

// Batch processing
export const BATCH_RADIUS_KM = 2;
export const BATCH_MAX_ORDERS = 5;

// WebSocket events
export const WS_EVENTS = {
  // Rider events
  RIDER_LOCATION: 'rider:location',
  RIDER_STATUS: 'rider:status',
  // Order events
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_ASSIGNED: 'order:assigned',
  ORDER_STATUS: 'order:status',
  // Route events
  ROUTE_UPDATED: 'route:updated',
  // ETA events
  ETA_UPDATED: 'eta:updated',
  // Alert events
  ALERT_FAILURE: 'alert:failure',
  ALERT_REASSIGNMENT: 'alert:reassignment',
  // Dashboard events
  STATS_UPDATED: 'stats:updated',
};

// Status display mappings
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'yellow',
  ASSIGNED: 'cyan',
  PICKED_UP: 'purple',
  IN_TRANSIT: 'orange',
  DELIVERED: 'green',
  FAILED: 'red',
  CANCELLED: 'muted',
};

export const RIDER_STATUS_COLORS: Record<string, string> = {
  ONLINE: 'green',
  OFFLINE: 'muted',
  BUSY: 'orange',
  ON_BREAK: 'yellow',
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'muted',
  NORMAL: 'cyan',
  HIGH: 'orange',
  URGENT: 'red',
};

// Navigation items
export const NAV_ITEMS = [
  { href: '/overview', label: 'Overview', icon: '📊', section: 'main' },
  { href: '/orders', label: 'Orders', icon: '📦', section: 'main' },
  { href: '/riders', label: 'Riders', icon: '🏍️', section: 'main' },
  { href: '/map', label: 'Live Map', icon: '🗺️', section: 'main' },
  { href: '/analytics', label: 'Analytics', icon: '📈', section: 'insights' },
  { href: '/settings', label: 'Settings', icon: '⚙️', section: 'system' },
];
