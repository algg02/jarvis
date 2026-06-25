import AsistenteChat from "@/components/AsistenteChat";

export const metadata = { title: "Asistente · LEXIA" };

export default function AsistentePage() {
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="tag">IA jurídica</div>
        <h1 className="serif" style={{ fontSize: 28, margin: "6px 0 4px" }}>Asistente legal</h1>
        <p style={{ color: "var(--text-dim)", margin: 0, fontSize: 14.5 }}>
          Resuelve dudas de legislación, procedimiento y criterios con un asistente entrenado en derecho mexicano.
        </p>
      </div>
      <AsistenteChat />
    </div>
  );
}
