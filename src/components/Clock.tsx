'use client';
import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="panel flex flex-col items-center justify-center py-3 px-4 gap-1">
      <div className="label">SYSTEM TIME</div>
      <div className="flex items-end gap-1">
        <span style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', lineHeight: 1 }}>
          {h}:{m}
        </span>
        <span style={{ fontSize: 20, color: 'var(--cyan-dim)', lineHeight: 1.4, textShadow: '0 0 10px rgba(0,245,255,0.4)' }} className="blink">
          {s}
        </span>
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>{date.toUpperCase()}</div>
      <div className="flex gap-3 mt-1">
        {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d, i) => {
          const today = time.getDay();
          const dayMap = [6,0,1,2,3,4,5];
          const active = dayMap[i] === (today === 0 ? 6 : today - 1);
          return (
            <span key={d} style={{ fontSize: 7, letterSpacing: 1, color: active ? 'var(--cyan)' : 'rgba(0,245,255,0.2)', textShadow: active ? '0 0 6px var(--cyan)' : 'none' }}>
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}
