"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, ShoppingCart } from "lucide-react";
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

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  const totals = useMemo(
    () =>
      calculateOrderAmount({
        items: cart.map((item) => ({ quantity: item.quantity, unitPrice: item.price })),
        discountType,
        discountValue: Number(discountValue || 0),
      }),
    [cart, discountType, discountValue]
  );

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      setMessage({ type: "error", text: "Sản phẩm đã hết hàng" });
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (!existing) return [...current, { ...product, quantity: 1 }];
      if (existing.quantity >= product.stock) {
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
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex items-end justify-between border-b-2 border-ink pb-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Bán hàng</h1>
          <p className="font-mono text-sm opacity-60">Quầy POS tạo đơn nhanh</p>
        </div>
        {message && (
          <div
            className={`brutal-border px-3 py-1 font-mono text-sm font-bold uppercase ${
              message.type === "success" ? "bg-highlighter text-ink" : "bg-laser text-white"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        <section className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              className="input-brutal pl-10"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-center font-mono uppercase opacity-50">
              <Loader2 className="animate-spin" size={18} /> Đang tải sản phẩm...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="card-brutal p-4 text-left focus:outline-none focus:ring-4 focus:ring-highlighter disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="font-bold uppercase tracking-tight">{product.name}</div>
                  <div className="mt-2 font-mono text-lg">{formatCurrency(product.price)}</div>
                  <div className="mt-4 flex justify-between border-t border-dashed border-ink/20 pt-2 font-mono text-xs opacity-60">
                    <span>TỒN KHO</span>
                    <span>{product.stock}</span>
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center font-mono uppercase opacity-50">Không có sản phẩm</div>
              )}
            </div>
          )}
        </section>

        <aside className="brutal-border relative flex h-fit flex-col bg-white shadow-[8px_8px_0px_0px_rgba(17,17,16,1)]">
          <div
            className="h-3 w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 10px 12px, transparent 10px, #ffffff 11px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 -10px",
            }}
          />

          <div className="flex flex-col gap-6 p-6">
            <div className="text-center font-mono text-sm uppercase tracking-widest opacity-60">
              === Đơn hàng hiện tại ===
            </div>

            <div className="min-h-[300px] space-y-4 font-mono text-sm">
              {cart.length === 0 ? (
                <div className="py-12 text-center opacity-40">Giỏ hàng đang trống</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="flex items-start justify-between">
                      <div className="max-w-[180px] truncate font-bold uppercase">{item.name}</div>
                      <div>{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs opacity-60">
                      <div>
                        {item.quantity} x {formatCurrency(item.price)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-ink px-2 py-1 font-bold text-white hover:bg-laser">
                        -
                      </button>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-ink px-2 py-1 font-bold text-white hover:bg-highlighter hover:text-ink">
                        +
                      </button>
                      <button onClick={() => updateQuantity(item.id, 0)} className="btn-ghost ml-auto text-xs uppercase tracking-wider">
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 border-t-2 border-dashed border-ink pt-4 font-mono text-sm">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setDiscountType(discountType === "PERCENT" ? null : "PERCENT")}
                  className={`brutal-border flex-1 py-1 text-xs font-bold uppercase ${
                    discountType === "PERCENT" ? "bg-ink text-white" : "hover:bg-highlighter"
                  }`}
                >
                  Giảm %
                </button>
                <button
                  onClick={() => setDiscountType(discountType === "AMOUNT" ? null : "AMOUNT")}
                  className={`brutal-border flex-1 py-1 text-xs font-bold uppercase ${
                    discountType === "AMOUNT" ? "bg-ink text-white" : "hover:bg-highlighter"
                  }`}
                >
                  Giảm VND
                </button>
              </div>

              {discountType && (
                <input
                  className="input-brutal mb-4 px-2 py-2 text-right text-sm"
                  type="number"
                  min="0"
                  max={discountType === "PERCENT" ? 100 : undefined}
                  placeholder={discountType === "PERCENT" ? "0%" : "0 VND"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              )}

              <div className="flex justify-between opacity-80">
                <span>Tạm tính</span>
                <span>{formatCurrency(totals.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-laser opacity-80">
                <span>Giảm giá</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t-2 border-ink pt-2 text-xl font-bold">
                <span>Phải trả</span>
                <span>{formatCurrency(totals.finalAmount)}</span>
              </div>
            </div>

            <button onClick={checkout} disabled={checkoutLoading} className="btn-laser mt-4 w-full py-4 text-xl">
              {checkoutLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <ShoppingCart size={22} /> Chốt đơn
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
