"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Package, Receipt, ShoppingCart, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Dashboard = {
  revenueToday: number;
  ordersToday: number;
  productCount: number;
  lowStockCount: number;
};

export default function Home() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const stats = [
    {
      label: "Doanh thu hôm nay",
      value: formatCurrency(data?.revenueToday ?? 0),
      icon: <Wallet size={20} />,
    },
    { label: "Đơn hôm nay", value: data?.ordersToday ?? 0, icon: <Receipt size={20} /> },
    { label: "Sản phẩm", value: data?.productCount ?? 0, icon: <Package size={20} /> },
    { label: "Tồn kho thấp", value: data?.lowStockCount ?? 0, icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Tổng quan bán hàng và tồn kho trong ngày.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-pastel p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              {stat.icon}
            </div>
            <div className="text-sm text-slate-500">{stat.label}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/pos" className="card-pastel group p-6 transition hover:border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart size={20} /> Bán hàng
              </div>
              <p className="mt-2 text-sm text-slate-500">Tạo đơn mới, áp dụng giảm giá và chốt đơn.</p>
            </div>
            <ArrowRight className="text-slate-400 transition group-hover:translate-x-1" size={22} />
          </div>
        </Link>
        <Link href="/products" className="card-pastel group p-6 transition hover:border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Package size={20} /> Quản lý sản phẩm
              </div>
              <p className="mt-2 text-sm text-slate-500">Thêm, sửa, xóa sản phẩm và kiểm tra tồn kho.</p>
            </div>
            <ArrowRight className="text-slate-400 transition group-hover:translate-x-1" size={22} />
          </div>
        </Link>
      </div>
    </div>
  );
}
