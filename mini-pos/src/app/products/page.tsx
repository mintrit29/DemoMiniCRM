"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-slate-500">Quản lý danh mục và tồn kho hiện tại.</p>
        </div>
        <button onClick={openCreate} className="btn-pastel-blue">
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="card-pastel p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="input-pastel pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm uppercase text-slate-400">
                <th className="px-4 py-3 font-medium">Tên sản phẩm</th>
                <th className="px-4 py-3 text-right font-medium">Giá bán</th>
                <th className="px-4 py-3 text-right font-medium">Tồn kho</th>
                <th className="px-4 py-3 text-right font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <Loader2 className="mr-2 inline-block animate-spin" /> Đang tải...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium">{product.name}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`rounded-lg px-2 py-1 text-xs font-bold ${
                          product.stock <= 5 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          aria-label="Sửa sản phẩm"
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          aria-label="Xóa sản phẩm"
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-rose-700 transition hover:bg-rose-50"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold">
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-600">Tên sản phẩm</span>
                  <input
                    required
                    className="input-pastel"
                    value={form.name}
                    onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-600">Giá bán</span>
                    <input
                      required
                      min="0"
                      type="number"
                      className="input-pastel"
                      value={form.price}
                      onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-600">Tồn kho</span>
                    <input
                      required
                      min="0"
                      type="number"
                      className="input-pastel"
                      value={form.stock}
                      onChange={(e) => setForm((current) => ({ ...current, stock: e.target.value }))}
                    />
                  </label>
                </div>
                {message && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-600 transition hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="btn-pastel-blue flex-1">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : editingProduct ? "Cập nhật" : "Thêm"}
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
