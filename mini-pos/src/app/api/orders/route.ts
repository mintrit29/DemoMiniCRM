import { calculateOrderAmount, type DiscountType } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type OrderRequestItem = {
  productId: number;
  quantity: number;
};

function validateOrder(body: unknown) {
  const data = body as {
    items?: unknown;
    discountType?: unknown;
    discountValue?: unknown;
  };

  if (!Array.isArray(data.items) || data.items.length === 0) return null;

  const items = data.items.map((item) => {
    const value = item as Partial<OrderRequestItem>;
    return {
      productId: Number(value.productId),
      quantity: Number(value.quantity),
    };
  });

  if (
    items.some(
      (item) =>
        !Number.isInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    )
  ) {
    return null;
  }

  const discountType: DiscountType =
    data.discountType === "PERCENT" || data.discountType === "AMOUNT" ? data.discountType : null;
  const discountValue = Number(data.discountValue ?? 0);

  if (!Number.isInteger(discountValue) || discountValue < 0) return null;
  if (discountType === "PERCENT" && discountValue > 100) return null;

  const merged = new Map<number, number>();
  for (const item of items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return {
    items: Array.from(merged, ([productId, quantity]) => ({ productId, quantity })),
    discountType,
    discountValue,
  };
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = validateOrder(body);

    if (!validated) {
      return NextResponse.json({ error: "Dữ liệu đơn hàng không hợp lệ" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: validated.items.map((item) => item.productId) } },
      });

      if (products.length !== validated.items.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const productMap = new Map(products.map((product) => [product.id, product]));
      const orderItems = validated.items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new Error("PRODUCT_NOT_FOUND");
        if (product.stock < item.quantity) throw new Error("INSUFFICIENT_STOCK");

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
        };
      });

      const totals = calculateOrderAmount({
        items: orderItems,
        discountType: validated.discountType,
        discountValue: validated.discountValue,
      });

      const created = await tx.order.create({
        data: {
          totalAmount: totals.totalAmount,
          discountType: validated.discountType,
          discountValue: validated.discountValue,
          discountAmount: totals.discountAmount,
          finalAmount: totals.finalAmount,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of validated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Không đủ tồn kho để chốt đơn" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
