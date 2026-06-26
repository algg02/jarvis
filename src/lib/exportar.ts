// Exportación de documentos a Word (.docx) y PDF con formato legal:
// tamaño carta, Times New Roman 12pt, márgenes de ~2.5cm, texto justificado
// y encabezados (líneas en mayúsculas) centrados en negritas.
"use client";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import { jsPDF } from "jspdf";

/** ¿Es una línea de encabezado? (corta y en mayúsculas) */
function esEncabezado(linea: string): boolean {
  const t = linea.trim();
  if (t.length === 0 || t.length > 90) return false;
  const letras = t.replace(/[^a-záéíóúñü]/gi, "");
  if (letras.length < 2) return false;
  return t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(t);
}

function nombreArchivo(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "documento"
  );
}

function descargar(blob: Blob, archivo: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = archivo;
  a.click();
  URL.revokeObjectURL(url);
}

/** Exporta a Word (.docx) editable. */
export async function exportarWord(nombre: string, contenido: string) {
  const lineas = contenido.replace(/\r\n/g, "\n").split("\n");

  const parrafos = lineas.map((linea) => {
    const t = linea.trim();
    if (t === "") return new Paragraph({ children: [] });
    const heading = esEncabezado(t);
    return new Paragraph({
      alignment: heading ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
      spacing: { line: 360, after: heading ? 160 : 120 }, // 1.5 líneas
      children: [new TextRun({ text: t, bold: heading, font: "Times New Roman", size: 24 })], // 12pt
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 } }, // ~2.5cm
        },
        children: parrafos,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  descargar(blob, `${nombreArchivo(nombre)}.docx`);
}

/** Exporta a PDF (tamaño carta, listo para imprimir). */
export function exportarPDF(nombre: string, contenido: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const margen = 72; // 1 pulgada
  const util = ancho - margen * 2;
  const interlineado = 18;
  let y = margen;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  const nuevaLineaSiHaceFalta = () => {
    if (y > alto - margen) {
      doc.addPage();
      y = margen;
    }
  };

  for (const cruda of contenido.replace(/\r\n/g, "\n").split("\n")) {
    const linea = cruda.trim();
    if (linea === "") {
      y += interlineado / 1.5;
      nuevaLineaSiHaceFalta();
      continue;
    }
    const heading = esEncabezado(linea);
    doc.setFont("times", heading ? "bold" : "normal");
    const envueltas: string[] = doc.splitTextToSize(linea, util);
    for (const sub of envueltas) {
      nuevaLineaSiHaceFalta();
      if (heading) {
        doc.text(sub, ancho / 2, y, { align: "center", maxWidth: util });
      } else {
        doc.text(sub, margen, y, { align: "justify", maxWidth: util });
      }
      y += interlineado;
    }
    if (heading) y += interlineado / 2;
  }

  doc.save(`${nombreArchivo(nombre)}.pdf`);
}
