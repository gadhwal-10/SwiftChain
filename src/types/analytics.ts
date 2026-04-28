// ─── Analytics Types ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedToday: number;
  failedToday: number;
  avgDeliveryTime: number;
  successRate: number;
  activeRiders: number;
  totalRiders: number;
  pendingOrders: number;
  inTransitOrders: number;
}

export interface DeliveryTrend {
  date: string;
  completed: number;
  failed: number;
  total: number;
}

export interface RiderPerformance {
  riderId: string;
  riderName: string;
  deliveries: number;
  avgTime: number;
  rating: number;
  successRate: number;
}

export interface FailureBreakdown {
  reason: string;
  count: number;
  percentage: number;
}

export interface HourlyDistribution {
  hour: number;
  orders: number;
}
