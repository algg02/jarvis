import Link from "next/link";
import { TIPOS_DOCUMENTO } from "@/lib/documentos";
import { CRITERIOS, NOTICIAS } from "@/lib/data";
import { MATERIAS } from "@/lib/materias";
import MateriaBadge from "@/components/MateriaBadge";

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>{label}</div>
      <div className="serif" style={{ fontSize: 30, fontWeight: 700, color: accent || "var(--ink)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 7 }}>{sub}</div>
    </div>
  );
}

export default function Home() {
  const ultimaNoticia = NOTICIAS.filter((n) => n.destacada).slice(0, 2);
  const ultimosCriterios = CRITERIOS.slice(0, 3);

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {/* Hero */}
      <section
        className="card"
        style={{
          padding: "32px 34px",
          background: "linear-gradient(135deg, var(--surface) 0%, var(--bg-elevated) 100%)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -40, top: -40, fontSize: 200, opacity: 0.04, transform: "rotate(-10deg)" }} className="serif">
          ⚖
        </div>
        <div className="tag">Plataforma jurídica con IA</div>
        <h1 className="serif" style={{ fontSize: 34, margin: "10px 0 8px", maxWidth: 620, lineHeight: 1.15 }}>
          Construye documentos legales en minutos, no en horas.
        </h1>
        <p style={{ color: "var(--text-dim)", maxWidth: 560, fontSize: 15.5, marginBottom: 22 }}>
          Demandas, contratos, poderes, escritos y actas constitutivas. Busca criterios de la SCJN y
          mantente al día con la actualidad jurídica, todo filtrable por materia.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/documentos" className="btn btn-gold">
            ✎ Generar documento
          </Link>
          <Link href="/criterios" className="btn btn-outline">
            § Buscar criterios
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Tipos de documento" value={String(TIPOS_DOCUMENTO.length)} sub="listos para generar" accent="var(--gold)" />
        <StatCard label="Criterios indexados" value={`${CRITERIOS.length}+`} sub="tesis y jurisprudencia" />
        <StatCard label="Materias" value={String(MATERIAS.length)} sub="áreas del derecho" />
        <StatCard label="Noticias" value={String(NOTICIAS.length)} sub="actualizaciones recientes" />
      </section>

      {/* Generadores rápidos */}
      <section>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 className="serif" style={{ fontSize: 20 }}>Generadores de documentos</h2>
          <Link href="/documentos" style={{ fontSize: 13, color: "var(--gold)" }}>Ver todos →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {TIPOS_DOCUMENTO.slice(0, 6).map((doc) => (
            <Link key={doc.id} href={`/documentos?tipo=${doc.id}`} className="card card-hover" style={{ padding: "18px 20px", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: "var(--surface-2)", border: "1px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}
                >
                  {doc.icon}
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 17, color: "var(--ink)", fontWeight: 600 }}>{doc.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>⏱ {doc.tiempoEstimado}</div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>{doc.descripcion}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dos columnas: criterios + noticias */}
      <section style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}>
        {/* Criterios recientes */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="serif" style={{ fontSize: 20 }}>Criterios recientes</h2>
            <Link href="/criterios" style={{ fontSize: 13, color: "var(--gold)" }}>Explorar →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ultimosCriterios.map((c) => (
              <Link key={c.id} href="/criterios" className="card card-hover" style={{ padding: "16px 18px", display: "block" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "center" }}>
                  <MateriaBadge id={c.materia} size="sm" />
                  <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{c.tipo} · {c.instancia}</span>
                </div>
                <div className="serif" style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.4, fontWeight: 600 }}>
                  {c.rubro}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Noticias destacadas */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="serif" style={{ fontSize: 20 }}>Destacadas</h2>
            <Link href="/noticias" style={{ fontSize: 13, color: "var(--gold)" }}>Todas →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ultimaNoticia.map((n) => (
              <Link key={n.id} href="/noticias" className="card card-hover" style={{ padding: "16px 18px", display: "block" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "center" }}>
                  <MateriaBadge id={n.materia} size="sm" />
                  <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{n.fecha}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.4, fontWeight: 600, marginBottom: 6 }}>{n.titulo}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{n.resumen.slice(0, 110)}…</div>
              </Link>
            ))}
            <div className="card" style={{ padding: "14px 18px", borderStyle: "dashed", borderColor: "var(--border-light)" }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="live-dot" /> Conecta el DOF / SCJN vía MCP para noticias en vivo
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
