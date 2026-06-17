import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini POS",
  description: "Hệ thống quản lý bán hàng mini",
};

const navItems = [
  { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
  { name: "POS", href: "/pos", icon: <ShoppingCart size={20} /> },
  { name: "Sản phẩm", href: "/products", icon: <Package size={20} /> },
  { name: "Đơn hàng", href: "/orders", icon: <ClipboardList size={20} /> },
  { name: "Báo cáo", href: "/reports", icon: <BarChart3 size={20} /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-800" suppressHydrationWarning>
        <div className="flex min-h-screen">
          <aside className="fixed hidden h-full w-64 border-r border-slate-200 bg-white md:block">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-700">Mini POS</h1>
              <p className="mt-1 text-xs text-slate-500">Quản lý cửa hàng tiện lợi</p>
            </div>
            <nav className="mt-4 space-y-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg p-3 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-200 bg-white p-2 md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 text-slate-500">
                {item.icon}
                <span className="mt-1 text-[10px]">{item.name}</span>
              </Link>
            ))}
          </nav>

          <main className="mb-20 flex-1 p-4 md:mb-0 md:ml-64 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
