"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  requirements: string;
  status: string;
}

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await apiFetch<Job[]>("/api/v1/jobs");
      setJobs(data);
    } catch (err: any) {
      setError("Gagal memuat daftar lowongan.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    setError("");
    setSuccess("");
    try {
      await apiFetch(`/api/v1/jobs/${jobId}/applications`, {
        method: "POST",
      });
      setSuccess("Berhasil melamar lowongan! Cek status lamaran secara berkala.");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim lamaran.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Cari Lowongan Pekerjaan</h1>
          <p className="text-sm text-gray-600 mt-1">Temukan peluang kerja di berbagai UMKM dan kirim lamaran dengan mudah.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat lowongan tersedia...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-[#EBE7DF]">Belum ada lowongan aktif saat ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-gray-900 text-lg">{job.title}</h2>
                    <span className="text-xs px-2.5 py-1 bg-emerald-50 text-[#28665A] rounded-full font-medium">
                      {job.employment_type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">📍 {job.location}</p>
                  <p className="text-sm text-gray-600">{job.description}</p>
                  <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <strong>Persyaratan:</strong> {job.requirements}
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  className="w-full bg-[#28665A] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#205248] transition"
                >
                  Lamar Pekerjaan Ini
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}