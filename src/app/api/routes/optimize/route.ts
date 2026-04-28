import { NextResponse } from 'next/server';
import { optimizeRoute } from '@/services/routeOptimizer';
import type { Point } from '@/types/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { warehouse, destinations, vehicleType = 'BIKE' } = body;

    if (!warehouse || !destinations || !Array.isArray(destinations)) {
      return NextResponse.json({ error: 'warehouse and destinations[] are required' }, { status: 400 });
    }

    const warehousePoint: Point = {
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
      id: 'warehouse',
      label: 'Warehouse',
    };

    const destPoints: Point[] = destinations.map((d: { latitude: number; longitude: number; id?: string; label?: string }, i: number) => ({
      latitude: d.latitude,
      longitude: d.longitude,
      id: d.id || `stop-${i}`,
      label: d.label || `Stop ${i + 1}`,
    }));

    const result = optimizeRoute(warehousePoint, destPoints, vehicleType);

    return NextResponse.json({
      optimizedRoute: result,
      summary: {
        stops: result.waypoints.length,
        totalDistanceKm: result.totalDistanceKm,
        totalDurationMins: result.totalDurationMins,
        improvementPercent: result.improvementPercent,
      },
    });
  } catch (error) {
    console.error('[API] POST /routes/optimize error:', error);
    return NextResponse.json({ error: 'Failed to optimize route' }, { status: 500 });
  }
}
