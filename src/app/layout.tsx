import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "LEXIA — Plataforma Jurídica Inteligente",
  description: "Genera demandas, contratos, poderes y escritos. Busca criterios y mantente al día con la actualidad jurídica.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: 248, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Topbar />
            <main style={{ flex: 1, padding: "28px 36px", maxWidth: 1280, width: "100%", margin: "0 auto" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
