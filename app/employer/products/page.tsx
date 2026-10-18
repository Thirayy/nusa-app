"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@//lib/api/client";

interface Product {
  id: number;
  name: string;
  price: number;
  is_active: number;
}

export default function EmployerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1; // ID bisnis aktif untuk MVP

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<Product[]>(`/api/v1/businesses/${businessId}/products`);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/products`, {
        method: "POST",
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          is_active: 1,
        }),
      });

      setSuccess("Produk berhasil ditambahkan!");
      setName("");
      setPrice("");
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan produk.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Kelola Produk Usaha</h1>
          <p className="text-sm text-black-600 mt-1">Tambah dan pantau produk yang dijual di usaha Anda.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {/* Form Tambah Produk */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <h2 className="text-base font-semibold text-black-800 mb-4">Tambah Produk Baru</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-black-600 mb-1">Nama Produk</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kopi Susu Aren"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black-600 mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="18000"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#28665A] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Produk */}
        <div className="bg-white rounded-2xl border border-[#EBE7DF] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#EBE7DF] font-semibold text-black-800">Daftar Produk Aktif</div>
          {loading ? (
            <div className="p-6 text-center text-black-500">Memuat produk...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-black-500">Belum ada produk tercatat. Silakan tambah produk di atas.</div>
          ) : (
            <div className="divide-y divide-[#EBE7DF]">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-black-800">{prod.name}</h3>
                    <p className="text-xs text-black-500">Status: Aktif</p>
                  </div>
                  <div className="text-sm font-bold text-[#28665A]">
                    Rp {Number(prod.price).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}