"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface DashboardData {
  business_name: string;
  total_omzet: number;
  total_transactions: number;
  total_costs: number;
  estimated_business_result: number;
  disclaimer: string;
}

interface UserData {
  role: string;
}

interface BusinessResponse {
  id: number;
  name: string;
}

export default function EmployerDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil data user & bisnis aktif secara bersamaan secara dinamis
        const [userRes, businessRes] = await Promise.all([
          apiFetch<UserData>("/api/v1/auth/me"),
          apiFetch<BusinessResponse>("/api/v1/businesses/me/active")
        ]);
        
        setRole(userRes.role);

        // Ambil data dashboard menggunakan ID bisnis yang didapat dari akun aktif
        const dashboardRes = await apiFetch<DashboardData>(`/api/v1/businesses/${businessRes.id}/dashboard`);
        setDashboard(dashboardRes);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data ringkasan usaha. Pastikan Anda sudah membuat profil bisnis.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Sapaan */}
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">
            {dashboard ? `Halo, ${dashboard.business_name}` : "Beranda Usaha"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola operasional dan pantau performa usaha Anda dengan mudah.
          </p>
        </div>

        {/* Loading & Error State */}
        {loading && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Memuat ringkasan usaha...
          </div>
        )}

        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
            {error} (Jika Anda belum membuat profil bisnis, silakan buat melalui menu profil terlebih dahulu).
          </div>
        )}

        {/* Konten Utama Dashboard */}
        {!loading && dashboard && (
          <>
            {/* Tindakan Cepat (Quick Actions) - Dinamis Berdasarkan Role */}
            {role === "EMPLOYER_OWNER" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/employer/sales"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">💰</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Catat Penjualan</h3>
                </a>
                <a
                  href="/employer/products"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">📦</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Tambah Produk</h3>
                </a>
                <a
                  href="/employer/jobs"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">👥</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Buat Lowongan</h3>
                </a>
                <a
                  href="/employer/assistant"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">🤖</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Tanya AI</h3>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/employer/sales"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">💰</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Catat Penjualan</h3>
                </a>
                <a
                  href="/employer/products"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">📦</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Tambah Produk</h3>
                </a>
                <a
                  href="/employer/costs"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">🧾</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Catat Biaya</h3>
                </a>
                <a
                  href="/employer/work-records"
                  className="p-4 bg-white rounded-xl border border-[#EBE7DF] hover:border-[#28665A] transition text-center shadow-sm"
                >
                  <div className="text-xl mb-1">📋</div>
                  <h3 className="text-sm font-semibold text-[#28665A]">Rekam Kerja</h3>
                </a>
              </div>
            )}

            {/* Ringkasan Metrik (Metric Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Omzet</p>
                <h4 className="text-2xl font-bold text-[#28665A] mt-2">
                  Rp {Number(dashboard.total_omzet).toLocaleString("id-ID")}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{dashboard.total_transactions} transaksi tercatat</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Biaya Tercatat</p>
                <h4 className="text-2xl font-bold text-[#D98652] mt-2">
                  Rp {Number(dashboard.total_costs).toLocaleString("id-ID")}
                </h4>
                <p className="text-xs text-gray-400 mt-1">Pengeluaran operasional</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Estimasi Hasil Usaha</p>
                <h4 className="text-2xl font-bold text-gray-800 mt-2">
                  Rp {Number(dashboard.estimated_business_result).toLocaleString("id-ID")}
                </h4>
                <p className="text-xs text-gray-400 mt-1">Omzet dikurangi biaya</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-white p-4 rounded-xl border border-[#EBE7DF] text-xs text-gray-500">
              {dashboard.disclaimer}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}