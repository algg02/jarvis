// Búsqueda (retrieval) sobre los criterios de la app. Se usa para darle al
// asistente fuentes reales que citar, en lugar de que las "recuerde".
import { CRITERIOS, type Criterio } from "@/lib/data";
import { getMateria } from "@/lib/materias";

const STOP = new Set([
  "el","la","los","las","de","del","un","una","y","o","que","en","a","por","para",
  "con","sin","su","sus","al","se","es","como","cuando","cual","cuales","sobre",
  "me","mi","te","lo","le","es","son","qué","que","dice","cita","busca","dame",
  "the","of","and","to","in","for","on","is",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

/** Devuelve los criterios más relevantes para una consulta (con su puntaje). */
export function buscarCriterios(consulta: string, limite = 4): Criterio[] {
  const q = tokens(consulta);
  if (q.length === 0) return [];

  const puntuados = CRITERIOS.map((c) => {
    const materiaNombre = getMateria(c.materia)?.nombre ?? c.materia;
    const heno = tokens(`${c.rubro} ${c.texto} ${materiaNombre} ${c.tipo}`);
    const set = new Set(heno);
    let score = 0;
    for (const term of q) {
      if (set.has(term)) score += 1;
      // bonus si aparece en el rubro (encabezado)
      if (tokens(c.rubro).includes(term)) score += 1.5;
    }
    return { c, score };
  });

  return puntuados
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((p) => p.c);
}

/** Formatea criterios como contexto citable para el prompt del asistente. */
export function criteriosComoContexto(criterios: Criterio[]): string {
  if (criterios.length === 0) return "";
  const items = criterios
    .map(
      (c) =>
        `• [${c.tipo} · ${c.instancia} · ${c.epoca} · Registro ${c.registro}]\n  ${c.rubro}\n  ${c.texto}`
    )
    .join("\n\n");
  return `FUENTES DISPONIBLES EN LA BASE DE LEXIA (cítalas con su registro exacto cuando sean pertinentes; si ninguna aplica, dilo y responde con tu conocimiento general):\n\n${items}`;
}
