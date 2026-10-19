"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessResponse {
  id: number;
  name: string;
  business_code: string;
}

export default function ConnectBusinessPage() {
  const [businessCodeInput, setBusinessCodeInput] = useState("");
  const [currentBusiness, setCurrentBusiness] = useState<BusinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkActiveBusiness();
  }, []);

  const checkActiveBusiness = async () => {
    try {
      const biz = await apiFetch<BusinessResponse>("/api/v1/businesses/me/active");
      setCurrentBusiness(biz);
    } catch (err) {
      // Belum terikat
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!businessCodeInput.trim()) {
      setError("Masukkan Kode Unik Toko dari Owner Anda.");
      return;
    }

    try {
      await apiFetch("/api/v1/businesses/connect-staff", {
        method: "POST",
        body: JSON.stringify({ business_code: businessCodeInput.trim().toUpperCase() }),
      });
      setSuccess("Berhasil terhubung ke toko! Data operasional Anda sekarang tersinkronisasi.");
      checkActiveBusiness();
      setBusinessCodeInput("");
    } catch (err: any) {
      setError(err.message || "Gagal menghubungkan. Pastikan kode unik benar.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Tautkan Akun Staff ke Bisnis</h1>
          <p className="text-sm text-gray-600 mt-1">Masukkan Kode Unik Toko (Contoh: NUSA-XXXX) yang diberikan oleh Owner.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Memeriksa status tautan...</div>
        ) : currentBusiness ? (
          <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-[#28665A] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Akun Anda Sudah Terhubung</h2>
              <p className="text-sm text-gray-600 mt-1">
                Bertugas di toko: <strong className="text-[#28665A]">{currentBusiness.name}</strong> 
                <span className="block text-xs font-mono bg-gray-100 py-1 px-2 rounded mt-2 text-gray-700">Kode: {currentBusiness.business_code}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400">Jika ingin berpindah toko, minta kode unik baru kepada owner terkait.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kode Unik Toko</label>
                <input
                  type="text"
                  required
                  value={businessCodeInput}
                  onChange={(e) => setBusinessCodeInput(e.target.value)}
                  placeholder="Contoh: NUSA-K9X2M"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 uppercase font-mono focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
              >
                Tautkan ke Toko Ini
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}