import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        rider: true,
        delivery: true,
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[API] GET /orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, riderId, priority, failureReason } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (riderId) updateData.riderId = riderId;
    if (priority) updateData.priority = priority;

    // Handle status-specific timestamps
    if (status === 'ASSIGNED') updateData.assignedAt = new Date();
    if (status === 'PICKED_UP') updateData.pickedUpAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (status === 'FAILED') {
      updateData.failedAt = new Date();
      updateData.failureReason = failureReason || 'Unknown';
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { rider: true },
    });

    // Create timeline event
    if (status) {
      await prisma.deliveryEvent.create({
        data: {
          orderId: params.id,
          riderId: riderId || order.riderId,
          event: `STATUS_${status}`,
          details: body,
        },
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[API] PATCH /orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.deliveryEvent.deleteMany({ where: { orderId: params.id } });
    await prisma.delivery.deleteMany({ where: { orderId: params.id } });
    await prisma.order.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
