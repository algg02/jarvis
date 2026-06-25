"use client";
import { useEffect, useRef, useState } from "react";
import { leerDocumentos } from "@/lib/historial";

type Mensaje = { role: "user" | "assistant"; content: string };

const ETIQUETA_FUENTE: Record<string, (n: string) => string> = {
  criterios: (n) => `${n} criterio${n === "1" ? "" : "s"} de LEXIA`,
  scjn: (n) => `${n} tesis de la SCJN (en vivo)`,
  documentos: (n) => `${n} documento${n === "1" ? "" : "s"} tuyo${n === "1" ? "" : "s"}`,
};

function describirFuentes(raw: string): string[] {
  if (!raw || raw === "ninguna") return [];
  return raw.split(",").map((par) => {
    const [k, n] = par.split(":");
    return ETIQUETA_FUENTE[k] ? ETIQUETA_FUENTE[k](n) : par;
  });
}

const SUGERENCIAS = [
  { t: "¿Qué requisitos exige el art. 1916 del CCF para el daño moral?", icon: "⚖" },
  { t: "Explícame el cómputo del plazo para contestar una demanda laboral.", icon: "👷" },
  { t: "Redacta un machote de cláusula de confidencialidad.", icon: "✎" },
  { t: "¿Diferencia entre amparo directo e indirecto?", icon: "📜" },
];

function Burbuja({ m }: { m: Mensaje }) {
  const user = m.role === "user";
  return (
    <div style={{ display: "flex", gap: 12, flexDirection: user ? "row-reverse" : "row" }}>
      <div
        style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 600,
          background: user ? "linear-gradient(135deg,#5b7cfa,#8b5cf6)" : "linear-gradient(135deg,var(--gold-bright),var(--gold-dim))",
          color: user ? "#fff" : "#1a1407",
        }}
        className={user ? "" : "serif"}
      >
        {user ? "A" : "⚖"}
      </div>
      <div
        className={user ? "" : "serif"}
        style={{
          maxWidth: "78%", padding: "12px 16px", borderRadius: 12,
          background: user ? "var(--surface-2)" : "var(--bg-elevated)",
          border: "1px solid var(--border)",
          fontSize: user ? 14 : 14.5, lineHeight: 1.7,
          color: user ? "var(--text)" : "#dfe2ea",
          whiteSpace: "pre-wrap", wordWrap: "break-word",
        }}
      >
        {m.content || <span className="blink" style={{ color: "var(--gold)" }}>▍</span>}
      </div>
    </div>
  );
}

export default function AsistenteChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [proveedor, setProveedor] = useState("");
  const [fuentes, setFuentes] = useState<string[]>([]);
  const [usarDocs, setUsarDocs] = useState(true);
  const [numDocs, setNumDocs] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes]);

  // Cuenta los documentos guardados (y se actualiza si se generan más).
  useEffect(() => {
    const actualizar = () => setNumDocs(leerDocumentos().length);
    actualizar();
    window.addEventListener("lexia:docs", actualizar);
    return () => window.removeEventListener("lexia:docs", actualizar);
  }, []);

  const enviar = async (texto: string) => {
    const t = texto.trim();
    if (!t || cargando) return;
    setInput("");
    const nuevos: Mensaje[] = [...mensajes, { role: "user", content: t }, { role: "assistant", content: "" }];
    setMensajes(nuevos);
    setCargando(true);
    setFuentes([]);

    const docs = usarDocs
      ? leerDocumentos().slice(0, 3).map((d) => ({ nombre: d.nombre, contenido: d.contenido }))
      : [];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevos.slice(0, -1), documentos: docs }),
      });
      setProveedor(res.headers.get("X-Proveedor") || "");
      setFuentes(describirFuentes(res.headers.get("X-Fuentes") || ""));
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMensajes((prev) => {
            const copia = [...prev];
            copia[copia.length - 1] = { role: "assistant", content: copia[copia.length - 1].content + chunk };
            return copia;
          });
        }
      }
    } catch {
      setMensajes((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] = { role: "assistant", content: "Error de conexión. Intenta de nuevo." };
        return copia;
      });
    }
    setCargando(false);
  };

  const vacio = mensajes.length === 0;

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)", overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>Asistente jurídico</span>
        </div>
        <span className="badge" style={{ color: proveedor && proveedor !== "Plantilla" ? "var(--gold)" : "var(--text-dim)", borderColor: "var(--border)", background: "var(--surface)" }}>
          {proveedor && proveedor !== "Plantilla" ? `✦ IA · ${proveedor}` : "IA por configurar"}
        </span>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
        {vacio ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, textAlign: "center" }}>
            <div className="serif" style={{ width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#1a1407", background: "linear-gradient(135deg,var(--gold-bright),var(--gold-dim))", boxShadow: "0 8px 24px -8px rgba(201,168,74,0.5)" }}>⚖</div>
            <div>
              <h2 className="serif" style={{ fontSize: 22, margin: "0 0 6px" }}>¿En qué te ayudo hoy?</h2>
              <p style={{ color: "var(--text-dim)", fontSize: 14, margin: 0, maxWidth: 420 }}>
                Consulta legislación, jurisprudencia, plazos o pide un machote. Orientación general en derecho mexicano.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 560 }}>
              {SUGERENCIAS.map((s) => (
                <button
                  key={s.t}
                  onClick={() => enviar(s.t)}
                  className="card card-hover"
                  style={{ padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", gap: 11, alignItems: "flex-start", background: "var(--bg-elevated)" }}
                >
                  <span style={{ fontSize: 17, color: "var(--gold)" }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{s.t}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {mensajes.map((m, i) => <Burbuja key={i} m={m} />)}
            {fuentes.length > 0 && !cargando && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginLeft: 44 }}>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Fuentes consultadas:</span>
                {fuentes.map((f) => (
                  <span key={f} className="badge" style={{ color: "var(--gold)", borderColor: "var(--gold-dim)", background: "rgba(201,168,74,0.1)" }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: numDocs ? "pointer" : "not-allowed", fontSize: 12, color: numDocs ? "var(--text-dim)" : "var(--text-faint)" }}>
            <input
              type="checkbox"
              checked={usarDocs && numDocs > 0}
              disabled={numDocs === 0}
              onChange={(e) => setUsarDocs(e.target.checked)}
              style={{ accentColor: "var(--gold)", cursor: numDocs ? "pointer" : "not-allowed" }}
            />
            Usar mis documentos como contexto
            <span className="badge" style={{ color: "var(--text-dim)", borderColor: "var(--border)", background: "var(--surface)" }}>
              {numDocs} guardado{numDocs === 1 ? "" : "s"}
            </span>
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(input); }
            }}
            placeholder="Escribe tu consulta legal…  (Enter para enviar, Shift+Enter para salto de línea)"
            className="textarea"
            style={{ minHeight: 46, maxHeight: 160, resize: "none" }}
            rows={1}
          />
          <button
            className="btn btn-gold"
            onClick={() => enviar(input)}
            disabled={cargando || !input.trim()}
            style={{ height: 46, padding: "0 20px", opacity: cargando || !input.trim() ? 0.6 : 1 }}
          >
            {cargando ? "…" : "Enviar"}
          </button>
        </div>
        <p style={{ fontSize: 10.5, color: "var(--text-faint)", textAlign: "center", margin: "8px 0 0" }}>
          Orientación general, no sustituye asesoría sobre tu expediente. Verifica registros y criterios vigentes.
        </p>
      </div>
    </div>
  );
}
