"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface WorkerProfile {
  id: number;
  display_name: string;
  summary: string | null;
  location: string;
  availability: string | null;
}

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiFetch<WorkerProfile>("/api/v1/worker/profile/me");
        setProfile(data);
        setDisplayName(data.display_name);
        setSummary(data.summary || "");
        setLocation(data.location);
        setAvailability(data.availability || "");
      } catch (err: any) {
        setError("Profil profesional belum dibuat. Silakan lengkapi data diri Anda di bawah.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await apiFetch<WorkerProfile>("/api/v1/worker/profile", {
        method: "POST",
        body: JSON.stringify({
          display_name: displayName,
          summary,
          location,
          availability,
        }),
      });
      setProfile(data);
      setSuccess("Profil profesional berhasil disimpan!");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Profil Profesional Pekerja</h1>
          <p className="text-sm text-black-600 mt-1">Kelola identitas profesional dan preferensi ketersediaan kerja Anda.</p>
        </div>

        {error && <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-200">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nama Tampilan</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Fathi Zain"
                className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#D8D2C4] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ringkasan Profesional / Bio</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Contoh: Barista berpengalaman dengan keahlian pelayanan pelanggan dan manajemen operasional kafe."
                className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#D8D2C4] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lokasi Domisili</label>
              <input  
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Malang"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black-600 mb-1">Ketersediaan Kerja</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Contoh: Full-time / Part-time / Segera"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Simpan Profil Profesional
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}