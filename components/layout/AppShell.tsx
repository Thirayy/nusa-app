"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const user = await apiFetch<{ role: string }>("/api/v1/auth/me");
        setRole(user.role);
      } catch (err) {
        router.push("/auth/login");
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserRole();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  // Menu Pemilik Usaha (Owner)
  const ownerLinks = [
    { href: "/employer/dashboard", label: "Beranda & Ringkasan" },
    { href: "/employer/business", label: "Profil Bisnis" },
    { href: "/employer/products", label: "Kelola Produk" },
    { href: "/employer/sales", label: "Catat Penjualan" },
    { href: "/employer/costs", label: "Catat Biaya Operasional" },
    { href: "/employer/work-records", label: "Rekam Kerja" },
    { href: "/employer/jobs", label: "Lowongan & Pelamar" },
    { href: "/employer/assistant", label: "Asisten AI Decision" },
  ];

  // Menu Staff Operasional
  const staffLinks = [
    { href: "/employer/dashboard", label: "Beranda & Ringkasan" },
    { href: "/employer/connect", label: "Tautkan Bisnis" }, // <-- Tambahkan ini
    { href: "/employer/products", label: "Kelola Produk" },
    { href: "/employer/sales", label: "Catat Penjualan" },
    { href: "/employer/costs", label: "Catat Biaya Operasional" },
    { href: "/employer/work-records", label: "Rekam Kerja" },
  ];

  // Menu Pekerja (Worker) lengkap sesuai permintaan
  const workerLinks = [
    { href: "/worker/dashboard", label: "Beranda Pekerja" },
    { href: "/worker/jobs", label: "Cari Lowongan" },
    { href: "/worker/applications", label: "Status Lamaran" },
    { href: "/worker/passport", label: "Work Passport" },
    { href: "/worker/profile", label: "Profil Profesional" },
  ];

  let currentLinks = workerLinks;
  if (role === "EMPLOYER_OWNER") {
    currentLinks = ownerLinks;
  } else if (role === "EMPLOYER_STAFF") {
    currentLinks = staffLinks;
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-gray-600">
        Memuat sesi pengguna...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-white border-r border-[#EBE7DF] flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-xl font-black text-[#28665A] tracking-tight">NUSA</h1>
            <p className="text-xs text-gray-400 mt-0.5">AI Business & Workforce</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-3">
              Menu Utama ({role ? role.replace("_", " ") : "PENGGUNA"})
            </p>
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-[#28665A] text-white shadow-sm"
                      : "text-gray-700 hover:bg-[#FAF7F0] hover:text-[#28665A]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-[#EBE7DF]">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition text-center"
          >
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#EBE7DF] px-6 py-4 flex justify-between items-center md:hidden">
          <span className="font-bold text-[#28665A]">NUSA</span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 px-3 py-1 bg-red-50 rounded-lg"
          >
            Keluar
          </button>
        </header>
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}