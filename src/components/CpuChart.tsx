'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

export default function CpuChart() {
  const [data, setData] = useState<{ t: string; cpu: number; ram: number }[]>(
    Array.from({ length: 20 }, (_, i) => ({ t: '', cpu: 20 + Math.random() * 30, ram: 40 + Math.random() * 20 }))
  );

  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const res = await fetch('/api/system');
        const j = await res.json();
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setData(prev => [...prev.slice(-29), { t: now, cpu: j.cpu?.load ?? 0, ram: j.memory?.percent ?? 0 }]);
      } catch {
        setData(prev => [...prev.slice(-29), { t: '', cpu: prev[prev.length - 1]?.cpu + (Math.random() - 0.5) * 8, ram: prev[prev.length - 1]?.ram + (Math.random() - 0.5) * 4 }]);
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { color: string; name: string; value: number }[] }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(2,11,18,0.95)', border: '1px solid rgba(0,245,255,0.3)', padding: '4px 8px', fontSize: 9 }}>
        {payload.map((p) => (
          <div key={p.name} style={{ color: p.color }}>{p.name.toUpperCase()}: {Math.round(p.value)}%</div>
        ))}
      </div>
    );
  };

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="status-dot" />
          <span className="label tracking-widest">CPU / RAM HISTORY</span>
        </div>
        <div className="flex gap-3">
          {[{ l: 'CPU', c: '#00f5ff' }, { l: 'RAM', c: '#ffaa00' }].map(({ l, c }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, color: c }}>
              <div style={{ width: 14, height: 2, background: c, boxShadow: `0 0 4px ${c}` }} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffaa00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fill: '#5ba8b5', fontSize: 6 }} tickLine={false} axisLine={false} interval={9} />
            <YAxis domain={[0, 100]} tick={{ fill: '#5ba8b5', fontSize: 6 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="cpu" stroke="#00f5ff" strokeWidth={1.5} fill="url(#cpu)" dot={false} />
            <Area type="monotone" dataKey="ram" stroke="#ffaa00" strokeWidth={1.5} fill="url(#ram)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
