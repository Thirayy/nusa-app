"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface ApplicationItem {
  id: number;
  job_id: number;
  worker_user_id: number;
  status: string;
}

export default function WorkerApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await apiFetch<ApplicationItem[]>("/api/v1/worker/applications");
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat status lamaran.");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Status Lamaran Pekerjaan</h1>
          <p className="text-sm text-black-600 mt-1">Pantau perkembangan status lamaran yang telah Anda kirimkan ke berbagai UMKM.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}

        {loading ? (
          <div className="p-8 text-center text-black-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Memuat daftar lamaran...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-black-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Belum ada lamaran yang dikirim. Jelajahi lowongan di Beranda Worker untuk mulai melamar.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-2xl border border-[#EBE7DF] shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-black-800">ID Lowongan: #{app.job_id}</h3>
                  <p className="text-xs text-black-500">ID Lamaran: #{app.id}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    app.status === 'APPLIED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border border-green-200' :
                    'bg-gray-100 text-black-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}