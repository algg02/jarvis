import { Suspense } from "react";
import DocumentGenerator from "@/components/DocumentGenerator";

export const metadata = { title: "Documentos — LEXIA" };

export default function DocumentosPage() {
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <div className="tag">Generador con IA</div>
        <h1 className="serif" style={{ fontSize: 28, margin: "6px 0 4px" }}>Documentos legales</h1>
        <p style={{ color: "var(--text-dim)", margin: 0, fontSize: 14.5 }}>
          Elige un tipo, completa los datos y obtén un documento listo para revisar y editar.
        </p>
      </div>

      <Suspense fallback={<div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-faint)" }}>Cargando generador…</div>}>
        <DocumentGenerator />
      </Suspense>
    </div>
  );
}
