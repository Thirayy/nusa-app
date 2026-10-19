"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api/client";

interface BusinessResponse {
  id: number;
  name: string;
}

interface BusinessAnalysisResponse {
  business_name: string;
  metrics_used: {
    total_omzet: number;
    total_transactions: number;
    total_costs: number;
    estimated_business_result: number;
  };
  analysis_report: string;
  disclaimer: string;
}

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
  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "decision-room">("overview");
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State hasil Analisis Usaha (tersimpan di memori/riwayat)
  const [analysisResult, setAnalysisResult] = useState<BusinessAnalysisResponse | null>(null);

  // State Decision Room
  const [question, setQuestion] = useState("");
  const [decisionResult, setDecisionResult] = useState<DecisionRoomResponse | null>(null);

  useEffect(() => {
    async function fetchActiveBusiness() {
      try {
        const business = await apiFetch<BusinessResponse>("/api/v1/businesses/me/active");
        setBusinessId(business.id);
      } catch (err: any) {
        setError(err.message || "Gagal memuat profil bisnis.");
      }
    }
    fetchActiveBusiness();
  }, []);

  // Fungsi menjalankan Analisis Usaha
  const handleRunAnalysis = async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<BusinessAnalysisResponse>(
        `/api/v1/businesses/${businessId}/ai/business-analysis`,
        { method: "POST" }
      );
      setAnalysisResult(data);
      setActiveTab("analysis");
    } catch (err: any) {
      setError(err.message || "Gagal menghasilkan Analisis Usaha.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi mengirim pertanyaan ke Decision Room (membawa konteks analisis jika ada)
  const handleAskDecisionRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !businessId) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<DecisionRoomResponse>(
        `/api/v1/businesses/${businessId}/ai/decision-room`,
        {
          method: "POST",
          body: JSON.stringify({
            question,
            analysis_context: analysisResult?.analysis_report || "",
          }),
        }
      );
      setDecisionResult(data);
    } catch (err: any) {
      setError(err.message || "Gagal mendapatkan respons dari Decision Room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#28665A]">Asisten AI & Decision Room</h1>
            <p className="text-sm text-gray-600 mt-1">
              Pusat analisis performa usaha dan ruang diskusi strategis berbasis data faktual.
            </p>
          </div>

          {/* Navigasi Tab / Mode */}
          <div className="flex bg-[#FAF7F0] p-1 rounded-xl border border-[#EBE7DF] gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
                activeTab === "overview"
                  ? "bg-[#28665A] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Beranda Asisten
            </button>
            <button
              onClick={() => {
                if (analysisResult) setActiveTab("analysis");
                else handleRunAnalysis();
              }}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
                activeTab === "analysis"
                  ? "bg-[#28665A] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Analisis Usaha {analysisResult && "✨"}
            </button>
            <button
              onClick={() => setActiveTab("decision-room")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
                activeTab === "decision-room"
                  ? "bg-[#28665A] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Decision Room
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* 1. TAB: BERANDA ASISTEN */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-[#28665A]">Analisis Usaha</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Membantu Anda memahami kondisi bisnis berdasarkan data penjualan, biaya operasional, dan produk secara otomatis tanpa analisis manual.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={loading || !businessId}
                className="w-full bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
              >
                {loading ? "Menyusun Analisis..." : analysisResult ? "Lihat Hasil Analisis Terakhir" : "Jalankan Analisis Usaha"}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-[#D98652]">Decision Room</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Ruang diskusi interaktif untuk membahas masalah atau rencana bisnis, mempertimbangkan opsi, manfaat, serta risikonya bersama AI.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("decision-room")}
                className="w-full bg-[#D98652] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#b56b3d] transition"
              >
                Masuk ke Decision Room
              </button>
            </div>
          </div>
        )}

        {/* 2. TAB: ANALISIS USAHA */}
        {activeTab === "analysis" && analysisResult && (
          <div className="space-y-6">
            {/* Metrik Faktual */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Ringkasan Metrik Faktual ({analysisResult.business_name})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Omzet</p>
                  <p className="font-bold text-[#28665A] text-sm mt-1">
                    Rp {analysisResult.metrics_used.total_omzet.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Transaksi</p>
                  <p className="font-bold text-gray-800 text-sm mt-1">
                    {analysisResult.metrics_used.total_transactions}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Biaya</p>
                  <p className="font-bold text-[#D98652] text-sm mt-1">
                    Rp {analysisResult.metrics_used.total_costs.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl">
                  <p className="text-xs text-gray-500">Estimasi Hasil</p>
                  <p className="font-bold text-gray-800 text-sm mt-1">
                    Rp {analysisResult.metrics_used.estimated_business_result.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Laporan Analisis */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#28665A]">Laporan & Tren Usaha</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border border-[#EBE7DF]">
                {analysisResult.analysis_report}
              </div>
              <p className="text-xs text-gray-500 italic">* {analysisResult.disclaimer}</p>

              {/* Tombol Navigasi Sesuai Permintaan */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#EBE7DF]">
                <button
                  onClick={() => setActiveTab("decision-room")}
                  className="flex-1 bg-[#28665A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition text-center"
                >
                  Lanjut ke Decision Room ➔
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center"
                >
                  Kembali ke Asisten AI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: DECISION ROOM */}
        {activeTab === "decision-room" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#D98652]">Decision Room (Ruang Diskusi Strategis)</h2>
                {analysisResult && (
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200">
                    Konteks Analisis Usaha Aktif ✨
                  </span>
                )}
              </div>

              <form onSubmit={handleAskDecisionRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ajukan Pertanyaan atau Masalah Bisnis
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Contoh: Apa alternatif strategi terbaik untuk mendongkrak penjualan produk terlaris di bulan depan?"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#28665A] focus:ring-2 focus:ring-[#28665A] focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || !businessId}
                    className="bg-[#28665A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#205248] transition disabled:opacity-50"
                  >
                    {loading ? "AI sedang mendiskusikan opsi..." : "Diskusikan dengan AI"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Kembali
                  </button>
                </div>
              </form>
            </div>

            {/* Hasil Diskusi / Analisis Decision Room */}
            {decisionResult && (
              <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#D98652]">Hasil Diskusi & Alternatif Tindakan</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border border-[#EBE7DF]">
                  {decisionResult.ai_analysis}
                </div>
                <p className="text-xs text-gray-500 italic">* {decisionResult.disclaimer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}