"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

interface AppShellProps {
  children: React.ReactNode;
  userRole: "EMPLOYER" | "WORKER";
  userEmail?: string;
}

export default function AppShell({ children, userRole, userEmail }: AppShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  const employerLinks = [
    { href: "/employer/dashboard", label: "Beranda & Ringkasan" },
    { href: "/employer/business", label: "Profil & Produk" },
    { href: "/employer/sales", label: "Penjualan & Biaya" },
    { href: "/employer/jobs", label: "Lowongan & Pelamar" },
    { href: "/employer/assistant", label: "Asisten AI" },
  ];

  const workerLinks = [
    { href: "/worker/dashboard", label: "Cari Lowongan" },
    { href: "/worker/applications", label: "Status Lamaran" },
    { href: "/worker/passport", label: "Work Passport" },
    { href: "/worker/profile", label: "Profil Saya" },
  ];

  const links = userRole === "EMPLOYER" ? employerLinks : workerLinks;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col md:flex-row text-gray-800">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FFFFFF] border-r border-[#EBE7DF] p-6 justify-between">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#28665A]">NUSA</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {userRole === "EMPLOYER" ? "Dashboard UMKM" : "Portal Pekerja"}
            </p>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF7F0] hover:text-[#28665A] transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#EBE7DF] pt-4">
          <p className="text-xs text-gray-500 truncate mb-2">{userEmail || "Pengguna NUSA"}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden bg-white border-b border-[#EBE7DF] px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#28665A]">NUSA</h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700 p-2 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EBE7DF] px-4 py-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF7F0]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            Keluar Akun
          </button>
        </div>
      )}

      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}