"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface WorkRecordItem {
  id: number;
  title: string;
  tasks: string;
  skills: string;
  start_date: string;
  end_date: string | null;
  verification_status: string;
}

interface WorkPassportData {
  worker_user_id: number;
  verified_experiences: WorkRecordItem[];
  pending_or_unverified_experiences: WorkRecordItem[];
  disclaimer: string;
}

export default function WorkerPassportPage() {
  const [passport, setPassport] = useState<WorkPassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPassport = async () => {
    try {
      const data = await apiFetch<WorkPassportData>("/api/v1/work-passport/me");
      setPassport(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data Work Passport.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Work Passport Profesional</h1>
          <p className="text-sm text-black-600 mt-1">
            Rekam jejak pengalaman kerja dan keterampilan Anda yang diverifikasi langsung oleh pemberi kerja.
          </p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}

        {loading ? (
          <div className="p-8 text-center text-black-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Memuat Work Passport...
          </div>
        ) : !passport ? (
          <div className="p-8 text-center text-black-500 bg-white rounded-2xl border border-[#EBE7DF]">
            Data Work Passport tidak ditemukan.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bagian Pengalaman Terverifikasi */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                <h2 className="text-base font-bold text-[#28665A]">Pengalaman Terverifikasi Resmi</h2>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  {passport.verified_experiences.length} Terverifikasi
                </span>
              </div>

              {passport.verified_experiences.length === 0 ? (
                <p className="text-sm text-black-500 py-4 text-center">
                  Belum ada pengalaman kerja yang terverifikasi.
                </p>
              ) : (
                <div className="space-y-4">
                  {passport.verified_experiences.map((rec) => (
                    <div key={rec.id} className="p-4 bg-[#FAF7F0] rounded-xl border border-[#EBE7DF] space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-black-800">{rec.title}</h3>
                        <span className="px-2 py-0.5 bg-[#28665A] text-white text-xs font-medium rounded">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-black-500">
                        Periode: {rec.start_date} — {rec.end_date || "Sekarang"}
                      </p>
                      <p className="text-sm text-black-700">{rec.tasks}</p>
                      <div className="text-xs text-black-600">
                        <span className="font-semibold">Keterampilan:</span> {rec.skills}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bagian Pengalaman Pending */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                <h2 className="text-base font-bold text-[#D98652]">Pengalaman Menunggu Verifikasi / Klaim</h2>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                  {passport.pending_or_unverified_experiences.length} Pending
                </span>
              </div>

              {passport.pending_or_unverified_experiences.length === 0 ? (
                <p className="text-sm text-black-500 py-4 text-center">
                  Tidak ada catatan kerja yang menunggu verifikasi.
                </p>
              ) : (
                <div className="space-y-4">
                  {passport.pending_or_unverified_experiences.map((rec) => (
                    <div key={rec.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-black-800">{rec.title}</h3>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                          {rec.verification_status}
                        </span>
                      </div>
                      <p className="text-xs text-black-500">
                        Periode: {rec.start_date} — {rec.end_date || "Sekarang"}
                      </p>
                      <p className="text-sm text-black-700">{rec.tasks}</p>
                      <div className="text-xs text-black-600">
                        <span className="font-semibold">Keterampilan:</span> {rec.skills}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#EBE7DF] text-xs text-black-500">
              * {passport.disclaimer}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}