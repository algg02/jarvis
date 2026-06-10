'use client';
import { useState } from 'react';

const MOCK_FILES = [
  { name: 'Projects', type: 'folder', size: '—', modified: '2 hrs ago', items: 24 },
  { name: 'Jarvis Dashboard', type: 'folder', size: '—', modified: '1 hr ago', items: 8 },
  { name: 'API Keys.txt', type: 'doc', size: '2 KB', modified: 'Today', items: 0 },
  { name: 'Budget 2026.xlsx', type: 'sheet', size: '48 KB', modified: 'Yesterday', items: 0 },
  { name: 'Architecture Diagram.png', type: 'image', size: '1.2 MB', modified: '3 days ago', items: 0 },
  { name: 'Meeting Notes', type: 'folder', size: '—', modified: '4 days ago', items: 12 },
  { name: 'Resume_v3.pdf', type: 'pdf', size: '220 KB', modified: '1 week ago', items: 0 },
  { name: 'Backups', type: 'folder', size: '—', modified: '2 weeks ago', items: 156 },
];

const icons: Record<string, string> = {
  folder: '📁', doc: '📄', sheet: '📊', image: '🖼', pdf: '📕',
};

export default function DrivePanel() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_FILES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="status-dot" />
          <span className="label tracking-widest">GOOGLE DRIVE</span>
        </div>
        <span style={{ fontSize: 8, color: 'var(--text-dim)' }}>PLACEHOLDER · CONNECT MCP</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="SEARCH FILES..."
          style={{
            flex: 1, background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.2)',
            color: 'var(--cyan)', fontFamily: 'inherit', fontSize: 9, padding: '4px 8px',
            outline: 'none', borderRadius: 2, letterSpacing: 1,
          }}
        />
        <button className="jarvis-btn">SYNC</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { l: 'TOTAL', v: '15.2 GB', sub: '/ 15 GB' },
          { l: 'FILES', v: '1,248' },
          { l: 'SHARED', v: '34' },
        ].map(({ l, v, sub }) => (
          <div key={l} className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
            <div className="label">{l}</div>
            <div style={{ fontSize: 13, color: 'var(--cyan)' }}>{v} <span style={{ fontSize: 8, color: 'var(--text-dim)' }}>{sub}</span></div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px',
            borderBottom: '1px solid rgba(0,245,255,0.07)',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,245,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 14 }}>{icons[f.type] || '📄'}</span>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 9, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
              <div style={{ fontSize: 7, color: 'var(--text-dim)' }}>{f.modified}{f.items ? ` · ${f.items} items` : ''}</div>
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{f.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
