import Clock from '@/components/Clock';
import SystemStats from '@/components/SystemStats';
import JarvisCore from '@/components/JarvisCore';
import McpPanel from '@/components/McpPanel';
import DrivePanel from '@/components/DrivePanel';
import ActivityFeed from '@/components/ActivityFeed';
import CpuChart from '@/components/CpuChart';
import TaskBoard from '@/components/TaskBoard';
import AiChat from '@/components/AiChat';
import GithubPanel from '@/components/GithubPanel';
import WeatherPlaceholder from '@/components/WeatherPlaceholder';
import QuickActions from '@/components/QuickActions';

export default function Dashboard() {
  return (
    <main style={{
      position: 'relative', zIndex: 1,
      height: '100vh', width: '100vw',
      padding: 8, display: 'flex', flexDirection: 'column',
      gap: 6, overflow: 'hidden',
    }}>
      {/* Row 1: top panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 1fr', gap: 6, height: 280 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <WeatherPlaceholder />
          <GithubPanel />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Clock />
          <div style={{ flex: 1 }}><JarvisCore /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <SystemStats />
          <McpPanel />
        </div>
      </div>

      {/* Row 2: quick actions */}
      <QuickActions />

      {/* Row 3: bottom panels */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, minHeight: 0 }}>
        <CpuChart />
        <DrivePanel />
        <ActivityFeed />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ flex: 1 }}><TaskBoard /></div>
          <div style={{ flex: 1 }}><AiChat /></div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 4px' }}>
        <span style={{ fontSize: 7, color: 'rgba(0,245,255,0.25)', letterSpacing: 2 }}>J.A.R.V.I.S v2.0 · PERSONAL INTELLIGENCE DASHBOARD</span>
        <span style={{ fontSize: 7, color: 'rgba(0,245,255,0.25)', letterSpacing: 1 }}>ALL SYSTEMS NOMINAL · CLAUDE CODE POWERED</span>
        <span style={{ fontSize: 7, color: 'rgba(0,245,255,0.25)', letterSpacing: 2 }}>agg070502@gmail.com</span>
      </div>
    </main>
  );
}
