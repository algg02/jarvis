'use client';
import { useState } from 'react';

const ACTIONS = [
  { label: 'OPEN CLAUDE', icon: '◈', color: '#aa88ff', action: () => window.open('https://claude.ai', '_blank') },
  { label: 'GITHUB', icon: '◉', color: '#00f5ff', action: () => window.open('https://github.com/algg02', '_blank') },
  { label: 'DRIVE', icon: '◎', color: '#00ff88', action: () => window.open('https://drive.google.com', '_blank') },
  { label: 'TERMINAL', icon: '⌨', color: '#ffaa00', action: () => {} },
  { label: 'VS CODE', icon: '◧', color: '#3178c6', action: () => {} },
  { label: 'CALENDAR', icon: '◫', color: '#ff6b6b', action: () => {} },
];

export default function QuickActions() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="panel flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">QUICK LAUNCH</span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {ACTIONS.map((a, i) => (
          <button
            key={a.label}
            onClick={() => { setActive(i); a.action(); setTimeout(() => setActive(null), 300); }}
            style={{
              background: active === i ? `${a.color}22` : 'rgba(0,245,255,0.04)',
              border: `1px solid ${active === i ? a.color : 'rgba(0,245,255,0.15)'}`,
              color: a.color, fontFamily: 'inherit', cursor: 'pointer',
              padding: '6px 4px', borderRadius: 2, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 12px ${a.color}44`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 6, letterSpacing: 1, whiteSpace: 'nowrap' }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
