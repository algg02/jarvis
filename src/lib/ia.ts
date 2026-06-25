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

/** Elige el proveedor según la key disponible (gratis primero). */
export function elegirProveedor(): { proveedor: Proveedor; key: string | null } {
  if (process.env.GEMINI_API_KEY) return { proveedor: "Gemini", key: process.env.GEMINI_API_KEY };
  if (process.env.GROQ_API_KEY) return { proveedor: "Groq", key: process.env.GROQ_API_KEY };
  if (process.env.ANTHROPIC_API_KEY) return { proveedor: "Claude", key: process.env.ANTHROPIC_API_KEY };
  return { proveedor: "Plantilla", key: null };
}

/** Devuelve el generador de tokens del proveedor activo, o null si no hay key. */
export function streamIA(system: string, mensajes: Mensaje[]): {
  proveedor: Proveedor;
  gen: AsyncGenerator<string> | null;
} {
  const { proveedor, key } = elegirProveedor();
  if (!key) return { proveedor, gen: null };
  const gen =
    proveedor === "Gemini" ? streamGemini(key, system, mensajes)
    : proveedor === "Groq" ? streamGroq(key, system, mensajes)
    : streamClaude(key, system, mensajes);
  return { proveedor, gen };
}
