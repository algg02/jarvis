import { NextResponse } from "next/server";
import { getTipoDocumento } from "@/lib/documentos";

export const runtime = "nodejs";

/**
 * Genera un documento legal.
 * - Sin ANTHROPIC_API_KEY: usa la plantilla local (instantáneo, sin costo).
 * - Con ANTHROPIC_API_KEY: usa Claude para redactar un documento pulido y completo.
 */
export async function POST(req: Request) {
  const { tipo, campos } = (await req.json()) as { tipo: string; campos: Record<string, string> };

  const doc = getTipoDocumento(tipo);
  if (!doc) {
    return NextResponse.json({ error: "Tipo de documento no encontrado" }, { status: 400 });
  }

  const base = doc.plantilla(campos || {});
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Modo plantilla (sin IA)
  if (!apiKey) {
    return NextResponse.json({ documento: base, modo: "plantilla" });
  }

  // Modo IA con Claude
  try {
    const prompt = `Eres un abogado litigante mexicano experto en redacción jurídica. Tu tarea es perfeccionar y completar el siguiente borrador de "${doc.nombre}" generado a partir de una plantilla.

Mejóralo aplicando técnica jurídica mexicana: redacción formal, fundamentos legales correctos (cita artículos aplicables y, cuando proceda, criterios), estructura impecable y lenguaje profesional. Conserva los datos proporcionados por el usuario. No inventes datos personales que falten: deja marcadores entre corchetes [así].

Borrador base:
---
${base}
---

Devuelve ÚNICAMENTE el documento final, sin comentarios ni explicaciones.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      // Falla la IA → devolvemos la plantilla para no bloquear al usuario
      return NextResponse.json({ documento: base, modo: "plantilla", aviso: "IA no disponible, se usó plantilla" });
    }

    const data = await res.json();
    const texto = data?.content?.[0]?.text || base;
    return NextResponse.json({ documento: texto, modo: "ia" });
  } catch {
    return NextResponse.json({ documento: base, modo: "plantilla", aviso: "IA no disponible, se usó plantilla" });
  }
}
