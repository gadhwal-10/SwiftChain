'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { useSocket } from '@/hooks/useSocket';

export default function Sidebar() {
  const pathname = usePathname();
  const { isConnected } = useSocket();

  const mainItems = NAV_ITEMS.filter((n) => n.section === 'main');
  const insightItems = NAV_ITEMS.filter((n) => n.section === 'insights');
  const systemItems = NAV_ITEMS.filter((n) => n.section === 'system');

  return (
    <aside className="sidebar" id="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚡</div>
        <span className="sidebar-brand-text">Tshwane Logistics</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Operations</div>
        {mainItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Orders' && (
                <span className="sidebar-link-badge">6</span>
              )}
            </Link>
          );
        })}

        <div className="sidebar-section-title">Insights</div>
        {insightItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="sidebar-section-title">System</div>
        {systemItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
          <div
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isConnected ? 'var(--accent-green)' : 'var(--accent-red)',
              boxShadow: isConnected ? 'var(--shadow-glow-green)' : 'var(--shadow-glow-red)',
            }}
          />
          <span style={{ color: 'var(--text-muted)' }}>
            {isConnected ? 'System Online' : 'Connecting...'}
          </span>
        </div>
      </div>
    </aside>
  );
}
