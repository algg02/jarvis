'use client';
import { useEffect, useState } from 'react';

const EVENTS = [
  { type: 'COMMIT', msg: 'feat: add jarvis dashboard UI', time: '2m ago', color: '#00f5ff' },
  { type: 'BUILD', msg: 'Next.js build succeeded (4.2s)', time: '3m ago', color: '#00ff88' },
  { type: 'DRIVE', msg: 'Budget 2026.xlsx modified', time: '12m ago', color: '#ffaa00' },
  { type: 'SYS', msg: 'RAM usage peaked at 78%', time: '18m ago', color: '#ffaa00' },
  { type: 'NET', msg: 'Download spike: 2.4 MB/s', time: '25m ago', color: '#00f5ff' },
  { type: 'AI', msg: 'Claude session started', time: '1h ago', color: '#aa88ff' },
  { type: 'COMMIT', msg: 'chore: update dependencies', time: '2h ago', color: '#00f5ff' },
  { type: 'SYS', msg: 'CPU temp normalized (62°C)', time: '3h ago', color: '#00ff88' },
  { type: 'DRIVE', msg: 'Projects folder synced (24 files)', time: '4h ago', color: '#ffaa00' },
];

export default function ActivityFeed() {
  const [events, setEvents] = useState(EVENTS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(x => x + 1);
      if (Math.random() > 0.6) {
        const live = [
          { type: 'SYS', msg: `CPU load: ${Math.floor(Math.random() * 60 + 20)}%`, time: 'now', color: '#00f5ff' },
          { type: 'NET', msg: `RX: ${(Math.random() * 500).toFixed(0)} KB/s`, time: 'now', color: '#00f5ff' },
          { type: 'AI', msg: 'Neural inference cycle complete', time: 'now', color: '#aa88ff' },
        ];
        setEvents(e => [live[Math.floor(Math.random() * live.length)], ...e.slice(0, 12)]);
      }
    }, 4000);
    return () => clearInterval(t);
  }, []);

  void tick;

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">ACTIVITY STREAM</span>
        <span className="blink" style={{ fontSize: 8, color: 'var(--cyan)', marginLeft: 'auto' }}>LIVE</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {events.map((e, i) => (
          <div key={i} style={{
            display: 'flex', gap: 6, alignItems: 'flex-start',
            padding: '4px 0', borderBottom: '1px solid rgba(0,245,255,0.07)',
            opacity: i === 0 ? 1 : 1 - i * 0.04,
          }}>
            <span style={{
              fontSize: 7, letterSpacing: 1, padding: '1px 4px',
              background: `${e.color}18`, border: `1px solid ${e.color}44`,
              color: e.color, whiteSpace: 'nowrap', borderRadius: 2,
            }}>{e.type}</span>
            <span style={{ fontSize: 8, color: 'var(--text-primary)', flex: 1, lineHeight: 1.5 }}>{e.msg}</span>
            <span style={{ fontSize: 7, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
