'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket';

export interface RiderPosition {
  riderId: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  vehicle: string;
  timestamp: number;
}

export function useRiderLocations() {
  const [riders, setRiders] = useState<Record<string, RiderPosition>>({});
  const ridersRef = useRef<Record<string, RiderPosition>>({});

  useEffect(() => {
    const socket = getSocket();

    // Handle initial rider data
    socket.on('riders:initial', (initialRiders: Array<{ id: string; name: string; lat: number; lng: number; status: string; vehicle: string }>) => {
      const map: Record<string, RiderPosition> = {};
      initialRiders.forEach((r) => {
        map[r.id] = {
          riderId: r.id,
          name: r.name,
          lat: r.lat,
          lng: r.lng,
          status: r.status,
          vehicle: r.vehicle,
          timestamp: Date.now(),
        };
      });
      ridersRef.current = map;
      setRiders({ ...map });
    });

    // Handle batch position updates
    socket.on('riders:positions', (positions: RiderPosition[]) => {
      const updated = { ...ridersRef.current };
      positions.forEach((pos) => {
        updated[pos.riderId] = pos;
      });
      ridersRef.current = updated;
      setRiders({ ...updated });
    });

    // Handle individual location updates
    socket.on('rider:location', (data: { riderId: string; lat: number; lng: number; timestamp: number }) => {
      const updated = { ...ridersRef.current };
      if (updated[data.riderId]) {
        updated[data.riderId] = {
          ...updated[data.riderId],
          lat: data.lat,
          lng: data.lng,
          timestamp: data.timestamp,
        };
        ridersRef.current = updated;
        setRiders({ ...updated });
      }
    });

    // Handle status changes
    socket.on('rider:status', (data: { riderId: string; status: string }) => {
      const updated = { ...ridersRef.current };
      if (updated[data.riderId]) {
        updated[data.riderId] = { ...updated[data.riderId], status: data.status };
        ridersRef.current = updated;
        setRiders({ ...updated });
      }
    });

    return () => {
      socket.off('riders:initial');
      socket.off('riders:positions');
      socket.off('rider:location');
      socket.off('rider:status');
    };
  }, []);

  const riderList = Object.values(riders);
  const onlineCount = riderList.filter((r) => r.status !== 'OFFLINE').length;

  return { riders, riderList, onlineCount };
}

export default useRiderLocations;
