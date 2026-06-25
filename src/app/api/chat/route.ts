import { arrancarIA, proveedoresIA, type Mensaje } from "@/lib/ia";
import { buscarCriterios, criteriosComoContexto } from "@/lib/buscar";
import { buscarSCJN, scjnComoContexto } from "@/lib/scjn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Eres un asistente jurídico experto en derecho mexicano, integrado en LEXIA, una plataforma para abogados. Apoyas a litigantes y despachos con consultas legales.

Cómo respondes:
- Con precisión técnica y lenguaje claro. Citas los artículos y ordenamientos aplicables (CCF, CFPC, CNPP, LFT, CPEUM, Ley de Amparo, etc.) indicando número de artículo.
- Estructuras la respuesta con encabezados breves y listas cuando ayuda a la claridad.
- Cuando se te proporcionen FUENTES (criterios de la base de LEXIA, resultados en vivo de la SCJN o documentos del usuario), básate en ellas y cítalas con su registro/dato exacto. NO inventes registros ni números de tesis: usa solo los que aparezcan en las fuentes.
- Si las fuentes no bastan, complementa con tu conocimiento general y dilo con honestidad, sugiriendo verificar en el Semanario Judicial vigente.
- Distingues entre legislación federal y local cuando es determinante; si falta el estado, lo señalas.
- Cierras consultas delicadas recordando que es orientación general y no sustituye el análisis del expediente concreto.

Responde siempre en español.`;

type DocumentoCtx = { nombre?: string; contenido?: string };

export async function POST(req: Request) {
  const { mensajes, documentos } = (await req.json()) as {
    mensajes: Mensaje[];
    documentos?: DocumentoCtx[];
  };

  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return new Response("Sin mensajes", { status: 400 });
  }

  const historial = mensajes.slice(-12);
  const ultima = [...historial].reverse().find((m) => m.role === "user")?.content || "";

  // --- Retrieval de fuentes reales ---
  const fuentes: string[] = [];
  const etiquetas: string[] = [];

  const criterios = buscarCriterios(ultima);
  if (criterios.length) {
    fuentes.push(criteriosComoContexto(criterios));
    etiquetas.push(`criterios:${criterios.length}`);
  }

  const tesis = await buscarSCJN(ultima);
  if (tesis.length) {
    fuentes.push(scjnComoContexto(tesis));
    etiquetas.push(`scjn:${tesis.length}`);
  }

  // Documentos del usuario (enviados desde el cliente, guardados localmente).
  if (Array.isArray(documentos) && documentos.length) {
    const docs = documentos
      .filter((d) => d?.contenido)
      .slice(0, 3)
      .map((d) => `### ${d.nombre || "Documento"}\n${(d.contenido || "").slice(0, 4000)}`)
      .join("\n\n");
    if (docs) {
      fuentes.push(`DOCUMENTOS DEL USUARIO (puedes analizarlos, resumirlos o revisarlos):\n\n${docs}`);
      etiquetas.push(`documentos:${Math.min(documentos.length, 3)}`);
    }
  }

  const system = fuentes.length ? `${SYSTEM}\n\n---\n${fuentes.join("\n\n---\n")}` : SYSTEM;
  const enc = new TextEncoder();

  // Sin ninguna key configurada → aviso para activar la IA.
  if (proveedoresIA(system, historial).length === 0) {
    const aviso =
      "⚠️ El asistente de IA no está configurado todavía.\n\n" +
      "Agrega una API key gratuita de Gemini en el archivo `.env.local` " +
      "(GEMINI_API_KEY=...) y reinicia el servidor para activar el chat.\n\n" +
      "Consíguela en aistudio.google.com/apikey — es gratis y sin tarjeta.";
    return new Response(aviso, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "plantilla", "X-Proveedor": "Plantilla" },
    });
  }

  // Arranca la IA con fallback: si un proveedor falla (p. ej. 429), pasa al siguiente.
  let inicio: Awaited<ReturnType<typeof arrancarIA>>;
  try {
    inicio = await arrancarIA(system, historial);
  } catch (e) {
    const detalle = e instanceof Error ? e.message : String(e);
    console.error("[chat] Todos los proveedores fallaron:", detalle);
    const esCuota = /429|quota|rate/i.test(detalle);
    const msg = esCuota
      ? `⚠️ La IA gratuita alcanzó su límite de uso por ahora (error 429).\n\n` +
        `Espera ~1 minuto y reintenta, o agrega una segunda key gratuita de Groq en .env.local ` +
        `(GROQ_API_KEY=...) — el sistema cambiará a ella automáticamente.\n\nDetalle: ${detalle}`
      : `⚠️ No pude conectar con la IA.\n\nDetalle: ${detalle}\n\n` +
        `Revisa que tu API key sea válida y que el modelo exista ` +
        `(si dice 404, prueba GEMINI_MODEL=gemini-1.5-flash en .env.local).`;
    return new Response(msg, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Modo": "plantilla", "X-Proveedor": "Plantilla" },
    });
  }

  const { proveedor, primero, gen } = inicio!;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(enc.encode(primero));
        for await (const chunk of gen) controller.enqueue(enc.encode(chunk));
      } catch (e) {
        console.error(`[chat] ${proveedor} se cortó a media respuesta:`, e instanceof Error ? e.message : e);
        controller.enqueue(enc.encode("\n\n[La conexión con la IA se interrumpió. Intenta de nuevo.]"));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Modo": "ia",
      "X-Proveedor": proveedor,
      "X-Fuentes": etiquetas.join(",") || "ninguna",
    },
  });
}
