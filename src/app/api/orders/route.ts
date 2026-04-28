import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const riderId = searchParams.get('riderId');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (riderId) where.riderId = riderId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { product: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { rider: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ orders, total: orders.length });
  } catch (error) {
    console.error('[API] GET /orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName, customerPhone, product, quantity = 1,
      priority = 'NORMAL', latitude, longitude, address,
      notes, source = 'MANUAL', weight = 0.5,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !product || !latitude || !longitude || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get default warehouse
    let warehouse = await prisma.warehouse.findFirst({ where: { isActive: true } });
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: {
          name: process.env.DEFAULT_WAREHOUSE_NAME || 'Tshwane Dispatch Hub',
          latitude: parseFloat(process.env.DEFAULT_WAREHOUSE_LAT || '-25.7479'),
          longitude: parseFloat(process.env.DEFAULT_WAREHOUSE_LNG || '28.2293'),
          address: process.env.DEFAULT_WAREHOUSE_ADDRESS || 'Pretoria CBD, Pretoria, South Africa',
        },
      });
    }

    // Generate order number
    const ts = Date.now().toString(36).toUpperCase().slice(-4);
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `SC-${ts}-${rand}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        product,
        quantity,
        weight,
        priority,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        notes,
        source,
        warehouseId: warehouse.id,
      },
      include: { rider: true },
    });

    // Create timeline event
    await prisma.deliveryEvent.create({
      data: { orderId: order.id, event: 'ORDER_CREATED' },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
