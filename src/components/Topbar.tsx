"use client";
import { useState } from "react";
import Link from "next/link";

export default function Topbar() {
  const [q, setQ] = useState("");

  return (
    <header
      className="glass"
      style={{
        position: "sticky", top: 0, zIndex: 40,
        height: 60, borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 16, padding: "0 36px",
      }}
    >
      {/* Búsqueda global */}
      <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", fontSize: 15 }}>
          ⌕
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar criterios, documentos, noticias…"
          className="input"
          style={{ paddingLeft: 38, height: 38, background: "var(--surface)" }}
        />
        <span className="kbd" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
          ⌘K
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Estado IA */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12,
        }}
      >
        <span className="live-dot" />
        <span style={{ color: "var(--text-dim)" }}>Asistente IA</span>
        <span style={{ color: "var(--green)", fontWeight: 500 }}>activo</span>
      </div>

      {/* Acciones */}
      <button className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 16 }} title="Notificaciones">
        ◔
      </button>
      <Link href="/documentos" className="btn btn-gold">
        <span style={{ fontSize: 15 }}>＋</span> Nuevo documento
      </Link>
    </header>
  );
}
