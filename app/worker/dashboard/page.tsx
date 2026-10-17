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

export default function WorkerDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await apiFetch<Job[]>("/api/v1/jobs");
      // Hanya tampilkan lowongan yang berstatus OPEN
      const openJobs = data.filter((j) => j.status === "OPEN");
      setJobs(openJobs);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar lowongan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId: number) => {
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/v1/jobs/${jobId}/applications`, {
        method: "POST",
      });
      setSuccess("Lamaran berhasil dikirim! Anda dapat memantau statusnya di menu Status Lamaran.");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim lamaran (kemungkinan Anda sudah melamar lowongan ini).");
    }
  };

  return (
    <AppShell userRole="WORKER">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Cari Lowongan Pekerjaan</h1>
          <p className="text-sm text-gray-600 mt-1">
            Temukan peluang karier yang sesuai dengan keterampilan dan preferensi Anda.
          </p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {loading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Memuat lowongan tersedia...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Belum ada lowongan pekerjaan yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                    <span className="px-2.5 py-1 bg-[#FAF7F0] text-[#28665A] text-xs font-semibold rounded-full border border-[#EBE7DF]">
                      {job.employment_type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">📍 {job.location}</p>
                  <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                  <div className="bg-[#FAF7F0] p-3 rounded-xl mb-4 text-xs text-gray-600">
                    <span className="font-semibold">Persyaratan:</span> {job.requirements}
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
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