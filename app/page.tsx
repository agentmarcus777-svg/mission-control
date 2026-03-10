'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import EmpireCards from './components/EmpireCards';
import ActivityFeed from './components/ActivityFeed';
import TimeFilter from './components/TimeFilter';
import AgentStatus from './components/AgentStatus';
import SectionTitle from './components/SectionTitle';
import QuickStats from './components/QuickStats';
import SearchPanel from './components/SearchPanel';
import WeeklyCalendar from './components/WeeklyCalendar';
import AgentQueueBoard from './components/AgentQueueBoard';
import SecondBrainOrb from './components/SecondBrainOrb';
import PodEventsPanel from './components/PodEventsPanel';

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

type NavTab = 'dashboard' | 'search' | 'calendar' | 'agents';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '◆' },
    { id: 'search', label: 'SEARCH', icon: '⌕' },
    { id: 'calendar', label: 'CALENDAR', icon: '▦' },
    { id: 'agents', label: 'AGENTS', icon: '◉' },
  ];

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <Header />

      {/* Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0 32px',
        background: 'rgba(10, 10, 26, 0.6)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.08)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '2px',
              fontFamily: "'JetBrains Mono', monospace",
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? '2px solid #f59e0b'
                : '2px solid transparent',
              color: activeTab === tab.id ? '#f59e0b' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* System indicator */}
        <div style={{
          fontSize: '10px',
          color: '#22c55e',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
          }} />
          ALL SYSTEMS NOMINAL
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      fontSize: '10px',
                      color: '#22c55e',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      ● LIVE
                    </div>
                    <SecondBrainOrb />
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

              <div style={{
                marginTop: '24px',
                background: 'rgba(21, 21, 48, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                padding: '20px',
              }}>
                <SectionTitle title="POD Pipeline Calendar" icon="🗓️" subtitle="Seasonal pushes and upcoming POD deadlines" />
                <div style={{ marginTop: '16px' }}>
                  <PodEventsPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH VIEW */}
      {activeTab === 'search' && (
        <div style={{ padding: '24px 32px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            padding: '24px',
          }}>
            <SectionTitle title="Global Search" icon="🔍" subtitle="Search across all memories, tasks, and conversations" />
            <div style={{ marginTop: '16px' }}>
              <SearchPanel />
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div style={{ padding: '24px 32px' }}>
          <div style={{
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            padding: '24px',
          }}>
            <SectionTitle title="Weekly Calendar" icon="📅" subtitle="Scheduled tasks and events" />
            <div style={{ marginTop: '16px' }}>
              <WeeklyCalendar />
            </div>
          </div>
        </div>
      )}

      {/* AGENTS VIEW */}
      {activeTab === 'agents' && (
        <div style={{ padding: '24px 32px' }}>
          <div style={{
            background: 'rgba(21, 21, 48, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            padding: '24px',
          }}>
            <SectionTitle title="Agent Task Queue" icon="🤖" subtitle="Marcus + Titus live tasks, priorities, and current work" />
            <div style={{ marginTop: '16px' }}>
              <AgentQueueBoard />
            </div>
          </div>
        </div>
      )}

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
        <span>MISSION CONTROL v2.0 • BCI EMPIRE</span>
        <span>MARCUS AI • CLAUDE OPUS 4 • ALL SYSTEMS NOMINAL</span>
        <span>BUILD 2025.03.05 • PORT 3002</span>
      </footer>
    </div>
  );
}
