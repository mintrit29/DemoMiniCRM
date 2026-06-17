export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export type DiscountType = "PERCENT" | "AMOUNT" | null;

export function calculateOrderAmount(params: {
  items: Array<{ quantity: number; unitPrice: number }>;
  discountType?: DiscountType;
  discountValue?: number;
}) {
  const totalAmount = params.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  let discountAmount = 0;

  if (params.discountType === "PERCENT") {
    discountAmount = Math.floor(totalAmount * (params.discountValue ?? 0) / 100);
  }

  if (params.discountType === "AMOUNT") {
    discountAmount = params.discountValue ?? 0;
  }

  discountAmount = Math.min(Math.max(discountAmount, 0), totalAmount);

  return {
    totalAmount,
    discountAmount,
    finalAmount: totalAmount - discountAmount,
  };
}
