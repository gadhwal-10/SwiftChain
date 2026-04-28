'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load Recharts to avoid SSR issues
const LazyCharts = dynamic(() => import('@/components/analytics/Charts'), { ssr: false });

export default function AnalyticsPage() {
  return (
    <div id="analytics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Insights</h1>
          <p className="page-subtitle">Delivery performance metrics and operational intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-ghost">Today</button>
          <button className="btn btn-sm btn-primary">7 Days</button>
          <button className="btn btn-sm btn-ghost">30 Days</button>
        </div>
      </div>

      <LazyCharts />
    </div>
  );
}
