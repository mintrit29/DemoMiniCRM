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
      icon: <Wallet size={24} />,
      color: "text-ink",
    },
    { label: "Đơn hôm nay", value: data?.ordersToday ?? 0, icon: <Receipt size={24} />, color: "text-ink" },
    { label: "Sản phẩm", value: data?.productCount ?? 0, icon: <Package size={24} />, color: "text-ink" },
    { label: "Tồn kho thấp", value: data?.lowStockCount ?? 0, icon: <AlertTriangle size={24} />, color: "text-laser" },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="border-b-2 border-ink pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Tổng quan hệ thống</h1>
        <p className="font-mono text-sm opacity-60">Tình hình bán hàng và tồn kho trong ngày</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`card-brutal relative p-6 ${
              index === 3 && (data?.lowStockCount ?? 0) > 0 ? "bg-highlighter" : ""
            }`}
          >
            <div className={`brutal-border mb-6 flex h-12 w-12 items-center justify-center bg-white ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="mb-2 font-mono text-xs uppercase opacity-60">{stat.label}</div>
            <div className="font-mono text-3xl font-bold tracking-tight">{stat.value}</div>
            <div className="absolute right-2 top-2 flex gap-1">
              <div className="h-2 w-2 rounded-full bg-ink/20" />
              <div className="h-2 w-2 rounded-full bg-ink/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 border-t-2 border-ink pt-8 sm:grid-cols-2">
        <Link href="/pos" className="card-brutal group flex items-center justify-between p-8 transition-colors hover:bg-ink hover:text-white">
          <div>
            <h2 className="text-2xl font-bold uppercase">Mở quầy bán hàng</h2>
            <p className="mt-2 font-mono text-sm opacity-60 transition-opacity group-hover:opacity-100">Tạo giao dịch mới</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current transition-transform group-hover:scale-110">
            <ArrowRight size={24} />
          </div>
        </Link>
        <Link href="/products" className="card-brutal group flex items-center justify-between p-8 transition-colors hover:bg-highlighter">
          <div>
            <h2 className="text-2xl font-bold uppercase">Quản lý kho</h2>
            <p className="mt-2 font-mono text-sm opacity-60">Cập nhật sản phẩm và tồn kho</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current transition-transform group-hover:scale-110">
            <ShoppingCart size={24} />
          </div>
        </Link>
      </div>
    </div>
  );
}
