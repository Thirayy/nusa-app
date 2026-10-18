"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("WORKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      router.push("/auth/login");
    } catch (err: any) {
      const msg = err.message || "Gagal melakukan pendaftaran.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-2xl shadow-sm p-8 border border-[#EBE7DF]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#28665A]">Daftar Akun NUSA</h1>
          <p className="text-sm text-gray-600 mt-1">Mulai kembangkan usaha atau karier profesional Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Akun (Peran)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
            >
              <option value="WORKER">Pekerja / Pencari Kerja</option>
              <option value="EMPLOYER_OWNER">Pemilik UMKM (Owner)</option>
              <option value="EMPLOYER_STAFF">Staff Operasional UMKM</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#28665A] text-white py-2.5 rounded-lg font-medium hover:bg-[#205248] transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <a href="/auth/login" className="text-[#D98652] font-medium hover:underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </main>
  );
}