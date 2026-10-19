"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessResponse {
  id: number;
  name: string;
}

export default function EmployerWorkRecordsPage() {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState("");
  const [skills, setSkills] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workerEmail, setWorkerEmail] = useState(""); 
  
  // Diubah dari ID angka menjadi Email Pekerja
  const [workerEmailToVerify, setWorkerEmailToVerify] = useState("");
  
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

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/work-records`, {
        method: "POST",
        body: JSON.stringify({
          title,
          tasks,
          skills,
          start_date: startDate,
          end_date: endDate || null,
          worker_email: workerEmail ? workerEmail.trim() : null,
        }),
      });

      setSuccess("Rekam kerja berhasil dibuat dan terikat ke staff!");
      setTitle("");
      setTasks("");
      setSkills("");
      setStartDate("");
      setEndDate("");
      setWorkerEmail("");
    } catch (err: any) {
      setError(err.message || "Gagal membuat rekam kerja.");
    }
  };

  const handleVerifyRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!workerEmailToVerify) {
      setError("Masukkan email pekerja yang ingin diverifikasi.");
      return;
    }

    try {
      await apiFetch(`/api/v1/work-records/verify-by-email`, {
        method: "PATCH",
        body: JSON.stringify({ worker_email: workerEmailToVerify.trim() }),
      });
      setSuccess(`Semua rekam kerja untuk email ${workerEmailToVerify} berhasil diverifikasi sah ke Work Passport!`);
      setWorkerEmailToVerify("");
    } catch (err: any) {
      setError(err.message || "Gagal memverifikasi rekam kerja.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Kelola Rekam Kerja Pekerja</h1>
          <p className="text-sm text-gray-600 mt-1">Buat dan verifikasi rekam jejak profesional staff atau pekerja Anda.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {/* Form Buat Rekam Kerja */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Buat Rekam Kerja Baru</h2>
          <form onSubmit={handleCreateRecord} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Judul Posisi / Peran</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Barista Utama"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tugas & Tanggung Jawab</label>
              <textarea
                rows={2}
                required
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Meracik minuman, melayani pelanggan, mengelola kasir..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Keterampilan (Dipisahkan koma)</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Pembuatan Kopi, Pelayanan Pelanggan"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Selesai (Opsional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Akun Pekerja / Staff (Opsional)</label>
              <input
                type="email"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
                placeholder="Contoh: staff.budi@mail.com"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!businessId}
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
            >
              Simpan Rekam Kerja
            </button>
          </form>
        </div>

        {/* Form Verifikasi Cepat Berbasis Email */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Verifikasi Rekam Kerja via Email</h2>
          <form onSubmit={handleVerifyRecord} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Pekerja</label>
              <input
                type="email"
                required
                value={workerEmailToVerify}
                onChange={(e) => setWorkerEmailToVerify(e.target.value)}
                placeholder="Contoh: budi@mail.com"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#D98652] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#b56b3d] transition h-[38px]"
            >
              Verifikasi
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}