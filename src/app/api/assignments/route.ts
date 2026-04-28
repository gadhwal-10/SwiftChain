import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { rankRidersForOrder, estimateDeliveryTime } from '@/services/assignmentEngine';
import type { Rider } from '@/types/rider';
import type { Order } from '@/types/order';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, manualRiderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { warehouse: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Order is not in PENDING status' }, { status: 400 });
    }

    let selectedRiderId: string;

    if (manualRiderId) {
      // Manual assignment
      selectedRiderId = manualRiderId;
    } else {
      // Smart assignment
      const allRiders = await prisma.rider.findMany({ where: { isActive: true } });

      const rankedRiders = rankRidersForOrder(
        allRiders as unknown as Rider[],
        order as unknown as Order,
        order.warehouse.latitude,
        order.warehouse.longitude
      );

      if (rankedRiders.length === 0) {
        return NextResponse.json({ error: 'No available riders' }, { status: 409 });
      }

      selectedRiderId = rankedRiders[0].id;
    }

    // Assign the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'ASSIGNED',
        riderId: selectedRiderId,
        assignedAt: new Date(),
      },
      include: { rider: true },
    });

    // Update rider load
    await prisma.rider.update({
      where: { id: selectedRiderId },
      data: { currentLoad: { increment: 1 }, status: 'BUSY' },
    });

    // Create timeline event
    await prisma.deliveryEvent.create({
      data: {
        orderId,
        riderId: selectedRiderId,
        event: 'RIDER_ASSIGNED',
        details: { method: manualRiderId ? 'MANUAL' : 'SMART' },
      },
    });

    return NextResponse.json({
      order: updatedOrder,
      assignment: { method: manualRiderId ? 'manual' : 'smart', riderId: selectedRiderId },
    });
  } catch (error) {
    console.error('[API] POST /assignments error:', error);
    return NextResponse.json({ error: 'Failed to assign order' }, { status: 500 });
  }
}
