"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessResponse {
  id: number;
  name: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  requirements: string;
  status: string;
}

interface CandidateAnalysis {
  application_id: number;
  worker_user_id: number;
  worker_name: string;
  match_score: number;
  matching_factors: string[];
  missing_factors: string[];
  status: string;
}

export default function EmployerJobsPage() {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state buat lowongan baru
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [requirements, setRequirements] = useState("");

  // State untuk melihat pelamar per lowongan
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Ambil bisnis aktif owner
  useEffect(() => {
    async function init() {
      try {
        const business = await apiFetch<BusinessResponse>("/api/v1/businesses/me/active");
        setBusinessId(business.id);
        fetchJobs(business.id);
      } catch (err: any) {
        setError("Profil bisnis belum ditemukan. Silakan buat profil bisnis terlebih dahulu.");
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchJobs = async (bizId: number) => {
    try {
      const data = await apiFetch<Job[]>("/api/v1/jobs");
      // Filter lowongan hanya yang milik bisnis ini (jika backend mengembalikan semua, atau sesuaikan)
      const myJobs = data.filter((j: any) => j.business_id === bizId);
      setJobs(myJobs);
    } catch (err: any) {
      setError("Gagal memuat daftar lowongan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

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
        }),
      });

      setSuccess("Lowongan kerja berhasil dipublikasikan!");
      setTitle("");
      setDescription("");
      setLocation("");
      setRequirements("");
      fetchJobs(businessId);
    } catch (err: any) {
      setError(err.message || "Gagal membuat lowongan.");
    }
  };

  const handleViewCandidates = async (jobId: number) => {
    setSelectedJobId(jobId);
    setLoadingCandidates(true);
    setError("");
    try {
      const res = await apiFetch<any>(`/api/v1/jobs/${jobId}/matches`);
      setCandidates(res.candidates_analysis || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pelamar.");
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleAcceptCandidate = async (applicationId: number) => {
    setError("");
    setSuccess("");
    try {
      await apiFetch(`/api/v1/applications/${applicationId}/accept`, {
        method: "PATCH",
      });
      setSuccess("Kandidat berhasil diterima dan resmi terikat sebagai staff operasional!");
      if (selectedJobId) {
        handleViewCandidates(selectedJobId);
      }
    } catch (err: any) {
      setError(err.message || "Gagal menerima kandidat.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Kelola Lowongan & Pelamar</h1>
          <p className="text-sm text-gray-600 mt-1">Publikasikan lowongan pekerjaan dan pantau pelamar yang masuk ke usaha Anda.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        {/* Form Buat Lowongan */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Buat Lowongan Pekerjaan Baru</h2>
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi Penempatan</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Malang Kota"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                />
              </div>
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
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan tanggung jawab utama pekerjaan..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kualifikasi / Persyaratan</label>
              <textarea
                rows={2}
                required
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Contoh: Pengalaman minimal 1 tahun, jujur, teliti..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!businessId}
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
            >
              Publikasikan Lowongan
            </button>
          </form>
        </div>

        {/* Daftar Lowongan Saya */}
        <div className="bg-white rounded-2xl border border-[#EBE7DF] shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Daftar Lowongan Aktif Anda</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-4">Memuat lowongan...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Belum ada lowongan yang dipublikasikan.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 border border-[#EBE7DF] rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{job.title}</h3>
                    <p className="text-xs text-gray-500">{job.location} • {job.employment_type}</p>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>
                  <button
                    onClick={() => handleViewCandidates(job.id)}
                    className="bg-[#28665A] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#205248] transition whitespace-nowrap"
                  >
                    Lihat Pelamar & Match AI
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel Daftar Pelamar & Rekrutmen */}
        {selectedJobId && (
          <div className="bg-white rounded-2xl border border-[#EBE7DF] shadow-sm overflow-hidden p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Daftar Pelamar & Analisis Kandidat (ID Lowongan: #{selectedJobId})</h2>
            {loadingCandidates ? (
              <div className="text-center text-gray-500 py-4">Memuat data pelamar...</div>
            ) : candidates.length === 0 ? (
              <div className="text-center text-gray-500 py-4">Belum ada pekerja yang melamar pada lowongan ini.</div>
            ) : (
              <div className="space-y-4">
                {candidates.map((cand) => (
                  <div key={cand.application_id} className="p-4 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{cand.worker_name}</h4>
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                          Skor Match: {cand.match_score}%
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                          Status: {cand.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <strong>Kelebihan:</strong> {cand.matching_factors.join(", ")}
                      </p>
                      {cand.missing_factors.length > 0 && (
                        <p className="text-xs text-amber-600">
                          <strong>Catatan:</strong> {cand.missing_factors.join(", ")}
                        </p>
                      )}
                    </div>

                    {cand.status !== "ACCEPTED" ? (
                      <button
                        onClick={() => handleAcceptCandidate(cand.application_id)}
                        className="bg-[#D98652] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#b56b3d] transition whitespace-nowrap"
                      >
                        Terima (Accept) & Jadikan Staff
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                        Resmi Diterima & Terikat
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}