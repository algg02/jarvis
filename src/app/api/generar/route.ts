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

const enc = new TextEncoder();

/** Lee un cuerpo SSE y entrega líneas "data: ..." una por una. */
async function* sseLines(res: Response) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n");
    buf = parts.pop() || "";
    for (const line of parts) {
      const t = line.trim();
      if (t.startsWith("data:")) yield t.slice(5).trim();
    }
  }
}

/** Gemini (Google) — capa gratuita. */
async function* streamGemini(key: string, prompt: string): AsyncGenerator<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok || !res.body) throw new Error("gemini");
  for await (const data of sseLines(res)) {
    try {
      const j = JSON.parse(data);
      const t = j?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) yield t;
    } catch {}
  }
}

/** Groq (Llama) — capa gratuita, API compatible con OpenAI. */
async function* streamGroq(key: string, prompt: string): AsyncGenerator<string> {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok || !res.body) throw new Error("groq");
  for await (const data of sseLines(res)) {
    if (data === "[DONE]") break;
    try {
      const j = JSON.parse(data);
      const t = j?.choices?.[0]?.delta?.content;
      if (t) yield t;
    } catch {}
  }
}

/** Claude (Anthropic) — de pago, máxima calidad. */
async function* streamClaude(key: string, prompt: string): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey: key });
  const ai = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-8",
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });
  for await (const event of ai) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

export async function POST(req: Request) {
  const { tipo, campos } = (await req.json()) as { tipo: string; campos: Record<string, string> };

  const doc = getTipoDocumento(tipo);
  if (!doc) return new Response("Tipo de documento no encontrado", { status: 400 });

  const base = doc.plantilla(campos || {});
  const prompt = `Redacta y perfecciona el siguiente documento de tipo "${doc.nombre}", a partir de este borrador generado por plantilla. Mejóralo con técnica jurídica mexicana y complétalo de forma profesional:\n\n---\n${base}\n---`;

  // Elige el proveedor según la key disponible (prioridad: gratis primero).
  let proveedor = "Plantilla";
  let gen: AsyncGenerator<string> | null = null;
  if (process.env.GEMINI_API_KEY) {
    proveedor = "Gemini";
    gen = streamGemini(process.env.GEMINI_API_KEY, prompt);
  } else if (process.env.GROQ_API_KEY) {
    proveedor = "Groq";
    gen = streamGroq(process.env.GROQ_API_KEY, prompt);
  } else if (process.env.ANTHROPIC_API_KEY) {
    proveedor = "Claude";
    gen = streamClaude(process.env.ANTHROPIC_API_KEY, prompt);
  }

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
