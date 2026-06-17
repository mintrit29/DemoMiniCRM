import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function validateProductInput(body: unknown) {
  const data = body as { name?: unknown; price?: unknown; stock?: unknown };
  const next: { name?: string; price?: number; stock?: number } = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) return null;
    next.name = data.name.trim();
  }
  if (data.price !== undefined) {
    const price = Number(data.price);
    if (!Number.isInteger(price) || price < 0) return null;
    next.price = price;
  }
  if (data.stock !== undefined) {
    const stock = Number(data.stock);
    if (!Number.isInteger(stock) || stock < 0) return null;
    next.stock = stock;
  }

  return Object.keys(next).length ? next : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const validated = validateProductInput(body);

    if (!id || !validated) {
      return NextResponse.json({ error: "Dữ liệu sản phẩm không hợp lệ" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) {
      return NextResponse.json({ error: "Mã sản phẩm không hợp lệ" }, { status: 400 });
    }

    const orderItems = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItems > 0) {
      return NextResponse.json(
        { error: "Sản phẩm đã có trong đơn hàng, không thể xóa để giữ lịch sử" },
        { status: 409 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
