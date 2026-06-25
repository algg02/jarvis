import { getMateria } from "@/lib/materias";

export default function MateriaBadge({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const m = getMateria(id);
  if (!m) return null;
  const small = size === "sm";
  return (
    <span
      className="badge"
      style={{
        color: m.color,
        borderColor: `${m.color}55`,
        background: `${m.color}14`,
        fontSize: small ? 10 : 11,
        padding: small ? "2px 7px" : "3px 9px",
      }}
    >
      <span style={{ fontSize: small ? 9 : 10 }}>{m.icon}</span>
      {m.nombre}
    </span>
  );
}
