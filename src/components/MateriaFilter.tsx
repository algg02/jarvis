"use client";
import { MATERIAS } from "@/lib/materias";

export default function MateriaFilter({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        onClick={() => onChange(null)}
        className="badge"
        style={{
          cursor: "pointer",
          color: selected === null ? "#1a1407" : "var(--text-dim)",
          background: selected === null ? "var(--gold)" : "var(--surface)",
          borderColor: selected === null ? "var(--gold)" : "var(--border)",
          fontWeight: 600,
          padding: "5px 12px",
        }}
      >
        Todas
      </button>
      {MATERIAS.map((m) => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(active ? null : m.id)}
            className="badge"
            style={{
              cursor: "pointer",
              color: active ? m.color : "var(--text-dim)",
              background: active ? `${m.color}1f` : "var(--surface)",
              borderColor: active ? `${m.color}77` : "var(--border)",
              fontWeight: active ? 600 : 500,
              padding: "5px 12px",
            }}
          >
            <span>{m.icon}</span>
            {m.nombre}
          </button>
        );
      })}
    </div>
  );
}
