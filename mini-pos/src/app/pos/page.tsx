"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { calculateOrderAmount, formatCurrency, type DiscountType } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>(null);
  const [discountValue, setDiscountValue] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts().catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totals = useMemo(
    () =>
      calculateOrderAmount({
        items: cart.map((item) => ({ quantity: item.quantity, unitPrice: item.price })),
        discountType,
        discountValue: Number(discountValue || 0),
      }),
    [cart, discountType, discountValue]
  );

  function maxQuantity(product: Product) {
    return product.stock;
  }

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      setMessage({ type: "error", text: "Sản phẩm đã hết hàng" });
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (!existing) return [...current, { ...product, quantity: 1 }];
      if (existing.quantity >= maxQuantity(product)) {
        setMessage({ type: "error", text: "Không đủ tồn kho để thêm vào giỏ" });
        return current;
      }
      return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== productId) return item;
          return { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  async function checkout() {
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Giỏ hàng đang trống" });
      return;
    }

    setCheckoutLoading(true);
    setMessage(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        discountType,
        discountValue: Number(discountValue || 0),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage({ type: "error", text: data.error ?? "Không đủ tồn kho để chốt đơn" });
      setCheckoutLoading(false);
      return;
    }

    setCart([]);
    setDiscountType(null);
    setDiscountValue("");
    setMessage({ type: "success", text: "Chốt đơn thành công" });
    await loadProducts();
    setCheckoutLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">POS bán hàng</h1>
        <p className="text-sm text-slate-500">Chọn sản phẩm, nhập số lượng, áp dụng giảm giá và chốt đơn.</p>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="card-pastel p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="input-pastel pl-10"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <Loader2 className="mr-2 inline-block animate-spin" /> Đang tải sản phẩm...
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="font-semibold text-slate-900">{product.name}</div>
                  <div className="mt-2 text-sm text-slate-500">{formatCurrency(product.price)}</div>
                  <div className="mt-3 text-xs font-medium text-slate-500">Tồn kho: {product.stock}</div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400">Không có sản phẩm phù hợp</div>
              )}
            </div>
          )}
        </section>

        <aside className="card-pastel h-fit p-4">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingCart size={20} /> Giỏ hàng
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-400">Giỏ hàng đang trống</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-slate-500">{formatCurrency(item.price)}</div>
                    </div>
                    <button
                      aria-label="Xóa khỏi giỏ"
                      onClick={() => updateQuantity(item.id, 0)}
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Giảm số lượng"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        className="h-9 w-16 rounded-lg border border-slate-200 text-center"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      />
                      <button
                        aria-label="Tăng số lượng"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDiscountType(discountType === "PERCENT" ? null : "PERCENT")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  discountType === "PERCENT" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200"
                }`}
              >
                Giảm %
              </button>
              <button
                onClick={() => setDiscountType(discountType === "AMOUNT" ? null : "AMOUNT")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  discountType === "AMOUNT" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200"
                }`}
              >
                Giảm tiền
              </button>
            </div>
            {discountType && (
              <input
                className="input-pastel"
                type="number"
                min="0"
                max={discountType === "PERCENT" ? 100 : undefined}
                placeholder={discountType === "PERCENT" ? "Nhập phần trăm giảm" : "Nhập số tiền giảm"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng tiền</span>
                <span>{formatCurrency(totals.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giảm giá</span>
                <span>{formatCurrency(totals.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Thành tiền</span>
                <span>{formatCurrency(totals.finalAmount)}</span>
              </div>
            </div>
            <button onClick={checkout} disabled={checkoutLoading} className="btn-pastel-emerald w-full">
              {checkoutLoading ? <Loader2 className="animate-spin" size={18} /> : "Chốt đơn"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
