"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessResponse {
  id: number;
  name: string;
}

export default function EmployerCostsPage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Ambil ID bisnis aktif secara dinamis saat halaman dimuat
  useEffect(() => {
    async function fetchActiveBusiness() {
      try {
        const business = await apiFetch<BusinessResponse>("/api/v1/businesses/me/active");
        setBusinessId(business.id);
      } catch (err: any) {
        setError("Profil bisnis belum ditemukan. Silakan buat profil bisnis terlebih dahulu.");
      }
    }
    fetchActiveBusiness();
  }, []);

  const handleRecordCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/costs`, {
        method: "POST",
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
        }),
      });

      setSuccess("Biaya operasional berhasil dicatat!");
      setDescription("");
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Gagal mencatat biaya.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Catat Biaya Operasional</h1>
          <p className="text-sm text-gray-600 mt-1">Catat pengeluaran harian atau bulanan untuk perhitungan laba usaha.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <form onSubmit={handleRecordCost} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan Biaya</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Beli Biji Kopi & Susu"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="150000"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!businessId}
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
            >
              Simpan Catatan Biaya
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}