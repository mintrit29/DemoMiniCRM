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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lịch sử đơn hàng</h1>
        <p className="text-sm text-slate-500">Xem các đơn đã chốt và chi tiết sản phẩm.</p>
      </div>

      <div className="card-pastel overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm uppercase text-slate-400">
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-right">Tổng</th>
              <th className="px-4 py-3 text-right">Giảm</th>
              <th className="px-4 py-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Loader2 className="mr-2 inline-block animate-spin" /> Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Chưa có đơn hàng
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-4 font-semibold">#{order.id}</td>
                    <td className="px-4 py-4">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(order.discountAmount)}</td>
                    <td className="px-4 py-4 text-right font-bold">{formatCurrency(order.finalAmount)}</td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-items`}>
                      <td colSpan={5} className="bg-slate-50 px-4 py-4">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between rounded-lg bg-white p-3 text-sm">
                              <span>
                                {item.product?.name ?? "Sản phẩm"} x {item.quantity}
                              </span>
                              <span>
                                {formatCurrency(item.unitPrice)} = {formatCurrency(item.lineTotal)}
                              </span>
                            </div>
                          ))}
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
  );
}
