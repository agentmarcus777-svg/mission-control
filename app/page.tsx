'use client';

import dynamic from 'next/dynamic';
import Header from './components/Header';
import EmpireCards from './components/EmpireCards';
import ActivityFeed from './components/ActivityFeed';
import TimeFilter from './components/TimeFilter';
import AgentStatus from './components/AgentStatus';
import SectionTitle from './components/SectionTitle';
import QuickStats from './components/QuickStats';

// Dynamic import for Globe (needs WebGL, can't SSR)
const Globe = dynamic(() => import('./components/Globe'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '340px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#475569',
      fontSize: '12px',
      letterSpacing: '2px',
    }}>
      INITIALIZING GLOBE...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <Header />

      {/* Quick Stats Bar */}
      <div style={{ padding: '20px 32px 0' }}>
        <QuickStats />
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
        padding: '24px 32px',
      }}>
        {/* Left Column: Globe + Agent Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Globe */}
          <div style={{
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              padding: '16px 20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#f59e0b',
                letterSpacing: '2px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                🌐 GLOBAL OPERATIONS
              </div>
              <div style={{
                fontSize: '10px',
                color: '#22c55e',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                ● LIVE
              </div>
            </div>
            <Globe />
          </div>

          {/* Agent Status */}
          <div style={{
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            padding: '20px',
          }}>
            <SectionTitle title="Agent Systems" icon="🤖" subtitle="Active compute nodes" />
            <AgentStatus />
          </div>
        </div>

        {/* Center + Right: Empire Cards (spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <SectionTitle title="Empire Overview" icon="👑" subtitle="All business units at a glance" />
            <TimeFilter />
          </div>
          <EmpireCards />

          {/* Activity Feed below cards */}
          <div style={{
            marginTop: '24px',
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            padding: '20px',
          }}>
            <SectionTitle title="Activity Feed" icon="📡" subtitle="Real-time operations log" />
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '16px 32px',
        borderTop: '1px solid rgba(245, 158, 11, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        color: '#334155',
      }}>
        <span>MISSION CONTROL v1.0 • BCI EMPIRE</span>
        <span>MARCUS AI • CLAUDE OPUS 4 • ALL SYSTEMS NOMINAL</span>
        <span>BUILD 2025.03.05 • PORT 3002</span>
      </footer>
    </div>
  );
}
