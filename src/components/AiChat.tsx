'use client';
import { useState, useRef, useEffect } from 'react';

interface Msg { role: 'user' | 'jarvis'; text: string; }

const RESPONSES: Record<string, string> = {
  default: 'PROCESSING REQUEST... Standing by for further instructions, sir.',
  hello: 'HELLO. All systems operational. How may I assist you today?',
  status: 'All systems nominal. CPU and memory within normal parameters. Network connectivity confirmed. Drive sync up to date.',
  help: 'AVAILABLE COMMANDS: status · drive · github · search · task · mcp · deploy · analyze',
  mcp: 'RECOMMENDED MCPs: filesystem (local files), github (repos), google-drive (storage), brave-search (web), memory (persistence). Run "npx @modelcontextprotocol/server-<name>" to install.',
  cpu: 'Fetching CPU telemetry... Load appears within acceptable range. No thermal throttling detected.',
  drive: 'GOOGLE DRIVE: 1,248 files indexed. 15.2/15 GB used. Last sync: 2 hours ago. Connect the gdrive MCP for live access.',
  deploy: 'DEPLOY SEQUENCE: Run "npm run build" then push to your hosting provider. Vercel and Railway both support Next.js out of the box.',
};

function getReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return RESPONSES.default;
}

export default function AiChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'jarvis', text: 'JARVIS ONLINE. All systems initialized. How can I assist you, sir?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: 'jarvis', text: getReply(userMsg) }]);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">JARVIS INTERFACE</span>
        <span className="blink" style={{ fontSize: 7, color: 'var(--cyan)', marginLeft: 'auto' }}>READY</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ fontSize: 7, color: 'var(--text-dim)', marginBottom: 2, letterSpacing: 1 }}>
              {m.role === 'jarvis' ? '◈ JARVIS' : '◉ YOU'}
            </div>
            <div style={{
              maxWidth: '90%', padding: '5px 8px', fontSize: 9, lineHeight: 1.7,
              background: m.role === 'jarvis' ? 'rgba(0,245,255,0.07)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${m.role === 'jarvis' ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
              color: m.role === 'jarvis' ? 'var(--text-primary)' : 'rgba(255,255,255,0.7)',
              borderRadius: 2,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 7, color: 'var(--text-dim)', marginBottom: 2 }}>◈ JARVIS</div>
            <div style={{ padding: '5px 10px', background: 'rgba(0,245,255,0.07)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 2 }}>
              <span className="blink" style={{ fontSize: 12, color: 'var(--cyan)' }}>▋</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="SPEAK TO JARVIS..."
          style={{
            flex: 1, background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.3)',
            color: 'var(--cyan)', fontFamily: 'inherit', fontSize: 9, padding: '5px 8px',
            outline: 'none', borderRadius: 2, letterSpacing: 1,
          }}
        />
        <button className="jarvis-btn" onClick={send}>SEND</button>
      </div>
      <div style={{ fontSize: 7, color: 'rgba(0,245,255,0.3)' }}>Try: status · cpu · drive · mcp · deploy · help</div>
    </div>
  );
}
