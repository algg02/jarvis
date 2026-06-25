# ⚖️ LEXIA — Plataforma Jurídica Inteligente

Plataforma legal-tech para abogados (México): genera demandas, contratos, poderes,
escritos y actas constitutivas; busca criterios y jurisprudencia; y mantente al día
con la actualidad jurídica, todo filtrable por materia.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Funciones

- **Generador de documentos** — demanda, contrato, poder, escrito, acta constitutiva y convenio.
- **Buscador de criterios** — tesis y jurisprudencia filtrables por materia, tipo y texto.
- **Noticias** — actualidad jurídica filtrable por materia.
- **10 materias** del derecho mexicano.

## 🤖 Activar la IA (opcional)

Sin configurar nada, el generador funciona en **modo plantilla** (gratis e instantáneo).
Para que la IA **redacte los documentos completos en tiempo real**, elige UNA opción:

| Opción | Costo | Dónde sacar la key |
|---|---|---|
| **Gemini** (Google) ⭐ | **Gratis** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — un clic, sin tarjeta |
| **Groq** (Llama) | **Gratis**, muy rápido | [console.groq.com/keys](https://console.groq.com/keys) |
| **Claude** (Anthropic) | De pago, máxima calidad | [console.anthropic.com](https://console.anthropic.com) |

Pasos:

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.local.example .env.local
   ```
2. Abre `.env.local`, descomenta **una** opción y pega tu key (p. ej. `GEMINI_API_KEY=...`).
3. Reinicia el servidor (`Ctrl+C`, luego `npm run dev`).

Listo: al generar verás el documento **escribiéndose solo**, y un badge indica qué IA lo redactó.

## Stack

Next.js 16 (App Router) · TypeScript · streaming multi-proveedor (Gemini / Groq / Claude) · diseño legal-tech propio.
