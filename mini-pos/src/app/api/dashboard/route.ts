import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function GET() {
  try {
    const { start, end } = todayRange();
    const [todayOrders, productCount, lowStockCount] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: start, lt: end } },
        _sum: { finalAmount: true },
        _count: true,
      }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
    ]);

    return NextResponse.json({
      revenueToday: todayOrders._sum.finalAmount ?? 0,
      ordersToday: todayOrders._count,
      productCount,
      lowStockCount,
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
