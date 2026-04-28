import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 86400000);

    // Get counts
    const [totalOrders, activeOrders, completedToday, failedToday, totalRiders, onlineRiders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] } } }),
      prisma.order.count({ where: { status: 'DELIVERED', deliveredAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: 'FAILED', failedAt: { gte: todayStart } } }),
      prisma.rider.count({ where: { isActive: true } }),
      prisma.rider.count({ where: { status: 'ONLINE' } }),
    ]);

    // Average delivery time (from completed deliveries)
    const deliveries = await prisma.delivery.findMany({
      where: { status: 'COMPLETED', completedAt: { gte: weekAgo } },
      select: { actualMins: true },
    });
    const avgTime = deliveries.length > 0
      ? Math.round(deliveries.reduce((s, d) => s + (d.actualMins || 0), 0) / deliveries.length)
      : 0;

    // Success rate
    const weekOrders = await prisma.order.count({
      where: { createdAt: { gte: weekAgo }, status: { in: ['DELIVERED', 'FAILED'] } },
    });
    const weekDelivered = await prisma.order.count({
      where: { createdAt: { gte: weekAgo }, status: 'DELIVERED' },
    });
    const successRate = weekOrders > 0 ? Math.round((weekDelivered / weekOrders) * 1000) / 10 : 100;

    return NextResponse.json({
      stats: {
        totalOrders,
        activeOrders,
        completedToday,
        failedToday,
        avgDeliveryTime: avgTime,
        successRate,
        activeRiders: onlineRiders,
        totalRiders,
        pendingOrders: await prisma.order.count({ where: { status: 'PENDING' } }),
        inTransitOrders: await prisma.order.count({ where: { status: 'IN_TRANSIT' } }),
      },
    });
  } catch (error) {
    console.error('[API] GET /analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
