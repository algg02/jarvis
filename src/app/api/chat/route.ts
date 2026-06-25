import { streamIA, type Mensaje } from "@/lib/ia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Eres un asistente jurídico experto en derecho mexicano, integrado en LEXIA, una plataforma para abogados. Apoyas a litigantes y despachos con consultas legales.

Cómo respondes:
- Con precisión técnica y lenguaje claro. Citas los artículos y ordenamientos aplicables (CCF, CFPC, CNPP, LFT, CPEUM, Ley de Amparo, etc.) indicando número de artículo.
- Estructuras la respuesta con encabezados breves y listas cuando ayuda a la claridad.
- Si la consulta admite criterios o jurisprudencia de la SCJN relevantes, los mencionas indicando que conviene verificar el registro vigente en el Semanario Judicial.
- Distingues entre legislación federal y local cuando es determinante; si el dato local es necesario y no se especificó el estado, lo señalas.
- Eres honesto sobre los límites: no inventas registros, números de tesis, ni fechas. Si no estás seguro, lo dices y sugieres dónde verificar.
- Cierras consultas delicadas recordando que es orientación general y no sustituye el análisis del expediente concreto.

Responde siempre en español.`;

export async function POST(req: Request) {
  const { mensajes } = (await req.json()) as { mensajes: Mensaje[] };

  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return new Response("Sin mensajes", { status: 400 });
  }

  // Limita el historial para no exceder contexto (últimos 12 turnos).
  const historial = mensajes.slice(-12);

  const { proveedor, gen } = streamIA(SYSTEM, historial);
  const enc = new TextEncoder();

  if (!gen) {
    const aviso =
      "⚠️ El asistente de IA no está configurado todavía.\n\n" +
      "Agrega una API key gratuita de Gemini en el archivo `.env.local` " +
      "(GEMINI_API_KEY=...) y reinicia el servidor para activar el chat.\n\n" +
      "Consíguela en aistudio.google.com/apikey — es gratis y sin tarjeta.";
    return new Response(aviso, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "plantilla", "X-Proveedor": "Plantilla" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of gen) controller.enqueue(enc.encode(chunk));
      } catch {
        controller.enqueue(enc.encode("\n\n[Error de conexión con la IA. Intenta de nuevo.]"));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "ia", "X-Proveedor": proveedor },
  });
}
