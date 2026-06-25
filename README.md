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

## 🤖 Activar la IA de Claude (opcional pero recomendado)

Sin configurar nada, el generador funciona en **modo plantilla** (gratis e instantáneo).
Para que **Claude redacte los documentos completos con IA** (modelo Opus 4.8, en tiempo real):

1. Consigue una API key en **[console.anthropic.com](https://console.anthropic.com)** → *Settings → API Keys*.
2. En la carpeta del proyecto, copia el archivo de ejemplo:
   ```bash
   cp .env.local.example .env.local
   ```
3. Abre `.env.local` y pega tu key:
   ```
   ANTHROPIC_API_KEY=sk-ant-tu-key-aqui
   ```
4. Reinicia el servidor (`Ctrl+C`, luego `npm run dev`).

Listo: al generar un documento verás que se **escribe solo en tiempo real**, redactado por Claude.

> El modelo se puede cambiar con `ANTHROPIC_MODEL` en `.env.local`
> (`claude-opus-4-8` = mejor calidad, `claude-sonnet-4-6` = más económico).

## Stack

Next.js 16 (App Router) · TypeScript · Anthropic SDK (streaming) · diseño legal-tech propio.
