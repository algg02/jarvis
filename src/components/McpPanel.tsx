'use client';
import { useState } from 'react';

const MCPS = [
  {
    name: 'filesystem',
    pkg: '@modelcontextprotocol/server-filesystem',
    category: 'CORE',
    status: 'RECOMMENDED',
    desc: 'Read, write & search local files. Lets Jarvis access your project folders.',
    color: '#00f5ff',
  },
  {
    name: 'github',
    pkg: '@modelcontextprotocol/server-github',
    category: 'DEV',
    status: 'ACTIVE',
    desc: 'PRs, issues, commits. Full GitHub integration for code workflows.',
    color: '#00f5ff',
  },
  {
    name: 'google-drive',
    pkg: '@modelcontextprotocol/server-gdrive',
    category: 'STORAGE',
    status: 'CONNECTED',
    desc: 'Browse, read and search your Drive files and folders directly.',
    color: '#00f5ff',
  },
  {
    name: 'brave-search',
    pkg: '@modelcontextprotocol/server-brave-search',
    category: 'SEARCH',
    status: 'RECOMMENDED',
    desc: 'Web search without leaving Jarvis. Research tool for your work.',
    color: '#ffaa00',
  },
  {
    name: 'postgres',
    pkg: '@modelcontextprotocol/server-postgres',
    category: 'DB',
    status: 'OPTIONAL',
    desc: 'Query your PostgreSQL database with natural language.',
    color: '#5ba8b5',
  },
  {
    name: 'slack',
    pkg: '@modelcontextprotocol/server-slack',
    category: 'COMM',
    status: 'OPTIONAL',
    desc: 'Read channels, post messages, search Slack workspace.',
    color: '#5ba8b5',
  },
  {
    name: 'memory',
    pkg: '@modelcontextprotocol/server-memory',
    category: 'AI',
    status: 'RECOMMENDED',
    desc: 'Persistent memory across sessions. Jarvis remembers your context.',
    color: '#ffaa00',
  },
  {
    name: 'puppeteer',
    pkg: '@modelcontextprotocol/server-puppeteer',
    category: 'WEB',
    status: 'OPTIONAL',
    desc: 'Browser automation. Let Jarvis interact with any webpage.',
    color: '#5ba8b5',
  },
];

const statusColor: Record<string, string> = {
  ACTIVE: '#00f5ff',
  CONNECTED: '#00ff88',
  RECOMMENDED: '#ffaa00',
  OPTIONAL: '#5ba8b5',
};

export default function McpPanel() {
  const [selected, setSelected] = useState(0);
  const mcp = MCPS[selected];

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">MCP INTEGRATIONS</span>
      </div>

      <div className="flex gap-2 flex-1 overflow-hidden">
        <div className="flex flex-col gap-1 overflow-y-auto" style={{ minWidth: 120 }}>
          {MCPS.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setSelected(i)}
              style={{
                background: i === selected ? 'rgba(0,245,255,0.1)' : 'transparent',
                border: `1px solid ${i === selected ? 'rgba(0,245,255,0.5)' : 'rgba(0,245,255,0.1)'}`,
                color: i === selected ? 'var(--cyan)' : 'var(--text-dim)',
                fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                padding: '4px 8px', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', borderRadius: 2,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                <span>{m.name}</span>
                <span style={{ fontSize: 7, color: statusColor[m.status], opacity: 0.8 }}>●</span>
              </div>
              <div style={{ fontSize: 7, color: 'var(--text-dim)', marginTop: 1 }}>{m.category}</div>
            </button>
          ))}
        </div>

        <div className="panel flex-1 p-3 flex flex-col gap-2" style={{ borderColor: 'rgba(0,245,255,0.2)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 9, color: statusColor[mcp.status], textShadow: `0 0 6px ${statusColor[mcp.status]}`, letterSpacing: 2 }}>
              ● {mcp.status}
            </span>
            <span style={{ fontSize: 8, background: 'rgba(0,245,255,0.1)', padding: '1px 6px', borderRadius: 2, color: 'var(--cyan)' }}>
              {mcp.category}
            </span>
          </div>

          <div style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: 1 }}>
            {mcp.name}
          </div>

          <div style={{ fontSize: 9, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            {mcp.desc}
          </div>

          <div style={{ marginTop: 4, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,245,255,0.15)', padding: '6px 8px', borderRadius: 2 }}>
            <div style={{ fontSize: 7, color: 'var(--text-dim)', marginBottom: 2 }}>INSTALL</div>
            <div style={{ fontSize: 8, color: '#aaffee', fontFamily: 'monospace' }}>
              npx {mcp.pkg}
            </div>
          </div>

          <div style={{ marginTop: 'auto', fontSize: 7, color: 'rgba(0,245,255,0.3)', lineHeight: 1.8 }}>
            Add to ~/.claude/claude_desktop_config.json<br />
            under &quot;mcpServers&quot; to activate in Claude Code.
          </div>
        </div>
      </div>
    </div>
  );
}
