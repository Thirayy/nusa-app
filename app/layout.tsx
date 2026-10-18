import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "NUSA — AI Business & Workforce Ecosystem",
  description: "Ekosistem Bisnis & Tenaga Kerja UMKM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#FAF7F0] black-800 antialiased">
        {children}
      </body>
    </html>
  );
}