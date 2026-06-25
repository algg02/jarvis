// Historial local de documentos generados (persistido en el navegador).
// Sirve para reabrir documentos y para que el asistente pueda consultarlos.
"use client";

export interface DocGuardado {
  id: string;
  tipo: string;
  nombre: string;
  contenido: string;
  fecha: number; // epoch ms
}

const KEY = "lexia:documentos";
const MAX = 30;

export function leerDocumentos(): DocGuardado[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DocGuardado[]) : [];
  } catch {
    return [];
  }
}

export function guardarDocumento(doc: Omit<DocGuardado, "id" | "fecha">): DocGuardado {
  const nuevo: DocGuardado = { ...doc, id: `d${Date.now()}`, fecha: Date.now() };
  const lista = [nuevo, ...leerDocumentos()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
    window.dispatchEvent(new Event("lexia:docs"));
  } catch {}
  return nuevo;
}

export function borrarDocumento(id: string) {
  const lista = leerDocumentos().filter((d) => d.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
    window.dispatchEvent(new Event("lexia:docs"));
  } catch {}
}
