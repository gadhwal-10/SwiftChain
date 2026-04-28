'use client';

import { useState } from 'react';
import { RIDER_STATUS_COLORS } from '@/lib/constants';
import { useRiderLocations } from '@/hooks/useRiderLocation';
import { getInitials } from '@/lib/utils';

const MOCK_RIDERS = [
  { id: '1', name: 'Sipho M.', phone: '+27831234567', status: 'ONLINE', vehicleType: 'BIKE', rating: 4.8, totalDeliveries: 342, currentLoad: 2, maxCapacity: 5 },
  { id: '2', name: 'Thabo N.', phone: '+27839876543', status: 'ONLINE', vehicleType: 'SMALL_TRUCK', rating: 4.9, totalDeliveries: 489, currentLoad: 1, maxCapacity: 12 },
  { id: '3', name: 'Lerato D.', phone: '+27831122334', status: 'BUSY', vehicleType: 'BIKE', rating: 4.5, totalDeliveries: 267, currentLoad: 4, maxCapacity: 5 },
  { id: '4', name: 'Kgosi S.', phone: '+27834455667', status: 'ONLINE', vehicleType: 'CARGO_TRUCK', rating: 4.7, totalDeliveries: 198, currentLoad: 0, maxCapacity: 20 },
  { id: '5', name: 'Nokuthula K.', phone: '+27831299887', status: 'ONLINE', vehicleType: 'BIKE', rating: 4.6, totalDeliveries: 421, currentLoad: 3, maxCapacity: 5 },
  { id: '6', name: 'Kgomotso M.', phone: '+27831245678', status: 'OFFLINE', vehicleType: 'SMALL_TRUCK', rating: 4.4, totalDeliveries: 156, currentLoad: 0, maxCapacity: 12 },
  { id: '7', name: 'Lebohang M.', phone: '+27831299900', status: 'ONLINE', vehicleType: 'CARGO_TRUCK', rating: 4.3, totalDeliveries: 89, currentLoad: 1, maxCapacity: 20 },
  { id: '8', name: 'Mandisa S.', phone: '+27839871234', status: 'ONLINE', vehicleType: 'BIKE', rating: 4.9, totalDeliveries: 378, currentLoad: 2, maxCapacity: 5 },
  { id: '9', name: 'Sibusiso Z.', phone: '+27832344556', status: 'ON_BREAK', vehicleType: 'SMALL_TRUCK', rating: 4.2, totalDeliveries: 134, currentLoad: 0, maxCapacity: 12 },
  { id: '10', name: 'Nandi K.', phone: '+27831111222', status: 'ONLINE', vehicleType: 'BIKE', rating: 4.8, totalDeliveries: 312, currentLoad: 1, maxCapacity: 5 },
];

const VEHICLE_EMOJIS: Record<string, string> = { BIKE: '🏍️', SMALL_TRUCK: '🚚', CARGO_TRUCK: '🛻' };

export default function RidersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { onlineCount } = useRiderLocations();

  const filtered = MOCK_RIDERS.filter((r) => statusFilter === 'ALL' || r.status === statusFilter);

  return (
    <div id="riders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rider Fleet</h1>
          <p className="page-subtitle">{onlineCount || 7} online · {MOCK_RIDERS.length} total riders</p>
        </div>
        <button className="btn btn-primary" id="add-rider-btn">+ Add Rider</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['ALL', 'ONLINE', 'BUSY', 'ON_BREAK', 'OFFLINE'].map((s) => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(s)}>
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Rider Cards Grid */}
      <div className="grid grid-auto">
        {filtered.map((rider) => {
          const loadPercent = (rider.currentLoad / rider.maxCapacity) * 100;
          const statusColor = RIDER_STATUS_COLORS[rider.status] || 'muted';

          return (
            <div key={rider.id} className="glass-card" style={{ padding: 24, cursor: 'pointer' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-full)',
                  background: `linear-gradient(135deg, var(--accent-${statusColor === 'muted' ? 'cyan' : statusColor}), transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.95rem', fontWeight: 700, border: '2px solid var(--border-primary)',
                }}>
                  {getInitials(rider.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{rider.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rider.phone}</div>
                </div>
                <span className={`badge badge-dot badge-${statusColor} ${rider.status === 'ONLINE' ? 'badge-pulse' : ''}`}>
                  {rider.status.replace('_', ' ')}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicle</div>
                  <div style={{ fontSize: '0.9rem' }}>{VEHICLE_EMOJIS[rider.vehicleType]} {rider.vehicleType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</div>
                  <div style={{ fontSize: '0.9rem' }}>⭐ {rider.rating}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Deliveries</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rider.totalDeliveries}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Load</div>
                  <div style={{ fontSize: '0.9rem' }}>{rider.currentLoad}/{rider.maxCapacity}</div>
                </div>
              </div>

              {/* Load Bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 4, borderRadius: 'var(--radius-full)', background: 'var(--border-primary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${loadPercent}%`,
                    borderRadius: 'var(--radius-full)',
                    background: loadPercent > 80 ? 'var(--accent-red)' : loadPercent > 50 ? 'var(--accent-orange)' : 'var(--accent-green)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-ghost" style={{ flex: 1 }}>📍 Track</button>
                <button className="btn btn-sm btn-ghost" style={{ flex: 1 }}>📋 History</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
