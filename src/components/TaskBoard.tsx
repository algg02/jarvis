'use client';
import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  done: boolean;
}

const INIT: Task[] = [
  { id: 1, text: 'Connect Google Drive MCP', priority: 'HIGH', done: false },
  { id: 2, text: 'Configure filesystem MCP', priority: 'HIGH', done: false },
  { id: 3, text: 'Set up memory MCP for sessions', priority: 'MED', done: false },
  { id: 4, text: 'Add GitHub Actions integration', priority: 'MED', done: true },
  { id: 5, text: 'Deploy Jarvis to production server', priority: 'LOW', done: false },
  { id: 6, text: 'Connect Brave Search MCP', priority: 'MED', done: false },
];

const pColor: Record<string, string> = { HIGH: '#ff4444', MED: '#ffaa00', LOW: '#5ba8b5' };

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [input, setInput] = useState('');

  const toggle = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));

  const add = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: input.trim(), priority: 'MED', done: false }]);
    setInput('');
  };

  const done = tasks.filter(t => t.done).length;

  return (
    <div className="panel flex flex-col gap-2 p-3 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="status-dot" />
          <span className="label tracking-widest">TASK QUEUE</span>
        </div>
        <span style={{ fontSize: 8, color: 'var(--cyan)' }}>{done}/{tasks.length} DONE</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(done / tasks.length) * 100}%` }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks.map(task => (
          <div key={task.id}
            onClick={() => toggle(task.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 6, padding: '5px 4px',
              borderBottom: '1px solid rgba(0,245,255,0.07)', cursor: 'pointer',
              opacity: task.done ? 0.4 : 1, transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 10, height: 10, border: `1px solid ${task.done ? 'var(--cyan)' : 'rgba(0,245,255,0.3)'}`,
              background: task.done ? 'var(--cyan)' : 'transparent',
              flexShrink: 0, marginTop: 1, borderRadius: 1, transition: 'all 0.2s',
            }} />
            <span style={{ flex: 1, fontSize: 9, color: 'var(--text-primary)', textDecoration: task.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
              {task.text}
            </span>
            <span style={{ fontSize: 7, color: pColor[task.priority], letterSpacing: 1, padding: '1px 3px', border: `1px solid ${pColor[task.priority]}44`, borderRadius: 1 }}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="ADD TASK..."
          style={{
            flex: 1, background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.2)',
            color: 'var(--cyan)', fontFamily: 'inherit', fontSize: 9, padding: '4px 8px',
            outline: 'none', borderRadius: 2, letterSpacing: 1,
          }}
        />
        <button className="jarvis-btn" onClick={add}>ADD</button>
      </div>
    </div>
  );
}
