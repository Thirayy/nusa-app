"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

export default function EmployerWorkRecordsPage() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState("");
  const [skills, setSkills] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workerUserId, setWorkerUserId] = useState("");
  const [recordIdToVerify, setRecordIdToVerify] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1;

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
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
          worker_user_id: workerUserId ? parseInt(workerUserId, 10) : null,
        }),
      });

      setSuccess("Rekam kerja berhasil dibuat!");
      setTitle("");
      setTasks("");
      setSkills("");
      setStartDate("");
      setEndDate("");
      setWorkerUserId("");
    } catch (err: any) {
      setError(err.message || "Gagal membuat rekam kerja.");
    }
  };

  const handleVerifyRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!recordIdToVerify) {
      setError("Masukkan ID Rekam Kerja yang ingin diverifikasi.");
      return;
    }

    try {
      await apiFetch(`/api/v1/work-records/${recordIdToVerify}/verify`, {
        method: "PATCH",
      });
      setSuccess(`Rekam kerja ID #${recordIdToVerify} berhasil diverifikasi sah ke Work Passport!`);
      setRecordIdToVerify("");
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
              <label className="block text-xs font-medium text-gray-700 mb-1">ID User Pekerja (Opsional / Jika sudah punya akun)</label>
              <input
                type="number"
                value={workerUserId}
                onChange={(e) => setWorkerUserId(e.target.value)}
                placeholder="Contoh: 2"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Simpan Rekam Kerja
            </button>
          </form>
        </div>

        {/* Form Verifikasi Cepat */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Verifikasi Rekam Kerja</h2>
          <form onSubmit={handleVerifyRecord} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">ID Rekam Kerja</label>
              <input
                type="number"
                required
                value={recordIdToVerify}
                onChange={(e) => setRecordIdToVerify(e.target.value)}
                placeholder="Masukkan ID Rekam Kerja"
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