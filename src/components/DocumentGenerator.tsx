"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TIPOS_DOCUMENTO, getTipoDocumento, type CampoFormulario } from "@/lib/documentos";
import MateriaBadge from "@/components/MateriaBadge";
import { guardarDocumento } from "@/lib/historial";
import { exportarWord, exportarPDF } from "@/lib/exportar";

function Field({ campo, value, onChange }: { campo: CampoFormulario; value: string; onChange: (v: string) => void }) {
  const common = { value: value || "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value) };
  return (
    <div style={{ gridColumn: campo.ancho === "full" ? "1 / -1" : "auto" }}>
      <label className="field-label">
        {campo.label} {campo.requerido && <span style={{ color: "var(--gold)" }}>*</span>}
      </label>
      {campo.tipo === "textarea" ? (
        <textarea className="textarea" placeholder={campo.placeholder} {...common} />
      ) : campo.tipo === "select" ? (
        <select className="select" {...common}>
          <option value="">Seleccionar…</option>
          {campo.opciones?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input className="input" type={campo.tipo} placeholder={campo.placeholder} {...common} />
      )}
    </div>
  );
}

export default function DocumentGenerator() {
  const params = useSearchParams();
  const tipoInicial = params.get("tipo") || TIPOS_DOCUMENTO[0].id;

  const [tipoId, setTipoId] = useState(tipoInicial);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<string>("");
  const [modo, setModo] = useState<string>("");
  const [proveedor, setProveedor] = useState<string>("");
  const [cargando, setCargando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const tipo = useMemo(() => getTipoDocumento(tipoId)!, [tipoId]);

  useEffect(() => {
    const p = params.get("tipo");
    if (p && getTipoDocumento(p)) setTipoId(p);
  }, [params]);

  // Reset al cambiar de tipo
  useEffect(() => {
    setValores({});
    setResultado("");
  }, [tipoId]);

  const set = (id: string, v: string) => setValores((s) => ({ ...s, [id]: v }));

  const generar = async () => {
    setCargando(true);
    setResultado("");
    setModo("");
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tipo: tipoId, campos: valores }),
      });
      setModo(res.headers.get("X-Modo") || "");
      setProveedor(res.headers.get("X-Proveedor") || "");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let texto = "";
      if (reader) {
        // Lee el documento en streaming y lo va mostrando en tiempo real.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          texto += chunk;
          setResultado((prev) => prev + chunk);
        }
      }
      // Al terminar, guarda el documento en el historial local (para reabrirlo
      // y para que el asistente pueda consultarlo).
      if (texto.trim()) {
        guardarDocumento({ tipo: tipoId, nombre: tipo.nombre, contenido: texto });
      }
    } catch {
      setResultado("Error al generar el documento. Intenta de nuevo.");
    }
    setCargando(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  const [exportando, setExportando] = useState<"" | "word" | "pdf">("");

  const descargarWord = async () => {
    setExportando("word");
    try {
      await exportarWord(tipo.nombre, resultado);
    } finally {
      setExportando("");
    }
  };

  const descargarPDF = () => {
    setExportando("pdf");
    try {
      exportarPDF(tipo.nombre, resultado);
    } finally {
      setExportando("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Selector de tipo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {TIPOS_DOCUMENTO.map((t) => {
          const active = t.id === tipoId;
          return (
            <button
              key={t.id}
              onClick={() => setTipoId(t.id)}
              className="card"
              style={{
                padding: "14px 10px", cursor: "pointer", textAlign: "center",
                background: active ? "var(--surface-2)" : "var(--surface)",
                borderColor: active ? "var(--gold)" : "var(--border)",
                boxShadow: active ? "0 0 0 3px rgba(201,168,74,0.12)" : "none",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6, color: active ? "var(--gold)" : "var(--text)" }}>{t.icon}</div>
              <div style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? "var(--ink)" : "var(--text)" }}>
                {t.nombre}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)", gap: 22, alignItems: "start" }}>
        {/* Formulario */}
        <div className="card" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22 }}>{tipo.icon}</span>
            <h2 className="serif" style={{ fontSize: 21 }}>{tipo.nombre}</h2>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 0, marginBottom: 12 }}>{tipo.descripcion}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {tipo.materias.map((m) => (
              <MateriaBadge key={m} id={m} size="sm" />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {tipo.campos.map((campo) => (
              <Field key={campo.id} campo={campo} value={valores[campo.id]} onChange={(v) => set(campo.id, v)} />
            ))}
          </div>

          <button
            className="btn btn-gold"
            onClick={generar}
            disabled={cargando}
            style={{ marginTop: 22, width: "100%", padding: "12px", opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? "Generando…" : "✦ Generar documento"}
          </button>
          <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center", marginTop: 10, marginBottom: 0 }}>
            {modo === "ia"
              ? `✦ Redactado con IA (${proveedor})`
              : <>Modo plantilla. Agrega una key (Gemini gratis) en <span className="kbd">.env.local</span> para activar la IA.</>}
          </p>
        </div>

        {/* Vista previa */}
        <div className="card" style={{ padding: 0, overflow: "hidden", position: "sticky", top: 80 }}>
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Vista previa</span>
              {modo === "ia" && <span className="badge" style={{ color: "var(--gold)", borderColor: "var(--gold-dim)", background: "rgba(201,168,74,0.1)" }}>✦ IA</span>}
              {modo === "plantilla" && <span className="badge" style={{ color: "var(--text-dim)", borderColor: "var(--border)", background: "var(--surface)" }}>plantilla</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: "5px 11px", fontSize: 12 }} onClick={copiar} disabled={!resultado}>
                {copiado ? "✓ Copiado" : "Copiar"}
              </button>
              <button className="btn btn-ghost" style={{ padding: "5px 11px", fontSize: 12 }} onClick={descargarWord} disabled={!resultado || !!exportando}>
                {exportando === "word" ? "…" : "⬇ Word"}
              </button>
              <button className="btn btn-ghost" style={{ padding: "5px 11px", fontSize: 12 }} onClick={descargarPDF} disabled={!resultado || !!exportando}>
                {exportando === "pdf" ? "…" : "⬇ PDF"}
              </button>
            </div>
          </div>

          <div style={{ padding: resultado || cargando ? "22px 26px" : 0, minHeight: 420, maxHeight: 620, overflowY: "auto" }}>
            {resultado || cargando ? (
              <pre
                className="serif"
                style={{
                  whiteSpace: "pre-wrap", wordWrap: "break-word", margin: 0,
                  fontSize: 13, lineHeight: 1.75, color: "#dfe2ea", fontFamily: "var(--font-serif)",
                }}
              >
                {resultado}
                {cargando && <span className="blink" style={{ color: "var(--gold)" }}>▍</span>}
              </pre>
            ) : (
              <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 420, gap: 14, textAlign: "center" }}>
                <div style={{ fontSize: 48, opacity: 0.25 }}>{tipo.icon}</div>
                <div style={{ color: "var(--text-faint)", fontSize: 14, maxWidth: 280 }}>
                  Completa el formulario y presiona <span className="gold-text">Generar documento</span> para ver el resultado aquí.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
