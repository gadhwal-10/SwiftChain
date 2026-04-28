'use client';

import { useState } from 'react';
import { ORDER_STATUS_COLORS, PRIORITY_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

const MOCK_ORDERS = [
  { id: '1', orderNumber: 'TP-K1R2-AB3C', customerName: 'Lerato Mokoena', customerPhone: '+27831234567', product: 'Electronics Kit', quantity: 1, status: 'IN_TRANSIT', priority: 'HIGH', address: '11 Pretorius St, Pretoria CBD', source: 'MANUAL', createdAt: new Date(Date.now() - 1200000).toISOString(), riderName: 'Sipho M.' },
  { id: '2', orderNumber: 'TP-M3N4-DE5F', customerName: 'Zodwa Mahlangu', customerPhone: '+27839876543', product: 'Laptop Docking Station', quantity: 2, status: 'PENDING', priority: 'URGENT', address: '34 Brooklyn Road, Brooklyn', source: 'WHATSAPP', createdAt: new Date(Date.now() - 600000).toISOString(), riderName: null },
  { id: '3', orderNumber: 'TP-P5Q6-GH7I', customerName: 'Thabo Nkosi', customerPhone: '+27831122334', product: 'Wireless Mouse Bundle', quantity: 3, status: 'ASSIGNED', priority: 'NORMAL', address: '22 Lynnwood Rd, Lynnwood', source: 'MANUAL', createdAt: new Date(Date.now() - 3600000).toISOString(), riderName: 'Nokuthula K.' },
  { id: '4', orderNumber: 'TP-R7S8-JK9L', customerName: 'Nthabiseng Dlamini', customerPhone: '+27834455667', product: 'Power Bank', quantity: 1, status: 'DELIVERED', priority: 'HIGH', address: '8 Lyttelton Rd, Hatfield', source: 'API', createdAt: new Date(Date.now() - 7200000).toISOString(), riderName: 'Kgosi S.' },
  { id: '5', orderNumber: 'TP-T9U0-MN1O', customerName: 'Siphiwe Masondo', customerPhone: '+27831299887', product: 'Bluetooth Speaker', quantity: 1, status: 'PICKED_UP', priority: 'NORMAL', address: '5 Moreleta Park Rd, Moreleta Park', source: 'MANUAL', createdAt: new Date(Date.now() - 1800000).toISOString(), riderName: 'Lerato M.' },
  { id: '6', orderNumber: 'TP-V1W2-PQ3R', customerName: 'Nandi Khumalo', customerPhone: '+27838766554', product: 'External SSD', quantity: 5, status: 'FAILED', priority: 'LOW', address: '31 Menlyn Dr, Menlyn', source: 'MANUAL', createdAt: new Date(Date.now() - 5400000).toISOString(), riderName: 'Nokuthula K.' },
  { id: '7', orderNumber: 'TP-X3Y4-ST5U', customerName: 'Sipho van der Merwe', customerPhone: '+27832344556', product: 'Laptop', quantity: 1, status: 'PENDING', priority: 'HIGH', address: '15 Rosettenville Rd, Waterkloof', source: 'WHATSAPP', createdAt: new Date(Date.now() - 900000).toISOString(), riderName: null },
  { id: '8', orderNumber: 'TP-Z5A6-VW7X', customerName: 'Kgomotso M.', customerPhone: '+27831245678', product: 'Monitor Stand', quantity: 2, status: 'PENDING', priority: 'NORMAL', address: '60 Hatfield St, Hatfield', source: 'MANUAL', createdAt: new Date(Date.now() - 2400000).toISOString(), riderName: null },
  { id: '9', orderNumber: 'TP-B7C8-YZ9A', customerName: 'Mandisa Sithole', customerPhone: '+27839871234', product: 'USB-C Hub', quantity: 1, status: 'IN_TRANSIT', priority: 'URGENT', address: '20 Brooklyn Rd, Brooklyn', source: 'API', createdAt: new Date(Date.now() - 1500000).toISOString(), riderName: 'Sipho M.' },
  { id: '10', orderNumber: 'TP-D9E0-BC1D', customerName: 'Lebohang M.', customerPhone: '+27831299900', product: 'Gaming Keyboard', quantity: 1, status: 'PENDING', priority: 'NORMAL', address: '9 Waterkloof Ridge, Waterkloof Ridge', source: 'MANUAL', createdAt: new Date(Date.now() - 3000000).toISOString(), riderName: null },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && o.priority !== priorityFilter) return false;
    return true;
  });

  const statusCounts: Record<string, number> = {};
  MOCK_ORDERS.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div id="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">{MOCK_ORDERS.length} total orders · {statusCounts['PENDING'] || 0} pending</p>
        </div>
        <Link href="/orders/new" className="btn btn-primary" id="create-order-btn">
          + New Order
        </Link>
      </div>

      {/* Status Quick Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL' ? 'All' : ORDER_STATUS_LABELS[status] || status}
            {status !== 'ALL' && statusCounts[status] ? ` (${statusCounts[status]})` : ''}
          </button>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">🔴 Urgent</option>
            <option value="HIGH">🟠 High</option>
            <option value="NORMAL">🔵 Normal</option>
            <option value="LOW">⚪ Low</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" id="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Source</th>
                <th>Rider</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td><span className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{order.orderNumber}</span></td>
                  <td>
                    <div>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 140 }} className="truncate">{order.product}</td>
                  <td style={{ textAlign: 'center' }}>{order.quantity}</td>
                  <td>
                    <span className={`badge badge-dot badge-${ORDER_STATUS_COLORS[order.status]} ${['IN_TRANSIT', 'PICKED_UP'].includes(order.status) ? 'badge-pulse' : ''}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td><span className={`badge badge-${PRIORITY_COLORS[order.priority]}`}>{order.priority}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.source}</td>
                  <td style={{ color: order.riderName ? 'var(--text-primary)' : 'var(--text-muted)' }}>{order.riderName || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatRelativeTime(order.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {order.status === 'PENDING' && (
                        <button className="btn btn-sm btn-primary" title="Assign Rider">⚡</button>
                      )}
                      <button className="btn btn-sm btn-ghost" title="View Details">👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
