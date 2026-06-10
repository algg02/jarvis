'use client';

export default function WeatherPlaceholder() {
  return (
    <div className="panel flex flex-col gap-2 p-3 h-full">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">ENVIRONMENT</span>
        <span style={{ fontSize: 7, color: 'rgba(0,245,255,0.3)', marginLeft: 'auto' }}>PLACEHOLDER</span>
      </div>

      <div className="flex items-center gap-4">
        <div style={{ fontSize: 36, filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.4))' }}>⛅</div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--cyan)', textShadow: '0 0 12px rgba(0,245,255,0.5)' }}>--°</div>
          <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>WEATHER API NOT CONNECTED</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { l: 'HUMIDITY', v: '--%' },
          { l: 'WIND', v: '-- km/h' },
          { l: 'UV INDEX', v: '--' },
        ].map(({ l, v }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div className="label">{l}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 7, color: 'rgba(0,245,255,0.3)', textAlign: 'center', marginTop: 'auto' }}>
        Connect OpenWeather or WeatherAPI MCP to enable
      </div>
    </div>
  );
}
