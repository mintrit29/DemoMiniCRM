"use client";

import { Fragment, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Order = {
  id: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    product?: { name: string };
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="border-b-2 border-ink pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Lịch sử đơn hàng</h1>
        <p className="font-mono text-sm opacity-60">Danh sách giao dịch đã chốt</p>
      </div>

      <div className="card-brutal">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-ink text-white uppercase">
                <th className="px-6 py-4 font-bold">Mã đơn</th>
                <th className="px-6 py-4 font-bold">Thời gian</th>
                <th className="px-6 py-4 text-right font-bold">Tạm tính</th>
                <th className="px-6 py-4 text-right font-bold text-laser">Giảm</th>
                <th className="px-6 py-4 text-right font-bold text-highlighter">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center uppercase opacity-50">
                    <Loader2 className="mr-2 inline-block animate-spin" /> Đang tải...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center uppercase opacity-50">
                    Chưa có đơn hàng
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="group cursor-pointer transition-colors hover:bg-highlighter"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-6 py-4 font-bold">#{order.id.toString().padStart(6, "0")}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                      <td className="px-6 py-4 text-right opacity-60">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-6 py-4 text-right text-laser">-{formatCurrency(order.discountAmount)}</td>
                      <td className="px-6 py-4 text-right text-lg font-bold">{formatCurrency(order.finalAmount)}</td>
                    </tr>
                    {expanded === order.id && (
                      <tr key={`${order.id}-items`}>
                        <td colSpan={5} className="border-b-2 border-ink p-0">
                          <div className="bg-ink/5 p-6 font-mono text-sm">
                            <div className="mb-4 border-b border-ink/20 pb-2 text-xs font-bold uppercase tracking-widest opacity-60">
                              Chi tiết đơn hàng
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                  <div className="flex gap-4">
                                    <span className="w-8 text-right opacity-60">{item.quantity}x</span>
                                    <span className="font-bold uppercase">{item.product?.name ?? "Sản phẩm"}</span>
                                  </div>
                                  <span className="opacity-80">{formatCurrency(item.lineTotal)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
