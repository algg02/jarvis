# J.A.R.V.I.S — Personal Intelligence Dashboard

A sci-fi HUD-style personal dashboard built with Next.js 16, featuring real-time system monitoring, MCP integrations, Google Drive, GitHub stats, and an interactive AI chat interface.

## Features

- **System Monitor** — Real-time CPU, RAM, disk, network, temperature via `systeminformation`
- **CPU/RAM Chart** — Live area chart (30-second rolling window)
- **Jarvis Core** — Animated radar with rotating rings
- **MCP Panel** — Recommended MCP servers to connect to Claude Code
- **Google Drive** — File browser (placeholder — connect gdrive MCP)
- **GitHub Panel** — Repos, PRs, commit stats (placeholder — connect github MCP)
- **Activity Feed** — Live event stream
- **Task Queue** — Interactive checklist
- **AI Chat** — Local Jarvis interface (connect Claude API for full AI)
- **Quick Launch** — One-click shortcuts
- **Weather** — Placeholder (connect OpenWeather API)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Recommended MCPs (add to `~/.claude/claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "filesystem": { "command": "npx", "args": ["@modelcontextprotocol/server-filesystem", "/home"] },
    "github":     { "command": "npx", "args": ["@modelcontextprotocol/server-github"], "env": { "GITHUB_TOKEN": "YOUR_TOKEN" } },
    "gdrive":     { "command": "npx", "args": ["@modelcontextprotocol/server-gdrive"] },
    "brave":      { "command": "npx", "args": ["@modelcontextprotocol/server-brave-search"], "env": { "BRAVE_API_KEY": "YOUR_KEY" } },
    "memory":     { "command": "npx", "args": ["@modelcontextprotocol/server-memory"] }
  }
}
```
