'use client';

import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

export default function MapPage() {
  return (
    <div id="map-page" style={{ margin: '-28px', height: 'calc(100vh - var(--topbar-height))' }}>
      <LiveMap height="100%" miniMode={false} />
    </div>
  );
}
