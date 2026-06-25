// Capa de IA multi-proveedor. Reutilizada por el generador de documentos y el
// asistente legal. Prioridad: Gemini (gratis) → Groq (gratis) → Claude (de pago).
import Anthropic from "@anthropic-ai/sdk";

export type Mensaje = { role: "user" | "assistant"; content: string };

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
async function* streamGemini(key: string, system: string, mensajes: Mensaje[]): AsyncGenerator<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: mensajes.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Gemini ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  for await (const data of sseLines(res)) {
    try {
      const j = JSON.parse(data);
      const t = j?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) yield t;
    } catch {}
  }
}

/** Groq (Llama) — capa gratuita, API compatible con OpenAI. */
async function* streamGroq(key: string, system: string, mensajes: Mensaje[]): AsyncGenerator<string> {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [{ role: "system", content: system }, ...mensajes],
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Groq ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
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
async function* streamClaude(key: string, system: string, mensajes: Mensaje[]): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey: key });
  const ai = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-8",
    max_tokens: 16000,
    system,
    messages: mensajes,
  });
  for await (const event of ai) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

export type Proveedor = "Gemini" | "Groq" | "Claude" | "Plantilla";

export interface ProveedorIA {
  proveedor: Proveedor;
  /** Crea el generador de tokens (se invoca al intentar este proveedor). */
  crear: () => AsyncGenerator<string>;
}

/** Lista TODOS los proveedores con key, en orden de prioridad (gratis primero).
 *  Sirve para hacer fallback: si uno falla (p. ej. 429), se intenta el siguiente. */
export function proveedoresIA(system: string, mensajes: Mensaje[]): ProveedorIA[] {
  const lista: ProveedorIA[] = [];
  if (process.env.GEMINI_API_KEY)
    lista.push({ proveedor: "Gemini", crear: () => streamGemini(process.env.GEMINI_API_KEY!, system, mensajes) });
  if (process.env.GROQ_API_KEY)
    lista.push({ proveedor: "Groq", crear: () => streamGroq(process.env.GROQ_API_KEY!, system, mensajes) });
  if (process.env.ANTHROPIC_API_KEY)
    lista.push({ proveedor: "Claude", crear: () => streamClaude(process.env.ANTHROPIC_API_KEY!, system, mensajes) });
  return lista;
}

/** Intenta cada proveedor en orden hasta que uno entregue su primer token.
 *  Devuelve el proveedor que respondió, su primer chunk y el generador para
 *  seguir leyendo. Si todos fallan, lanza el último error. Si no hay keys, null. */
export async function arrancarIA(
  system: string,
  mensajes: Mensaje[]
): Promise<{ proveedor: Proveedor; primero: string; gen: AsyncGenerator<string> } | null> {
  const provs = proveedoresIA(system, mensajes);
  if (provs.length === 0) return null;

  let ultimoError: unknown = null;
  for (const p of provs) {
    try {
      const gen = p.crear();
      const first = await gen.next();
      if (first.done) {
        // Stream vacío: intenta el siguiente proveedor.
        ultimoError = new Error(`${p.proveedor}: respuesta vacía`);
        continue;
      }
      return { proveedor: p.proveedor, primero: first.value, gen };
    } catch (e) {
      ultimoError = e;
      // 429/agotado u otro error → probamos el siguiente proveedor.
    }
  }
  throw ultimoError instanceof Error ? ultimoError : new Error(String(ultimoError));
}
