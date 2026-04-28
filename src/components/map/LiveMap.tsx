'use client';

import { useEffect, useRef, useState } from 'react';
import { useRiderLocations, type RiderPosition } from '@/hooks/useRiderLocation';
import { MAP_CONFIG } from '@/lib/constants';
import L from 'leaflet';

interface LiveMapProps {
  height?: string;
  miniMode?: boolean;
}

const VEHICLE_EMOJIS: Record<string, string> = {
  BIKE: '🏍️',
  SMALL_TRUCK: '🚚',
  CARGO_TRUCK: '🛻',
};

const STATUS_COLORS: Record<string, string> = {
  ONLINE: '#00ff88',
  BUSY: '#ff6b35',
  ON_BREAK: '#fbbf24',
  OFFLINE: '#5a6d8a',
};

// Demo delivery destinations for map visualization
const DEMO_DESTINATIONS = [
  { lat: -25.7500, lng: 28.2333, label: 'Hatfield', status: 'IN_TRANSIT' },
  { lat: -25.7667, lng: 28.2500, label: 'Brooklyn', status: 'PENDING' },
  { lat: -25.7500, lng: 28.2000, label: 'Sunnyside', status: 'ASSIGNED' },
  { lat: -25.7333, lng: 28.2167, label: 'Arcadia', status: 'DELIVERED' },
  { lat: -25.7479, lng: 28.2293, label: 'Pretoria CBD', status: 'PENDING' },
];

function createRiderIcon(vehicle: string, status: string): L.DivIcon {
  const emoji = VEHICLE_EMOJIS[vehicle] || '🏍️';
  const color = STATUS_COLORS[status] || STATUS_COLORS.ONLINE;
  const pulse = status === 'ONLINE' || status === 'BUSY'
    ? `<div style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background:${color};animation:pulse-dot 2s ease-in-out infinite;"></div>`
    : '';

  return L.divIcon({
    className: 'custom-rider-marker',
    html: `
      <div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.9);border:2px solid ${color};border-radius:50%;font-size:18px;box-shadow:0 0 12px ${color}40;cursor:pointer;transition:transform 0.3s;">
        ${emoji}
        ${pulse}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
}

function createDestinationIcon(status: string): L.DivIcon {
  const colors: Record<string, string> = {
    PENDING: '#fbbf24',
    ASSIGNED: '#00d4ff',
    IN_TRANSIT: '#ff6b35',
    DELIVERED: '#00ff88',
  };
  const color = colors[status] || '#00d4ff';

  return L.divIcon({
    className: 'custom-dest-marker',
    html: `
      <div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.3);border-radius:50%;box-shadow:0 0 8px ${color}60;"></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

function createWarehouseIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-warehouse-marker',
    html: `
      <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#00d4ff,#00ff88);border-radius:12px;font-size:22px;box-shadow:0 0 20px rgba(0,212,255,0.4);animation:pulse-dot 3s ease-in-out infinite;">
        🏭
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26],
  });
}

export default function LiveMap({ height = '400px', miniMode = false }: LiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const { riderList } = useRiderLocations();
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CONFIG.defaultCenter,
      zoom: miniMode ? 11 : MAP_CONFIG.defaultZoom,
      zoomControl: !miniMode,
      attributionControl: !miniMode,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    });

    L.tileLayer(MAP_CONFIG.tileUrl, {
      attribution: MAP_CONFIG.tileAttribution,
      maxZoom: MAP_CONFIG.maxZoom,
    }).addTo(map);

    // Add warehouse marker
    const warehouseMarker = L.marker(MAP_CONFIG.defaultCenter, { icon: createWarehouseIcon() })
      .addTo(map)
      .bindPopup(`
        <div style="text-align:center;padding:4px;">
          <strong style="font-size:0.9rem;">🏭 Tshwane Dispatch Hub</strong>
          <br/><span style="font-size:0.75rem;color:#8b9dc3;">Pretoria CBD, Pretoria</span>
        </div>
      `);

    // Add warehouse radius ring
    L.circle(MAP_CONFIG.defaultCenter, {
      radius: 2000,
      color: '#00d4ff',
      fillColor: '#00d4ff',
      fillOpacity: 0.03,
      weight: 1,
      dashArray: '8, 4',
      opacity: 0.3,
    }).addTo(map);

    // Add destination markers
    DEMO_DESTINATIONS.forEach((dest) => {
      L.marker([dest.lat, dest.lng], { icon: createDestinationIcon(dest.status) })
        .addTo(map)
        .bindPopup(`
          <div style="padding:4px;">
            <strong style="font-size:0.85rem;">📍 ${dest.label}</strong>
            <br/><span style="font-size:0.75rem;color:#8b9dc3;">Status: ${dest.status}</span>
          </div>
        `);
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [miniMode]);

  // Update rider markers in real-time
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    const map = mapRef.current;

    riderList.forEach((rider) => {
      if (rider.status === 'OFFLINE' && !miniMode) return;

      const markerId = rider.riderId;
      const icon = createRiderIcon(rider.vehicle, rider.status);

      if (markersRef.current[markerId]) {
        // Smoothly animate marker to new position
        const marker = markersRef.current[markerId];
        const currentPos = marker.getLatLng();
        const targetPos = L.latLng(rider.lat, rider.lng);

        // Only move if position changed
        if (currentPos.lat !== targetPos.lat || currentPos.lng !== targetPos.lng) {
          marker.setLatLng(targetPos);
          marker.setIcon(icon);
        }
      } else {
        // Create new marker
        const marker = L.marker([rider.lat, rider.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="padding:4px;min-width:160px;">
              <strong style="font-size:0.9rem;">${VEHICLE_EMOJIS[rider.vehicle] || '🏍️'} ${rider.name}</strong>
              <br/><span style="font-size:0.75rem;color:#8b9dc3;">Status: ${rider.status}</span>
              <br/><span style="font-size:0.75rem;color:#8b9dc3;">Vehicle: ${rider.vehicle}</span>
            </div>
          `);

        markersRef.current[markerId] = marker;
      }
    });
  }, [riderList, isMapReady, miniMode]);

  return (
    <div
      ref={mapContainerRef}
      id="live-map"
      style={{
        height,
        width: '100%',
        borderRadius: miniMode ? 0 : 'var(--radius-lg)',
        position: 'relative',
      }}
    />
  );
}
