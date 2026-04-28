'use client';

import { useState, useEffect } from 'react';

export default function Topbar() {
  const [time, setTime] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    function updateTime() {
      setTime(new Date().toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }));
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar" id="topbar">
      <div className="topbar-left">
        <input
          type="text"
          className="topbar-search"
          placeholder="Search fleet, orders or addresses..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          id="global-search"
        />
      </div>

      <div className="topbar-right">
        <span className="topbar-clock">{time}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div className="topbar-status-dot" />
          <span>Live</span>
        </div>

        <button className="topbar-notification" id="notifications-btn" aria-label="Notifications">
          🔔
          <span className="topbar-notification-count">3</span>
        </button>

        <div
          style={{
            width: 34, height: 34, borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
          }}
          id="user-avatar"
        >
          A
        </div>
      </div>
    </header>
  );
}
