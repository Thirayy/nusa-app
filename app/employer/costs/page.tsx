"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

export default function EmployerCostsPage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1;

  const handleRecordCost = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <p className="text-sm text-black-600 mt-1">Catat pengeluaran harian atau bulanan untuk perhitungan laba usaha.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <form onSubmit={handleRecordCost} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-black-600 mb-1">Keterangan Biaya</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Beli Biji Kopi & Susu"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black-600 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="150000"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Simpan Catatan Biaya
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}