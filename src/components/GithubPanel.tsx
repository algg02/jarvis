'use client';

const REPOS = [
  { name: 'jarvis', lang: 'TypeScript', stars: 0, commits: 12, status: 'ACTIVE', branch: 'main' },
  { name: 'api-backend', lang: 'Python', stars: 4, commits: 87, status: 'STABLE', branch: 'main' },
  { name: 'ml-experiments', lang: 'Python', stars: 2, commits: 34, status: 'WIP', branch: 'dev' },
  { name: 'portfolio', lang: 'React', stars: 11, commits: 56, status: 'LIVE', branch: 'main' },
];

const langColor: Record<string, string> = {
  TypeScript: '#3178c6', Python: '#3776ab', React: '#61dafb', JavaScript: '#f7df1e',
};

const statusColor: Record<string, string> = {
  ACTIVE: '#00f5ff', STABLE: '#00ff88', WIP: '#ffaa00', LIVE: '#aa88ff',
};

const PRS = [
  { title: 'feat: jarvis dashboard v2', repo: 'jarvis', state: 'OPEN', num: 3 },
  { title: 'fix: auth token refresh', repo: 'api-backend', state: 'MERGED', num: 47 },
];

export default function GithubPanel() {
  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="status-dot" />
        <span className="label tracking-widest">GITHUB · algg02</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[{ l: 'REPOS', v: '12' }, { l: 'COMMITS', v: '189' }, { l: 'OPEN PRs', v: '3' }].map(({ l, v }) => (
          <div key={l} className="panel p-2" style={{ borderColor: 'rgba(0,245,255,0.15)' }}>
            <div className="label">{l}</div>
            <div style={{ fontSize: 14, color: 'var(--cyan)' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 8, color: 'var(--text-dim)', letterSpacing: 2 }}>REPOSITORIES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {REPOS.map(r => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 4px',
            borderBottom: '1px solid rgba(0,245,255,0.07)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: langColor[r.lang] || '#888', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 9, color: 'var(--text-primary)' }}>{r.name}</span>
            <span style={{ fontSize: 7, color: 'var(--text-dim)', letterSpacing: 0.5 }}>{r.branch}</span>
            <span style={{ fontSize: 7, color: 'var(--text-dim)' }}>{r.commits}c</span>
            <span style={{ fontSize: 7, color: statusColor[r.status], padding: '1px 3px', border: `1px solid ${statusColor[r.status]}44`, borderRadius: 1 }}>
              {r.status}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 8, color: 'var(--text-dim)', letterSpacing: 2, marginTop: 4 }}>PULL REQUESTS</div>
      {PRS.map(pr => (
        <div key={pr.num} style={{ padding: '4px 6px', background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)', borderRadius: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: 'var(--text-primary)' }}>#{pr.num} {pr.title}</span>
            <span style={{ fontSize: 7, color: pr.state === 'OPEN' ? '#00f5ff' : '#00ff88' }}>{pr.state}</span>
          </div>
          <div style={{ fontSize: 7, color: 'var(--text-dim)', marginTop: 2 }}>{pr.repo}</div>
        </div>
      ))}
    </div>
  );
}
