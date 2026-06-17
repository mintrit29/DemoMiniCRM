import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function validateProductInput(body: unknown) {
  const data = body as { name?: unknown; price?: unknown; stock?: unknown };
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const price = Number(data.price);
  const stock = Number(data.stock);

  if (!name || !Number.isInteger(price) || !Number.isInteger(stock) || price < 0 || stock < 0) {
    return null;
  }

  return { name, price, stock };
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = validateProductInput(body);

    if (!validated) {
      return NextResponse.json({ error: "Dữ liệu sản phẩm không hợp lệ" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: validated,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
