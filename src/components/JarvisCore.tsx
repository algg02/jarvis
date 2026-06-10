'use client';
import { useEffect, useRef, useState } from 'react';

export default function JarvisCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);
  const [online] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setAngle(a => (a + 0.5) % 360), 16);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    const rings = [
      { r: 90, speed: 1, dashes: 60, gap: 4, opacity: 0.35 },
      { r: 72, speed: -1.5, dashes: 40, gap: 6, opacity: 0.5 },
      { r: 52, speed: 2, dashes: 24, gap: 8, opacity: 0.4 },
      { r: 34, speed: -3, dashes: 16, gap: 10, opacity: 0.6 },
    ];

    rings.forEach(({ r, speed, dashes, gap, opacity }) => {
      const segAngle = (2 * Math.PI) / dashes;
      for (let i = 0; i < dashes; i++) {
        if (i % 3 === 0) continue;
        const start = i * segAngle + (angle * speed * Math.PI) / 180;
        const end = start + segAngle - (gap * Math.PI) / 180;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, end);
        ctx.strokeStyle = `rgba(0,245,255,${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Radar sweep
    const sweepAngle = (angle * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepAngle);
    const grad = ctx.createLinearGradient(0, 0, 90, 0);
    grad.addColorStop(0, 'rgba(0,245,255,0.25)');
    grad.addColorStop(1, 'rgba(0,245,255,0)');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 90, -0.4, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Center glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    glow.addColorStop(0, 'rgba(0,245,255,0.9)');
    glow.addColorStop(0.4, 'rgba(0,245,255,0.3)');
    glow.addColorStop(1, 'rgba(0,245,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Crosshairs
    ctx.strokeStyle = 'rgba(0,245,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(cx - 95, cy); ctx.lineTo(cx + 95, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 95); ctx.lineTo(cx, cy + 95); ctx.stroke();
    ctx.setLineDash([]);

    // Tick marks on outer ring
    for (let i = 0; i < 36; i++) {
      const a = (i * Math.PI) / 18;
      const inner = i % 9 === 0 ? 86 : i % 3 === 0 ? 88 : 90;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * 94, cy + Math.sin(a) * 94);
      ctx.strokeStyle = `rgba(0,245,255,${i % 9 === 0 ? 0.7 : 0.3})`;
      ctx.lineWidth = i % 9 === 0 ? 2 : 1;
      ctx.stroke();
    }
  }, [angle]);

  return (
    <div className="panel flex flex-col items-center justify-center gap-2 p-3 h-full">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">JARVIS CORE</span>
        <div className="status-dot" />
      </div>

      <div className="relative float">
        <canvas ref={canvasRef} width={200} height={200} style={{ display: 'block' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div style={{ fontSize: 8, color: 'var(--cyan)', letterSpacing: 3, textShadow: '0 0 8px var(--cyan)' }}>
            {online ? 'ONLINE' : 'OFFLINE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {[
          { l: 'AI', v: 'ACTIVE' },
          { l: 'SEC', v: 'OK' },
          { l: 'NET', v: 'LIVE' },
        ].map(({ l, v }) => (
          <div key={l} className="panel p-1 text-center" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
            <div className="label">{l}</div>
            <div style={{ fontSize: 9, color: 'var(--cyan)', textShadow: '0 0 6px var(--cyan)' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 8, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.8 }}>
        <span className="glow-text" style={{ fontSize: 10 }}>J.A.R.V.I.S</span><br />
        Just A Rather Very Intelligent System<br />
        <span style={{ fontSize: 7 }}>v2.0.6 · NEURAL ENGINE READY</span>
      </div>
    </div>
  );
}
