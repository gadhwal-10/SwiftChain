'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRiderLocations } from '@/hooks/useRiderLocation';
import { ORDER_STATUS_COLORS, RIDER_STATUS_COLORS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import dynamic from 'next/dynamic';

const LiveMapMini = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

// ─── Mock Data (replaced by real API in production) ─────────────────────────

const MOCK_STATS = {
  totalOrders: 847,
  activeOrders: 13,
  completedToday: 42,
  failedToday: 2,
  avgDeliveryTime: 34,
  successRate: 95.3,
  pendingOrders: 6,
  inTransitOrders: 4,
};

const MOCK_RECENT_ORDERS = [
  { id: '1', orderNumber: 'TP-K1R2-AB3C', customerName: 'Lerato Mokoena', product: 'Electronics Kit', status: 'IN_TRANSIT', priority: 'HIGH', address: '11 Pretorius St, Pretoria CBD', createdAt: new Date(Date.now() - 1200000).toISOString(), riderName: 'Sipho M.' },
  { id: '2', orderNumber: 'TP-M3N4-DE5F', customerName: 'Zodwa Mahlangu', product: 'Laptop Docking Station', status: 'PENDING', priority: 'URGENT', address: '34 Brooklyn Road, Brooklyn', createdAt: new Date(Date.now() - 600000).toISOString(), riderName: null },
  { id: '3', orderNumber: 'TP-P5Q6-GH7I', customerName: 'Thabo Nkosi', product: 'Wireless Mouse Bundle', status: 'ASSIGNED', priority: 'NORMAL', address: '22 Lynnwood Rd, Lynnwood', createdAt: new Date(Date.now() - 3600000).toISOString(), riderName: 'Nokuthula K.' },
  { id: '4', orderNumber: 'TP-R7S8-JK9L', customerName: 'Nthabiseng Dlamini', product: 'Power Bank', status: 'DELIVERED', priority: 'HIGH', address: '8 Lyttelton Rd, Hatfield', createdAt: new Date(Date.now() - 7200000).toISOString(), riderName: 'Kgosi S.' },
  { id: '5', orderNumber: 'TP-T9U0-MN1O', customerName: 'Siphiwe Masondo', product: 'Bluetooth Speaker', status: 'PICKED_UP', priority: 'NORMAL', address: '5 Moreleta Park Rd, Moreleta Park', createdAt: new Date(Date.now() - 1800000).toISOString(), riderName: 'Lerato M.' },
  { id: '6', orderNumber: 'TP-V1W2-PQ3R', customerName: 'Nandi Khumalo', product: 'External SSD', status: 'FAILED', priority: 'LOW', address: '31 Menlyn Dr, Menlyn', createdAt: new Date(Date.now() - 5400000).toISOString(), riderName: 'Nokuthula K.' },
];

const MOCK_ALERTS = [
  { id: '1', type: 'warning', message: 'Rider Sipho M. went offline 5 min ago with 2 active orders', time: '2 min ago' },
  { id: '2', type: 'error', message: 'Order TP-V1W2-PQ3R delivery failed — customer not home', time: '8 min ago' },
  { id: '3', type: 'info', message: 'Route optimization completed: 18% improvement for Sipho M.', time: '12 min ago' },
];

export default function OverviewPage() {
  const { isConnected } = useSocket();
  const { onlineCount } = useRiderLocations();
  const [stats] = useState(MOCK_STATS);

  return (
    <div id="overview-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time delivery operations at a glance</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`badge badge-dot badge-pulse ${isConnected ? 'badge-green' : 'badge-red'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="glass-card stat-card" style={{ '--stat-accent': 'var(--accent-cyan)' } as React.CSSProperties}>
          <div className="stat-value">{stats.activeOrders}</div>
          <div className="stat-label">Active Orders</div>
          <div className="stat-change positive">+3 from last hour</div>
        </div>
        <div className="glass-card stat-card" style={{ '--stat-accent': 'var(--accent-green)' } as React.CSSProperties}>
          <div className="stat-value">{stats.completedToday}</div>
          <div className="stat-label">Delivered Today</div>
          <div className="stat-change positive">↑ 12% vs yesterday</div>
        </div>
        <div className="glass-card stat-card" style={{ '--stat-accent': 'var(--accent-orange)' } as React.CSSProperties}>
          <div className="stat-value">{onlineCount || 7}</div>
          <div className="stat-label">Riders Online</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>of 10 total</div>
        </div>
        <div className="glass-card stat-card" style={{ '--stat-accent': 'var(--accent-purple)' } as React.CSSProperties}>
          <div className="stat-value">{stats.avgDeliveryTime}m</div>
          <div className="stat-label">Avg Delivery Time</div>
          <div className="stat-change positive">↓ 3 min improvement</div>
        </div>
      </div>

      {/* Main Grid: Map + Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Mini Live Map */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: 380 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🗺️ Live Map</h3>
            <a href="/map" className="badge badge-cyan" style={{ textDecoration: 'none', cursor: 'pointer' }}>Open Full Map →</a>
          </div>
          <div style={{ height: 340 }}>
            <LiveMapMini height="340px" miniMode />
          </div>
        </div>

        {/* Alerts & Recent Activity */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🚨 Alerts & Activity</h3>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 340, overflowY: 'auto' }}>
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: alert.type === 'error' ? 'var(--accent-red-dim)' : alert.type === 'warning' ? 'var(--accent-orange-dim)' : 'var(--accent-cyan-dim)',
                  borderLeft: `3px solid ${alert.type === 'error' ? 'var(--accent-red)' : alert.type === 'warning' ? 'var(--accent-orange)' : 'var(--accent-cyan)'}`,
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ marginBottom: 4 }}>{alert.message}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.time}</div>
              </div>
            ))}

            {/* Performance mini stats */}
            <div style={{ marginTop: 8, padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.5)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Today&apos;s Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{stats.successRate}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-red)' }}>{stats.failedToday}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Failed Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📦 Recent Orders</h3>
          <a href="/orders" className="badge badge-cyan" style={{ textDecoration: 'none', cursor: 'pointer' }}>View All →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" id="recent-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Rider</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{order.orderNumber}</span>
                  </td>
                  <td>{order.customerName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.product}</td>
                  <td>
                    <span className={`badge badge-dot badge-${ORDER_STATUS_COLORS[order.status]} ${order.status === 'IN_TRANSIT' ? 'badge-pulse' : ''}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${order.priority === 'URGENT' ? 'red' : order.priority === 'HIGH' ? 'orange' : 'muted'}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td style={{ color: order.riderName ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {order.riderName || 'Unassigned'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatRelativeTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
