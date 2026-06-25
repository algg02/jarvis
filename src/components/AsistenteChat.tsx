"use client";
import { useEffect, useRef, useState } from "react";

type Mensaje = { role: "user" | "assistant"; content: string };

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes]);

  const enviar = async (texto: string) => {
    const t = texto.trim();
    if (!t || cargando) return;
    setInput("");
    const nuevos: Mensaje[] = [...mensajes, { role: "user", content: t }, { role: "assistant", content: "" }];
    setMensajes(nuevos);
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevos.slice(0, -1) }),
      });
      setProveedor(res.headers.get("X-Proveedor") || "");
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
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
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
