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
    const [summary, orders] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: start, lt: end } },
        _sum: { finalAmount: true },
        _count: true,
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: start, lt: end } },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      revenue: summary._sum.finalAmount ?? 0,
      orderCount: summary._count,
      orders,
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
