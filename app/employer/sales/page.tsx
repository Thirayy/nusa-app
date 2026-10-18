"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface SaleItem {
  product_id: number;
  quantity: number;
}

export default function EmployerSalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SaleItem[]>([{ product_id: 0, quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1; // ID bisnis aktif untuk MVP

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiFetch<Product[]>(`/api/v1/businesses/${businessId}/products`);
        setProducts(data);
        if (data.length > 0) {
          setItems([{ product_id: data[0].id, quantity: 1 }]);
        }
      } catch (err: any) {
        setError("Gagal memuat produk untuk transaksi.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [businessId]);

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([...items, { product_id: products[0].id, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRecordSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/sales`, {
        method: "POST",
        body: JSON.stringify({ items }),
      });

      setSuccess("Transaksi penjualan berhasil dicatat!");
    } catch (err: any) {
      setError(err.message || "Gagal mencatat penjualan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Catat Penjualan Usaha</h1>
          <p className="text-sm text-gray-600 mt-1">Catat transaksi omzet produk harian secara real-time.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Memuat data produk...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Belum ada produk terdaftar. Silakan tambahkan produk di menu Produk terlebih dahulu.
            </div>
          ) : (
            <form onSubmit={handleRecordSales} className="space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700">Daftar Item Penjualan</label>
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, "product_id", Number(e.target.value))}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rp {Number(p.price).toLocaleString("id-ID")})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                      className="w-20 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                      placeholder="Qty"
                    />

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-medium text-[#28665A] hover:underline"
              >
                + Tambah Item Lain
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50 mt-4"
              >
                {submitting ? "Menyimpan..." : "Simpan Transaksi Penjualan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}