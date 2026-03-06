'use client';

import { motion } from 'framer-motion';

interface CardData {
  icon: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  status: 'online' | 'warning' | 'offline';
  link?: string;
  color: string;
}

const cards: CardData[] = [
  {
    icon: '🎨',
    title: 'POD Pipeline',
    subtitle: 'Print-on-Demand Operations',
    stats: [
      { label: 'Today', value: '12 designs', trend: 'up' },
      { label: 'Pass Rate', value: '94%', trend: 'up' },
      { label: 'Queue', value: '3 pending' },
    ],
    status: 'online',
    link: 'http://localhost:3001',
    color: '#22c55e',
  },
  {
    icon: '🎮',
    title: 'Oneshot',
    subtitle: 'iOS Game App',
    stats: [
      { label: 'Version', value: 'v2.1.0' },
      { label: 'TestFlight', value: 'Active', trend: 'up' },
      { label: 'Downloads', value: '342' },
    ],
    status: 'online',
    color: '#8b5cf6',
  },
  {
    icon: '💰',
    title: 'Aura Clothing',
    subtitle: 'Amazon Store Revenue',
    stats: [
      { label: 'Revenue', value: '$2,847', trend: 'up' },
      { label: 'Orders', value: '85 total' },
      { label: 'Active SKUs', value: '47' },
    ],
    status: 'online',
    color: '#f59e0b',
  },
  {
    icon: '📊',
    title: 'MDP',
    subtitle: 'Monster Digital Platform',
    stats: [
      { label: 'Units Sold', value: '847', trend: 'up' },
      { label: 'Bestseller', value: 'Bob Ross Tee' },
      { label: 'Retailers', value: '4 active' },
    ],
    status: 'online',
    color: '#3b82f6',
  },
  {
    icon: '📱',
    title: 'Marketing',
    subtitle: 'Social & Outreach',
    stats: [
      { label: 'Campaigns', value: '2 active' },
      { label: 'Reach', value: '12.4K' },
      { label: 'Engagement', value: '4.2%' },
    ],
    status: 'warning',
    color: '#ec4899',
  },
  {
    icon: '💡',
    title: 'New Ideas',
    subtitle: 'Innovation Pipeline',
    stats: [
      { label: 'Concepts', value: '8 active' },
      { label: 'In Review', value: '3' },
      { label: 'Launched', value: '2 this month' },
    ],
    status: 'online',
    color: '#14b8a6',
  },
  {
    icon: '🎬',
    title: 'Licensing',
    subtitle: 'NatLamp • Bob Ross • Duck Dynasty',
    stats: [
      { label: 'Active Deals', value: '3' },
      { label: 'Revenue Share', value: '$18.2K' },
      { label: 'Renewals', value: '2 upcoming' },
    ],
    status: 'online',
    color: '#f97316',
  },
];

function StatusDot({ status }: { status: string }) {
  const cls = status === 'online' ? '' : status === 'warning' ? 'warning' : 'error';
  return <div className={`pulse-dot ${cls}`} />;
}

function TrendArrow({ trend }: { trend?: string }) {
  if (!trend) return null;
  if (trend === 'up') return <span style={{ color: '#22c55e', fontSize: '11px' }}>▲</span>;
  if (trend === 'down') return <span style={{ color: '#ef4444', fontSize: '11px' }}>▼</span>;
  return <span style={{ color: '#94a3b8', fontSize: '11px' }}>—</span>;
}

export default function EmpireCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      padding: '0',
    }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <a
            href={card.link || '#'}
            target={card.link ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="empire-card">
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{card.icon}</span>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: card.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {card.title}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#64748b',
                      marginTop: '2px',
                    }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>
                <StatusDot status={card.status} />
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {card.stats.map((stat) => (
                  <div key={stat.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                  }}>
                    <span style={{ color: '#64748b' }}>{stat.label}</span>
                    <span style={{
                      color: '#e2e8f0',
                      fontFamily: "'JetBrains Mono', monospace",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      {stat.value}
                      <TrendArrow trend={stat.trend} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(245, 158, 11, 0.08)',
                fontSize: '10px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>Updated 2m ago</span>
                {card.link && <span style={{ color: '#f59e0b' }}>Open →</span>}
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}
