"use client";
import { useMemo, useState } from "react";
import { CRITERIOS } from "@/lib/data";
import MateriaFilter from "@/components/MateriaFilter";
import MateriaBadge from "@/components/MateriaBadge";

export default function CriteriosPage() {
  const [materia, setMateria] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    return CRITERIOS.filter((c) => {
      if (materia && c.materia !== materia) return false;
      if (tipo && c.tipo !== tipo) return false;
      if (q) {
        const t = (c.rubro + " " + c.texto).toLowerCase();
        if (!t.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [materia, q, tipo]);

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div className="tag">Semanario Judicial · SCJN</div>
        <h1 className="serif" style={{ fontSize: 28, margin: "6px 0 4px" }}>Criterios y jurisprudencia</h1>
        <p style={{ color: "var(--text-dim)", margin: 0, fontSize: 14.5 }}>
          Busca tesis aisladas y jurisprudencia. Filtra por materia, tipo y palabras clave.
        </p>
      </div>

      {/* Buscador */}
      <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", fontSize: 16 }}>⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por rubro o contenido (ej. daño moral, prisión preventiva, despido…)"
            className="input"
            style={{ paddingLeft: 42, height: 46, fontSize: 15 }}
          />
        </div>
        <MateriaFilter selected={materia} onChange={setMateria} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Tipo:</span>
          {["Jurisprudencia", "Tesis Aislada"].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(tipo === t ? null : t)}
              className="badge"
              style={{
                cursor: "pointer",
                color: tipo === t ? "var(--accent)" : "var(--text-dim)",
                background: tipo === t ? "rgba(91,124,250,0.14)" : "var(--surface)",
                borderColor: tipo === t ? "rgba(91,124,250,0.5)" : "var(--border)",
                padding: "4px 11px",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
          <strong style={{ color: "var(--ink)" }}>{filtrados.length}</strong> resultado{filtrados.length !== 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: 11.5, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 7 }}>
          <span className="live-dot" /> Datos de muestra · conecta la API de SCJN vía MCP
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtrados.map((c) => {
          const open = abierto === c.id;
          return (
            <div key={c.id} className="card card-hover" style={{ padding: "18px 22px", cursor: "pointer" }} onClick={() => setAbierto(open ? null : c.id)}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                <MateriaBadge id={c.materia} size="sm" />
                <span
                  className="badge"
                  style={{
                    fontSize: 10,
                    color: c.tipo === "Jurisprudencia" ? "var(--gold)" : "var(--text-dim)",
                    borderColor: c.tipo === "Jurisprudencia" ? "var(--gold-dim)" : "var(--border)",
                    background: c.tipo === "Jurisprudencia" ? "rgba(201,168,74,0.1)" : "var(--surface)",
                  }}
                >
                  {c.tipo}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{c.instancia} · {c.epoca}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>Reg. {c.registro}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 16, lineHeight: 1.45, color: "var(--ink)", margin: 0, fontWeight: 600 }}>
                {c.rubro}
              </h3>
              <div
                style={{
                  fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.65,
                  maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease, margin 0.3s",
                  marginTop: open ? 10 : 0,
                }}
              >
                {c.texto}
                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${c.rubro}\n\n${c.texto}\n\nRegistro: ${c.registro}`); }}>
                    Copiar cita
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                    Guardar
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--gold)", marginTop: open ? 0 : 8 }}>{open ? "▲ Cerrar" : "▼ Ver texto completo"}</div>
            </div>
          );
        })}

        {filtrados.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 36, opacity: 0.3, marginBottom: 10 }}>§</div>
            No se encontraron criterios con esos filtros.
          </div>
        )}
      </div>
    </div>
  );
}
