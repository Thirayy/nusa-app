"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function EmployerSalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "" >("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiFetch<Product[]>(`/api/v1/businesses/${businessId}/products`);
        setProducts(data);
        if (data.length > 0) setSelectedProductId(data[0].id);
      } catch (err: any) {
        setError(err.message || "Gagal memuat produk.");
      }
    }
    fetchProducts();
  }, [businessId]);

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProductId) {
      setError("Pilih produk terlebih dahulu.");
      return;
    }

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/sales`, {
        method: "POST",
        body: JSON.stringify({
          items: [
            {
              product_id: Number(selectedProductId),
              quantity: parseInt(quantity, 10),
            },
          ],
        }),
      });

      setSuccess("Transaksi penjualan berhasil dicatat!");
    } catch (err: any) {
      setError(err.message || "Gagal mencatat penjualan.");
    }
  };

  return (
    <AppShell userRole="EMPLOYER">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Catat Penjualan Usaha</h1>
          <p className="text-sm text-gray-600 mt-1">Catat transaksi penjualan produk harian Anda.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm max-w-xl">
          <form onSubmit={handleRecordSale} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Produk</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Rp {Number(p.price).toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah (Kuantitas)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Simpan Transaksi Penjualan
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}