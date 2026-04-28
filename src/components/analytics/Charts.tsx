'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const DELIVERY_TRENDS = [
  { day: 'Mon', completed: 38, failed: 2 },
  { day: 'Tue', completed: 45, failed: 3 },
  { day: 'Wed', completed: 52, failed: 1 },
  { day: 'Thu', completed: 48, failed: 4 },
  { day: 'Fri', completed: 61, failed: 2 },
  { day: 'Sat', completed: 55, failed: 3 },
  { day: 'Sun', completed: 42, failed: 2 },
];

const HOURLY_DATA = [
  { hour: '6am', orders: 5 }, { hour: '7am', orders: 12 }, { hour: '8am', orders: 22 },
  { hour: '9am', orders: 35 }, { hour: '10am', orders: 42 }, { hour: '11am', orders: 38 },
  { hour: '12pm', orders: 55 }, { hour: '1pm', orders: 48 }, { hour: '2pm', orders: 32 },
  { hour: '3pm', orders: 28 }, { hour: '4pm', orders: 35 }, { hour: '5pm', orders: 45 },
  { hour: '6pm', orders: 58 }, { hour: '7pm', orders: 62 }, { hour: '8pm', orders: 52 },
  { hour: '9pm', orders: 38 }, { hour: '10pm', orders: 22 }, { hour: '11pm', orders: 8 },
];

const FAILURE_REASONS = [
  { name: 'Customer Not Home', value: 35, color: '#ff3366' },
  { name: 'Address Mismatch', value: 25, color: '#ff6b35' },
  { name: 'Vehicle Breakdown', value: 15, color: '#fbbf24' },
  { name: 'Traffic Delay', value: 12, color: '#a855f7' },
  { name: 'Other', value: 13, color: '#5a6d8a' },
];

const RIDER_PERFORMANCE = [
  { name: 'Sipho M.', deliveries: 89, avgTime: 28, rating: 4.9 },
  { name: 'Thabo N.', deliveries: 85, avgTime: 30, rating: 4.9 },
  { name: 'Lerato D.', deliveries: 78, avgTime: 32, rating: 4.8 },
  { name: 'Nokuthula K.', deliveries: 72, avgTime: 31, rating: 4.8 },
  { name: 'Kgosi S.', deliveries: 68, avgTime: 35, rating: 4.6 },
];

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(56, 78, 119, 0.35)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#e8edf5',
  fontSize: '0.8rem',
};

export default function Charts() {
  return (
    <div>
      {/* Top Stats Row */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Deliveries', value: '341', change: '+12%', accent: 'cyan', icon: '📦' },
          { label: 'Success Rate', value: '95.3%', change: '+2.1%', accent: 'green', icon: '✅' },
          { label: 'Avg Time', value: '34 min', change: '-3 min', accent: 'purple', icon: '⏱️' },
          { label: 'Monthly Revenue', value: 'R 1.2m', change: '+8%', accent: 'orange', icon: '💰' },
        ].map((s) => (
          <div key={s.label} className="glass-card stat-card" style={{ '--stat-accent': `var(--accent-${s.accent})` } as React.CSSProperties}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-change positive">{s.change}</div>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Delivery Trends */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>📈 Delivery Trends (This Week)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={DELIVERY_TRENDS}>
              <defs>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,78,119,0.2)" />
              <XAxis dataKey="day" stroke="#5a6d8a" fontSize={12} />
              <YAxis stroke="#5a6d8a" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="completed" stroke="#00ff88" fill="url(#gradGreen)" strokeWidth={2} name="Completed" />
              <Area type="monotone" dataKey="failed" stroke="#ff3366" fill="url(#gradRed)" strokeWidth={2} name="Failed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Breakdown */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🔴 Failure Reasons</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={FAILURE_REASONS} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {FAILURE_REASONS.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {FAILURE_REASONS.map((r) => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{r.name}</span>
                <span style={{ fontWeight: 600 }}>{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Hourly Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🕐 Order Volume by Hour</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={HOURLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,78,119,0.2)" />
              <XAxis dataKey="hour" stroke="#5a6d8a" fontSize={10} />
              <YAxis stroke="#5a6d8a" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rider Leaderboard */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🏆 Top Riders (This Week)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {RIDER_PERFORMANCE.map((rider, i) => (
              <div key={rider.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-full)',
                  background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rider.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rider.deliveries} deliveries · {rider.avgTime}m avg · ⭐ {rider.rating}
                  </div>
                </div>
                <div style={{ width: 80 }}>
                  <div style={{ height: 4, borderRadius: 'var(--radius-full)', background: 'var(--border-primary)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${(rider.deliveries / 89) * 100}%`,
                      background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))',
                      borderRadius: 'var(--radius-full)',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
