// Búsqueda EN VIVO en el Semanario Judicial de la Federación (SCJN).
//
// EXPERIMENTAL: usa la API pública del portal SJF2 de la SCJN
//   POST https://sjf2.scjn.gob.mx/services/sjftesismicroservice/api/public/tesis
// No está documentada oficialmente y su contrato puede cambiar. Por eso:
//   - Está apagada por defecto. Actívala con SCJN_LIVE=1 en .env.local.
//   - El endpoint es configurable con SCJN_API_URL.
//   - Cualquier fallo es silencioso: el asistente sigue con sus otras fuentes.
//
// Si la SCJN cambia el formato, basta ajustar `SCJN_API_URL`, el `body` o la
// función `normaliza` — sin tocar el resto de la app.

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
  "https://sjf2.scjn.gob.mx/services/sjftesismicroservice/api/public/tesis";

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
  const rubro = str("rubro", "sRubro", "titulo", "tesis");
  if (!rubro) return null;
  return {
    rubro,
    texto: str("texto", "sTextoTesis", "contenido", "precedente"),
    registro: str("ius", "registro", "nIdTesis", "registroDigital", "id"),
    instancia: str("instancia", "sInstancia", "organo", "organoJurisdiccional"),
    epoca: str("epoca", "sEpoca", "epocaTesis"),
    tipo: str("tipoTesis", "sTipoTesis", "tipo", "clase") || "Tesis",
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
    const url = `${ENDPOINT}?page=0&size=${limite}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        origin: "https://sjf2.scjn.gob.mx",
        referer: "https://sjf2.scjn.gob.mx/listado-resultado-tesis",
      },
      body: JSON.stringify({
        classifiers: [],
        searchTerms: [texto],
        bFacet: false,
        idApp: "SJFAPP2020",
        lbSearch: [],
        filterExpression: texto,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = (await res.json()) as unknown;
    // La respuesta suele venir como { items: [...] }, { tesis: [...] },
    // { content: [...] } (paginación Spring) o un arreglo directo.
    const d = data as Record<string, unknown>;
    const lista =
      (Array.isArray(data) && data) ||
      (Array.isArray(d.items) && d.items) ||
      (Array.isArray(d.tesis) && d.tesis) ||
      (Array.isArray(d.content) && d.content) ||
      (Array.isArray(d.results) && d.results) ||
      (Array.isArray(d.docs) && d.docs) ||
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
