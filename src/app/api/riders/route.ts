import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = { isActive: true };
    if (status) where.status = status;

    const riders = await prisma.rider.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ riders, total: riders.length });
  } catch (error) {
    console.error('[API] GET /riders error:', error);
    return NextResponse.json({ error: 'Failed to fetch riders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, vehicleType = 'BIKE', vehiclePlate, maxCapacity = 5 } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const rider = await prisma.rider.create({
      data: { name, phone, email, vehicleType, vehiclePlate, maxCapacity },
    });

    return NextResponse.json({ rider }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /riders error:', error);
    return NextResponse.json({ error: 'Failed to create rider' }, { status: 500 });
  }
}
