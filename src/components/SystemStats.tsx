'use client';
import { useEffect, useState } from 'react';

interface SystemData {
  cpu: { brand: string; speed: number; cores: number; physicalCores: number; load: number; temp: number };
  memory: { total: number; used: number; free: number; percent: number };
  disk: { size: number; used: number; percent: number; fs: string; mount: string };
  network: { rx: number; tx: number; iface: string };
  os: { platform: string; distro: string; arch: string; hostname: string };
  time: { current: number; uptime: number };
}

function fmt(bytes: number) {
  if (bytes > 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
  if (bytes > 1e6) return (bytes / 1e6).toFixed(0) + ' MB';
  return (bytes / 1e3).toFixed(0) + ' KB';
}

function Gauge({ value, label, unit }: { value: number; label: string; unit?: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value > 85 ? '#ff4444' : value > 65 ? '#ffaa00' : 'var(--cyan)';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 4px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: 14, fontWeight: 'bold', color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 7, color: 'var(--text-dim)' }}>{unit || '%'}</span>
        </div>
      </div>
      <span className="label">{label}</span>
    </div>
  );
}

function Bar({ label, value, max, format }: { label: string; value: number; max: number; format?: (v: number) => string }) {
  const pct = Math.round((value / max) * 100);
  const color = pct > 85 ? '#ff4444' : pct > 65 ? '#ffaa00' : 'var(--cyan)';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="label">{label}</span>
        <span style={{ fontSize: 9, color }}>{format ? format(value) : value + '%'} / {format ? format(max) : '100%'}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: pct + '%', background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 6px ${color}` }} />
      </div>
    </div>
  );
}

export default function SystemStats() {
  const [data, setData] = useState<SystemData | null>(null);

  useEffect(() => {
    const load = () => fetch('/api/system').then(r => r.json()).then(setData).catch(() => {});
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  const uptime = data ? Math.floor(data.time.uptime / 3600) + 'h ' + Math.floor((data.time.uptime % 3600) / 60) + 'm' : '--';

  return (
    <div className="panel flex flex-col gap-3 p-3 h-full">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">SYSTEM MONITOR</span>
      </div>

      {data?.os && (
        <div style={{ fontSize: 8, color: 'var(--text-dim)', borderBottom: '1px solid rgba(0,245,255,0.1)', paddingBottom: 6 }}>
          <div style={{ color: 'var(--cyan)', fontSize: 10 }}>{data.os.hostname?.toUpperCase()}</div>
          <div>{data.os.distro} · {data.os.arch} · UP: {uptime}</div>
        </div>
      )}

      <div className="flex justify-around">
        <Gauge value={data?.cpu.load ?? 0} label="CPU" />
        <Gauge value={data?.memory.percent ?? 0} label="RAM" />
        <Gauge value={data?.disk.percent ?? 0} label="DISK" />
      </div>

      <div className="flex flex-col gap-2">
        {data?.cpu && (
          <Bar label={`CPU · ${data.cpu.brand?.split(' ').slice(-2).join(' ')} · ${data.cpu.cores}C`}
            value={data.cpu.load} max={100} />
        )}
        {data?.memory && (
          <Bar label="MEMORY" value={data.memory.used} max={data.memory.total} format={fmt} />
        )}
        {data?.disk && (
          <Bar label={`DISK ${data.disk.mount}`} value={data.disk.used} max={data.disk.size} format={fmt} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
          <div className="label">NET DOWN</div>
          <div style={{ fontSize: 14, color: 'var(--cyan)' }}>{data?.network.rx ?? 0} <span style={{ fontSize: 9 }}>KB/s</span></div>
        </div>
        <div className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
          <div className="label">NET UP</div>
          <div style={{ fontSize: 14, color: 'var(--cyan)' }}>{data?.network.tx ?? 0} <span style={{ fontSize: 9 }}>KB/s</span></div>
        </div>
        <div className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
          <div className="label">CPU TEMP</div>
          <div style={{ fontSize: 14, color: (data?.cpu.temp ?? 0) > 80 ? '#ff4444' : 'var(--cyan)' }}>{data?.cpu.temp ?? '--'}° <span style={{ fontSize: 9 }}>C</span></div>
        </div>
        <div className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
          <div className="label">CPU FREQ</div>
          <div style={{ fontSize: 14, color: 'var(--cyan)' }}>{data?.cpu.speed ?? '--'} <span style={{ fontSize: 9 }}>GHz</span></div>
        </div>
      </div>
    </div>
  );
}
