// ─── Rider Types ────────────────────────────────────────────────────────────

export type RiderStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ON_BREAK';
export type VehicleType = 'BIKE' | 'SMALL_TRUCK' | 'CARGO_TRUCK';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatar?: string | null;
  status: RiderStatus;
  latitude?: number | null;
  longitude?: number | null;
  maxCapacity: number;
  currentLoad: number;
  rating: number;
  totalDeliveries: number;
  vehicleType: VehicleType;
  vehiclePlate?: string | null;
  lastPingAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiderWithScore extends Rider {
  assignmentScore: number;
  distanceToWarehouse: number;
  distanceToOrder: number;
}
