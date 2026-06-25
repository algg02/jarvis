"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Inicio", icon: "◈", desc: "Panel general" },
  { href: "/asistente", label: "Asistente", icon: "✦", desc: "Consultas con IA" },
  { href: "/documentos", label: "Documentos", icon: "✎", desc: "Generar escritos" },
  { href: "/criterios", label: "Criterios", icon: "§", desc: "Tesis y jurisprudencia" },
  { href: "/noticias", label: "Noticias", icon: "❖", desc: "Actualidad jurídica" },
];

const NAV_SOON = [
  { label: "Expedientes", icon: "▤" },
  { label: "Plantillas", icon: "❏" },
  { label: "Clientes", icon: "☰" },
  { label: "Calendario", icon: "▦" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside
      style={{
        width: 248, position: "fixed", left: 0, top: 0, bottom: 0,
        background: "var(--bg-elevated)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, var(--gold-bright), var(--gold-dim))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: "#1a1407", fontWeight: 700,
              boxShadow: "0 4px 14px -4px rgba(201,168,74,0.5)",
            }}
            className="serif"
          >
            ⚖
          </div>
          <div>
            <div className="serif" style={{ fontSize: 21, fontWeight: 700, color: "var(--ink)", letterSpacing: "0.02em", lineHeight: 1 }}>
              LEX<span className="gold-text">IA</span>
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-faint)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>
              Jurídica Inteligente
            </div>
          </div>
        </Link>
      </div>

      {/* Nav principal */}
      <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px 8px" }}>
          Principal
        </div>
        {NAV.map((item) => {
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 10px", borderRadius: 9, marginBottom: 2,
                background: active ? "var(--surface-2)" : "transparent",
                border: active ? "1px solid var(--border-light)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
              className="nav-link"
            >
              <span
                style={{
                  fontSize: 16, width: 22, textAlign: "center",
                  color: active ? "var(--gold)" : "var(--text-dim)",
                }}
              >
                {item.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "var(--ink)" : "var(--text)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{item.desc}</div>
              </div>
              {active && <div style={{ width: 3, height: 18, borderRadius: 3, background: "var(--gold)" }} />}
            </Link>
          );
        })}

        <div style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "18px 10px 8px" }}>
          Próximamente
        </div>
        {NAV_SOON.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "9px 10px", borderRadius: 9, marginBottom: 2,
              opacity: 0.5, cursor: "not-allowed",
            }}
          >
            <span style={{ fontSize: 15, width: 22, textAlign: "center", color: "var(--text-faint)" }}>{item.icon}</span>
            <div style={{ flex: 1, fontSize: 14, color: "var(--text-dim)" }}>{item.label}</div>
            <span style={{ fontSize: 9, color: "var(--text-faint)", border: "1px solid var(--border)", borderRadius: 5, padding: "1px 5px" }}>
              pronto
            </span>
          </div>
        ))}
      </nav>

      {/* Footer / usuario */}
      <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            background: "var(--surface)", borderRadius: 9, border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #5b7cfa, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "#fff",
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Lic. Alejandro
            </div>
            <div style={{ fontSize: 10, color: "var(--text-faint)" }}>Plan Despacho</div>
          </div>
          <span style={{ color: "var(--text-faint)", fontSize: 14 }}>⚙</span>
        </div>
      </div>
    </aside>
  );
}
