// Búsqueda EN VIVO en el Semanario Judicial de la Federación (SCJN).
//
// EXPERIMENTAL: el portal de la SCJN (sjf2.scjn.gob.mx) expone una API interna
// no documentada oficialmente. Su contrato puede cambiar sin aviso. Por eso:
//   - Está apagada por defecto. Actívala con SCJN_LIVE=1 en .env.local.
//   - El endpoint es configurable con SCJN_API_URL por si la SCJN lo cambia.
//   - Cualquier fallo es silencioso: el asistente sigue con sus otras fuentes.
//
// Si la SCJN bloquea la petición o cambia el formato, basta ajustar
// `SCJN_API_URL` y/o la función `normaliza` — sin tocar el resto de la app.

export interface TesisSCJN {
  rubro: string;
  texto: string;
  registro: string;
  instancia: string;
  epoca: string;
  tipo: string;
}

const ENDPOINT =
  process.env.SCJN_API_URL ||
  "https://sjf2.scjn.gob.mx/services/sjfapp/services/tesis";

/** Intenta normalizar un registro del JSON de la SCJN a nuestra forma. */
function normaliza(raw: unknown): TesisSCJN | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (...keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "number") return String(v);
    }
    return "";
  };
  const rubro = str("rubro", "titulo", "tesis");
  if (!rubro) return null;
  return {
    rubro,
    texto: str("texto", "contenido", "precedente"),
    registro: str("ius", "registro", "registroDigital", "id"),
    instancia: str("instancia", "organo", "organoJurisdiccional"),
    epoca: str("epoca", "epocaTesis"),
    tipo: str("tipoTesis", "tipo", "clase") || "Tesis",
  };
}

/** Busca en vivo en la SCJN. Devuelve [] si está apagada o si algo falla. */
export async function buscarSCJN(consulta: string, limite = 4): Promise<TesisSCJN[]> {
  if (process.env.SCJN_LIVE !== "1") return [];
  const texto = consulta.trim();
  if (!texto) return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://sjf2.scjn.gob.mx",
        referer: "https://sjf2.scjn.gob.mx/busqueda-principal-tesis",
      },
      body: JSON.stringify({ ius: "", text: texto, page: 1, size: limite, epoca: [], instancia: [], tipo: [] }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = (await res.json()) as unknown;
    // La respuesta suele venir como { tesis: [...] } o { items: [...] } o un arreglo.
    const d = data as Record<string, unknown>;
    const lista =
      (Array.isArray(data) && data) ||
      (Array.isArray(d.tesis) && d.tesis) ||
      (Array.isArray(d.items) && d.items) ||
      (Array.isArray(d.results) && d.results) ||
      [];
    return (lista as unknown[]).map(normaliza).filter((t): t is TesisSCJN => t !== null).slice(0, limite);
  } catch {
    return [];
  }
}

/** Formatea resultados de la SCJN como contexto citable. */
export function scjnComoContexto(tesis: TesisSCJN[]): string {
  if (tesis.length === 0) return "";
  const items = tesis
    .map((t) => `• [SCJN · ${t.tipo} · ${t.instancia} · ${t.epoca} · Registro ${t.registro}]\n  ${t.rubro}\n  ${t.texto}`)
    .join("\n\n");
  return `RESULTADOS EN VIVO DEL SEMANARIO JUDICIAL (SCJN) — datos vigentes, cítalos cuando apliquen:\n\n${items}`;
}
