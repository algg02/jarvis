"use client";
import { useMemo, useState } from "react";
import { NOTICIAS } from "@/lib/data";
import MateriaFilter from "@/components/MateriaFilter";
import MateriaBadge from "@/components/MateriaBadge";

export default function NoticiasPage() {
  const [materia, setMateria] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    return NOTICIAS.filter((n) => !materia || n.materia === materia).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [materia]);

  const destacada = filtradas.find((n) => n.destacada) || filtradas[0];
  const resto = filtradas.filter((n) => n.id !== destacada?.id);

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div className="tag">Actualidad jurídica</div>
        <h1 className="serif" style={{ fontSize: 28, margin: "6px 0 4px" }}>Noticias y actualizaciones</h1>
        <p style={{ color: "var(--text-dim)", margin: 0, fontSize: 14.5 }}>
          Reformas, criterios relevantes y publicaciones oficiales. Filtra por materia.
        </p>
      </div>

      <MateriaFilter selected={materia} onChange={setMateria} />

      {destacada && (
        <div
          className="card card-hover"
          style={{
            padding: "26px 30px", position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, var(--surface), var(--bg-elevated))",
          }}
        >
          <div style={{ position: "absolute", right: -20, top: -30, fontSize: 160, opacity: 0.04 }} className="serif">✦</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <span className="badge" style={{ color: "var(--gold)", borderColor: "var(--gold-dim)", background: "rgba(201,168,74,0.12)" }}>★ Destacada</span>
            <MateriaBadge id={destacada.materia} size="sm" />
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{destacada.fecha}</span>
          </div>
          <h2 className="serif" style={{ fontSize: 24, lineHeight: 1.25, maxWidth: 720, margin: "0 0 12px" }}>{destacada.titulo}</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 15, lineHeight: 1.6, maxWidth: 720, margin: "0 0 16px" }}>{destacada.resumen}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Fuente: <span style={{ color: "var(--text)" }}>{destacada.fuente}</span></span>
            <button className="btn btn-outline" style={{ marginLeft: "auto", fontSize: 13 }}>Leer más →</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {resto.map((n) => (
          <div key={n.id} className="card card-hover" style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <MateriaBadge id={n.materia} size="sm" />
              <span style={{ fontSize: 11.5, color: "var(--text-faint)", marginLeft: "auto" }}>{n.fecha}</span>
            </div>
            <h3 style={{ fontSize: 16.5, lineHeight: 1.35, color: "var(--ink)", margin: 0, fontWeight: 600 }}>{n.titulo}</h3>
            <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55, margin: 0, flex: 1 }}>{n.resumen}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{n.fuente}</span>
              <span style={{ fontSize: 12, color: "var(--gold)" }}>Leer →</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "16px 20px", borderStyle: "dashed", borderColor: "var(--border-light)", display: "flex", alignItems: "center", gap: 10 }}>
        <span className="live-dot" />
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
          <strong style={{ color: "var(--text)" }}>Placeholder:</strong> conecta el MCP del Diario Oficial de la Federación (DOF) o un feed RSS jurídico para recibir noticias en tiempo real.
        </span>
      </div>
    </div>
  );
}
