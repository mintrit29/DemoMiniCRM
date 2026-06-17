import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini POS",
  description: "Hệ thống quản lý bán hàng mini",
};

const navItems = [
  { name: "Tổng quan", href: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Bán hàng", href: "/pos", icon: <ShoppingCart size={20} /> },
  { name: "Sản phẩm", href: "/products", icon: <Package size={20} /> },
  { name: "Đơn hàng", href: "/orders", icon: <ClipboardList size={20} /> },
  { name: "Báo cáo", href: "/reports", icon: <BarChart3 size={20} /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-thermal text-ink" suppressHydrationWarning>
        <div className="flex min-h-screen">
          <aside className="fixed z-10 hidden h-full w-64 border-r-2 border-ink bg-white shadow-[4px_0_0_0_rgba(17,17,16,1)] md:block">
            <div className="border-b-2 border-ink p-6">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Mini POS</h1>
              <p className="mt-1 font-mono text-xs opacity-60">HỆ THỐNG BÁN HÀNG</p>
            </div>
            <nav className="mt-6 space-y-2 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="brutal-border flex items-center gap-3 p-3 font-bold uppercase tracking-wider text-ink transition-all hover:translate-x-1 hover:bg-highlighter"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t-2 border-ink bg-white p-2 md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 text-ink hover:text-laser">
                {item.icon}
                <span className="mt-1 text-[10px] font-bold uppercase">{item.name}</span>
              </Link>
            ))}
          </nav>

          <main className="mb-20 flex-1 p-4 md:mb-0 md:ml-64 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
