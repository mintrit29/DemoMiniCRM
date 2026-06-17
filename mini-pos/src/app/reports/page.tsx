"use client";

import { useEffect, useState } from "react";
import { Receipt, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Report = {
  revenue: number;
  orderCount: number;
  orders: Array<{ id: number; finalAmount: number; createdAt: string }>;
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/reports/today")
      .then((res) => res.json())
      .then(setReport)
      .catch(() => setReport(null));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Báo cáo doanh thu</h1>
        <p className="text-sm text-slate-500">Doanh thu và số đơn trong ngày hôm nay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-pastel p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Wallet size={20} />
          </div>
          <div className="text-sm text-slate-500">Doanh thu hôm nay</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(report?.revenue ?? 0)}</div>
        </div>
        <div className="card-pastel p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Receipt size={20} />
          </div>
          <div className="text-sm text-slate-500">Số đơn hôm nay</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{report?.orderCount ?? 0}</div>
        </div>
      </div>

      <div className="card-pastel overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm uppercase text-slate-400">
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(report?.orders ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-slate-400">
                  Chưa có đơn trong ngày
                </td>
              </tr>
            ) : (
              report?.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 font-semibold">#{order.id}</td>
                  <td className="px-4 py-4">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="px-4 py-4 text-right font-bold">{formatCurrency(order.finalAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
