"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface DecisionRoomResponse {
  business_name: string;
  metrics_used: {
    total_omzet: number;
    total_transactions: number;
    total_costs: number;
    estimated_business_result: number;
  };
  ai_analysis: string;
  disclaimer: string;
}

export default function EmployerAssistantPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecisionRoomResponse | null>(null);
  const [error, setError] = useState("");

  const businessId = 1; // ID bisnis aktif untuk MVP

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiFetch<DecisionRoomResponse>(
        `/api/v1/businesses/${businessId}/ai/decision-room`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Gagal mendapatkan analisis dari Asisten AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#28665A]">Asisten AI & Decision Room</h1>
          <p className="text-sm text-gray-600 mt-1">
            Diskusikan performa usaha Anda dan dapatkan analisis berdasarkan data faktual backend.
          </p>
        </div>

        {/* Kotak Input Pertanyaan */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
          <form onSubmit={handleAskAI} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pertanyaan atau Kendala Usaha Anda
              </label>
              <textarea
                rows={3}
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Contoh: Bagaimana evaluasi keuangan bisnis saya sejauh ini dan apa alternatif untuk meningkatkan omzet?"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#28665A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
            >
              {loading ? "Sedang Menganalisis..." : "Kirim ke Asisten AI"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Hasil Analisis AI */}
        {result && (
          <div className="space-y-6">
            {/* Metrik Faktual yang Digunakan */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Data Faktual Bisnis ({result.business_name})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Omzet</p>
                  <p className="font-bold text-[#28665A] text-sm mt-1">
                    Rp {result.metrics_used.total_omzet.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Transaksi</p>
                  <p className="font-bold text-gray-800 text-sm mt-1">
                    {result.metrics_used.total_transactions}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Biaya</p>
                  <p className="font-bold text-[#D98652] text-sm mt-1">
                    Rp {result.metrics_used.total_costs.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Estimasi Hasil</p>
                  <p className="font-bold text-gray-800 text-sm mt-1">
                    Rp {result.metrics_used.estimated_business_result.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Jawaban Naratif AI */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#28665A]">Hasil Analisis Asisten AI</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border border-[#EBE7DF]">
                {result.ai_analysis}
              </div>
              <p className="text-xs text-gray-500 italic">
                {result.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}