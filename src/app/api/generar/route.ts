import Anthropic from "@anthropic-ai/sdk";
import { getTipoDocumento } from "@/lib/documentos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Eres un abogado litigante mexicano con amplia experiencia en redacción jurídica. Redactas con técnica impecable: lenguaje formal y preciso, fundamentos de derecho correctos (citas de artículos aplicables de la legislación mexicana y, cuando proceda, criterios y jurisprudencia de la SCJN), estructura ordenada y congruente.

Reglas estrictas:
- Conserva fielmente los datos proporcionados por el usuario.
- NO inventes datos personales, fechas, montos ni domicilios que falten: déjalos como marcadores entre corchetes, por ejemplo [domicilio del demandado].
- Completa y mejora el documento aplicando buena técnica jurídica (proemio, prestaciones, hechos, derecho, pruebas, puntos petitorios o cláusulas según corresponda).
- Devuelve ÚNICAMENTE el documento final, sin comentarios, explicaciones, ni notas al margen.`;

/**
 * Genera un documento legal en streaming.
 * - Sin ANTHROPIC_API_KEY: transmite la plantilla local (instantáneo, sin costo).
 * - Con ANTHROPIC_API_KEY: Claude (Opus 4.8) redacta el documento en tiempo real.
 */
export async function POST(req: Request) {
  const { tipo, campos } = (await req.json()) as { tipo: string; campos: Record<string, string> };

  const doc = getTipoDocumento(tipo);
  if (!doc) {
    return new Response("Tipo de documento no encontrado", { status: 400 });
  }

  const base = doc.plantilla(campos || {});
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const encoder = new TextEncoder();

  // ---- Modo plantilla (sin IA) ----
  if (!apiKey) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(base));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "plantilla" },
    });
  }

  // ---- Modo IA (Claude Opus 4.8, streaming) ----
  const client = new Anthropic({ apiKey });
  const userPrompt = `Redacta y perfecciona el siguiente documento de tipo "${doc.nombre}", a partir de este borrador generado por plantilla. Mejóralo con técnica jurídica mexicana y complétalo de forma profesional:\n\n---\n${base}\n---`;

  const stream = new ReadableStream({
    async start(controller) {
      let escribio = false;
      try {
        const ai = client.messages.stream({
          model: process.env.ANTHROPIC_MODEL || "claude-opus-4-8",
          max_tokens: 16000,
          system: SYSTEM,
          messages: [{ role: "user", content: userPrompt }],
        });
        for await (const event of ai) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            escribio = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        // Si la IA falla antes de escribir nada, devolvemos la plantilla.
        if (!escribio) controller.enqueue(encoder.encode(base));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "ia" },
  });
}
