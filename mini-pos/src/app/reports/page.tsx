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
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="border-b-2 border-ink pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Báo cáo cuối ngày</h1>
        <p className="font-mono text-sm opacity-60">Doanh thu và giao dịch hôm nay</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-brutal p-8">
          <div className="brutal-border mb-6 flex h-12 w-12 items-center justify-center bg-ink text-white">
            <Wallet size={24} />
          </div>
          <div className="mb-2 font-mono text-xs uppercase opacity-60">Doanh thu hôm nay</div>
          <div className="font-mono text-4xl font-bold tracking-tight">{formatCurrency(report?.revenue ?? 0)}</div>
        </div>
        <div className="card-brutal p-8">
          <div className="brutal-border mb-6 flex h-12 w-12 items-center justify-center bg-highlighter text-ink">
            <Receipt size={24} />
          </div>
          <div className="mb-2 font-mono text-xs uppercase opacity-60">Số đơn hôm nay</div>
          <div className="font-mono text-4xl font-bold tracking-tight">{report?.orderCount ?? 0}</div>
        </div>
      </div>

      <div className="card-brutal mt-8">
        <div className="border-b-2 border-ink bg-ink p-4 text-sm font-bold uppercase tracking-widest text-white">
          Sổ giao dịch hôm nay
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-ink/5 uppercase">
                <th className="px-6 py-4 font-bold">Mã đơn</th>
                <th className="px-6 py-4 font-bold">Thời gian</th>
                <th className="px-6 py-4 text-right font-bold text-laser">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {(report?.orders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center uppercase opacity-50">
                    Chưa có giao dịch trong ngày
                  </td>
                </tr>
              ) : (
                report?.orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-highlighter">
                    <td className="px-6 py-4 font-bold">#{order.id.toString().padStart(6, "0")}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleTimeString("vi-VN")}</td>
                    <td className="px-6 py-4 text-right text-base font-bold">{formatCurrency(order.finalAmount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
