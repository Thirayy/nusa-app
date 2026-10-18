"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessProfile {
  id: number;
  name: string;
  category: string;
  location: string;
}

export default function EmployerBusinessPage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessId = 1;

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const data = await apiFetch<BusinessProfile>(`/api/v1/businesses/${businessId}`);
        setBusiness(data);
        setName(data.name);
        setCategory(data.category);
        setLocation(data.location);
      } catch (err: any) {
        setError("Profil bisnis belum dibuat. Silakan buat profil usaha Anda di bawah.");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [businessId]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await apiFetch<BusinessProfile>(`/api/v1/businesses`, {
        method: "POST",
        body: JSON.stringify({ name, category, location }),
      });
      setBusiness(data);
      setSuccess("Profil bisnis berhasil disimpan!");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil bisnis.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Profil Bisnis Usaha</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola informasi dasar identitas usaha Anda.</p>
        </div>

        {error && <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-200">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Usaha</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kopi Senja Nusantara"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategori Usaha</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: F&B / Kuliner"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi / Kota</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Malang"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition"
            >
              Simpan Profil Bisnis
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}