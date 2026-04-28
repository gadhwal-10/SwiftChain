'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [warehouseName, setWarehouseName] = useState('Tshwane Dispatch Hub');
  const [warehouseAddress, setWarehouseAddress] = useState('Pretoria CBD, Pretoria, South Africa');
  const [warehouseLat, setWarehouseLat] = useState('-25.7479');
  const [warehouseLng, setWarehouseLng] = useState('28.2293');
  const [inactiveThreshold, setInactiveThreshold] = useState('10');
  const [maxRetries, setMaxRetries] = useState('2');
  const [batchRadius, setBatchRadius] = useState('2');

  return (
    <div id="settings-page" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure warehouse, routing, and system parameters</p>
        </div>
      </div>

      {/* Warehouse Config */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🏭 Warehouse Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Warehouse Name</label>
            <input className="form-input" value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Address</label>
            <input className="form-input" value={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input className="form-input" value={warehouseLat} onChange={(e) => setWarehouseLat(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input className="form-input" value={warehouseLng} onChange={(e) => setWarehouseLng(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Delivery Engine */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>⚙️ Delivery Engine</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Inactive Threshold (min)</label>
            <input className="form-input" type="number" value={inactiveThreshold} onChange={(e) => setInactiveThreshold(e.target.value)} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Time before rider is flagged as inactive</span>
          </div>
          <div className="form-group">
            <label className="form-label">Max Retries</label>
            <input className="form-input" type="number" value={maxRetries} onChange={(e) => setMaxRetries(e.target.value)} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reassignment attempts before failure</span>
          </div>
          <div className="form-group">
            <label className="form-label">Batch Radius (km)</label>
            <input className="form-input" type="number" value={batchRadius} onChange={(e) => setBatchRadius(e.target.value)} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clustering radius for order batching</span>
          </div>
        </div>
      </div>

      {/* Assignment Weights */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🧮 Assignment Weights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Distance', value: '0.35', desc: 'Proximity to warehouse' },
            { label: 'Workload', value: '0.30', desc: 'Current order load' },
            { label: 'Route Efficiency', value: '0.20', desc: 'Heading in same direction' },
            { label: 'Rating', value: '0.15', desc: 'Rider performance score' },
          ].map((w) => (
            <div key={w.label} className="form-group">
              <label className="form-label">{w.label} Weight</label>
              <input className="form-input" type="number" step="0.05" min="0" max="1" defaultValue={w.value} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{w.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-ghost">Reset Defaults</button>
        <button className="btn btn-primary btn-lg">💾 Save Settings</button>
      </div>
    </div>
  );
}
