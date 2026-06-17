"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts().catch(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditingProduct(null);
    setForm({ name: "", price: "", stock: "" });
    setMessage("");
    setIsModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({ name: product.name, price: String(product.price), stock: String(product.stock) });
    setMessage("");
    setIsModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Lỗi khi xóa sản phẩm");
      return;
    }
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    const res = await fetch(editingProduct ? `/api/products/${editingProduct.id}` : "/api/products", {
      method: editingProduct ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Vui lòng kiểm tra lại thông tin nhập");
      setSubmitting(false);
      return;
    }

    await fetchProducts();
    setSubmitting(false);
    setIsModalOpen(false);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 border-b-2 border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Sản phẩm</h1>
          <p className="font-mono text-sm opacity-60">Quản lý danh mục, giá bán và tồn kho</p>
        </div>
        <button onClick={openCreate} className="btn-laser px-6 py-3">
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="card-brutal">
        <div className="border-b-2 border-ink bg-ink/5 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="input-brutal bg-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-ink text-white uppercase">
                <th className="px-6 py-4 font-bold">Tên sản phẩm</th>
                <th className="px-6 py-4 text-right font-bold">Giá bán</th>
                <th className="px-6 py-4 text-right font-bold">Tồn kho</th>
                <th className="px-6 py-4 text-right font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center uppercase opacity-50">
                    <Loader2 className="mr-2 inline-block animate-spin" /> Đang tải...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center uppercase opacity-50">
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-highlighter">
                    <td className="px-6 py-4 font-sans text-base font-bold uppercase">{product.name}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`brutal-border inline-block px-3 py-1 font-bold ${
                          product.stock <= 5 ? "bg-laser text-white" : "bg-white"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          aria-label="Sửa sản phẩm"
                          onClick={() => openEdit(product)}
                          className="brutal-border bg-white p-2 transition-colors hover:bg-ink hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label="Xóa sản phẩm"
                          onClick={() => handleDelete(product.id)}
                          className="brutal-border bg-white p-2 transition-colors hover:bg-laser hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="brutal-border relative z-10 w-full max-w-md bg-white shadow-[12px_12px_0px_0px_rgba(17,17,16,1)]">
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink p-4 text-white">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="transition-colors hover:text-laser">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block font-mono text-sm font-bold uppercase">Tên sản phẩm</label>
                  <input
                    required
                    className="input-brutal"
                    value={form.name}
                    onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block font-mono text-sm font-bold uppercase">Giá bán</label>
                    <input
                      required
                      min="0"
                      type="number"
                      className="input-brutal"
                      value={form.price}
                      onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-sm font-bold uppercase">Tồn kho</label>
                    <input
                      required
                      min="0"
                      type="number"
                      className="input-brutal"
                      value={form.stock}
                      onChange={(e) => setForm((current) => ({ ...current, stock: e.target.value }))}
                    />
                  </div>
                </div>

                {message && <div className="brutal-border bg-laser p-3 font-mono text-sm font-bold uppercase text-white">{message}</div>}

                <div className="flex gap-4 border-t-2 border-dashed border-ink/30 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-neutral flex-1 py-3">
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="btn-laser flex-1 py-3">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : editingProduct ? "Cập nhật" : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
