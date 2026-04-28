// ─── Order Types ────────────────────────────────────────────────────────────

export type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
export type OrderSource = 'MANUAL' | 'WHATSAPP' | 'API';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  product: string;
  quantity: number;
  weight?: number | null;
  priority: OrderPriority;
  status: OrderStatus;
  latitude: number;
  longitude: number;
  address: string;
  notes?: string | null;
  source: OrderSource;
  estimatedETA?: string | null;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  retryCount: number;
  warehouseId: string;
  riderId?: string | null;
  rider?: Rider | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  product: string;
  quantity?: number;
  weight?: number;
  priority?: OrderPriority;
  latitude: number;
  longitude: number;
  address: string;
  notes?: string;
  source?: OrderSource;
}

export interface OrderFilters {
  status?: OrderStatus;
  priority?: OrderPriority;
  riderId?: string;
  source?: OrderSource;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
