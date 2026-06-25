import { getTipoDocumento } from "@/lib/documentos";
import { streamIA } from "@/lib/ia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Eres un abogado litigante mexicano con amplia experiencia en redacción jurídica. Redactas con técnica impecable: lenguaje formal y preciso, fundamentos de derecho correctos (citas de artículos aplicables de la legislación mexicana y, cuando proceda, criterios y jurisprudencia de la SCJN), estructura ordenada y congruente.

Reglas estrictas:
- Conserva fielmente los datos proporcionados por el usuario.
- NO inventes datos personales, fechas, montos ni domicilios que falten: déjalos como marcadores entre corchetes, por ejemplo [domicilio del demandado].
- Completa y mejora el documento aplicando buena técnica jurídica (proemio, prestaciones, hechos, derecho, pruebas, puntos petitorios o cláusulas según corresponda).
- Devuelve ÚNICAMENTE el documento final, sin comentarios, explicaciones, ni notas al margen.`;

const enc = new TextEncoder();

export async function POST(req: Request) {
  const { tipo, campos } = (await req.json()) as { tipo: string; campos: Record<string, string> };

  const doc = getTipoDocumento(tipo);
  if (!doc) return new Response("Tipo de documento no encontrado", { status: 400 });

  const base = doc.plantilla(campos || {});
  const prompt = `Redacta y perfecciona el siguiente documento de tipo "${doc.nombre}", a partir de este borrador generado por plantilla. Mejóralo con técnica jurídica mexicana y complétalo de forma profesional:\n\n---\n${base}\n---`;

  const { proveedor, gen } = streamIA(SYSTEM, [{ role: "user", content: prompt }]);
  const modo = gen ? "ia" : "plantilla";

  const stream = new ReadableStream({
    async start(controller) {
      if (!gen) {
        controller.enqueue(enc.encode(base));
        controller.close();
        return;
      }
      let escribio = false;
      try {
        for await (const chunk of gen) {
          escribio = true;
          controller.enqueue(enc.encode(chunk));
        }
      } catch {
        // Si la IA falla antes de escribir, devolvemos la plantilla como respaldo.
        if (!escribio) controller.enqueue(enc.encode(base));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Modo": modo,
      "X-Proveedor": proveedor,
    },
  });
}
