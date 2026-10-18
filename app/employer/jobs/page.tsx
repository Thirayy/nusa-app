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

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1; // ID bisnis aktif untuk MVP

  const fetchJobs = async () => {
    try {
      const data = await apiFetch<Job[]>(`/api/v1/jobs`);
      // Filter lowongan milik bisnis ini
      const businessJobs = data.filter((j: any) => j.business_id === businessId);
      setJobs(businessJobs);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar lowongan.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/v1/businesses/${businessId}/jobs`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          location,
          employment_type: employmentType,
          requirements,
          status: "OPEN",
        }),
      });

      setSuccess("Lowongan kerja berhasil dipublikasikan!");
      setTitle("");
      setDescription("");
      setLocation("");
      setRequirements("");
      fetchJobs();
    } catch (err: any) {
      setError(err.message || "Gagal membuat lowongan kerja.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Lowongan & Pelamar</h1>
          <p className="text-sm text-gray-600 mt-1">
            Publikasikan lowongan pekerjaan untuk usaha Anda dan temukan kandidat terbaik.
          </p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {/* Form Buat Lowongan */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Buat Lowongan Baru</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Judul Posisi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Barista Full-Time"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Malang"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan tanggung jawab utama pekerjaan ini..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipe Pekerjaan</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Kontrak">Kontrak</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Persyaratan</label>
                <input
                  type="text"
                  required
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Pengalaman min. 1 tahun, ramah, jujur"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#28665A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Publikasikan Lowongan
            </button>
          </form>
        </div>

        {/* Daftar Lowongan Aktif */}
        <div className="bg-white rounded-2xl border border-[#EBE7DF] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#EBE7DF] font-semibold text-gray-800">Lowongan Terpublikasi</div>
          {jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada lowongan yang dibuat.</div>
          ) : (
            <div className="divide-y divide-[#EBE7DF]">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{job.title}</h3>
                    <p className="text-xs text-gray-500">
                      {job.location} • {job.employment_type} • Status:{" "}
                      <span className="text-[#28665A] font-semibold">{job.status}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{job.description}</p>
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