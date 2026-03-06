'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StatEntry {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface CardData {
  icon: string;
  title: string;
  subtitle: string;
  stats: StatEntry[];
  status: 'online' | 'warning' | 'offline';
  link?: string;
  color: string;
  lastUpdated?: string;
}

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
  const [cards, setCards] = useState<CardData[]>(getDefaultCards());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/pipeline-status');
        if (!res.ok) return;
        const data = await res.json();

        const totalCost = Object.values(data.costs as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
        const passRate = data.totalDesigns > 0
          ? Math.round((data.passedDesigns / data.totalDesigns) * 100)
          : 0;

        setCards(prev => prev.map(card => {
          if (card.title === 'POD Pipeline') {
            return {
              ...card,
              stats: [
                { label: 'Designs', value: `${data.passedDesigns} passed / ${data.totalDesigns} total`, trend: 'up' as const },
                { label: 'Pass Rate', value: `${passRate}%`, trend: passRate >= 50 ? 'up' as const : 'down' as const },
                { label: 'Cost', value: `$${totalCost.toFixed(2)}` },
              ],
              status: data.pipelineStatus === 'complete' ? 'online' as const : 'warning' as const,
              lastUpdated: data.lastUpdated,
            };
          }
          return card;
        }));
      } catch {
        // Keep defaults
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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

              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(245, 158, 11, 0.08)',
                fontSize: '10px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>{card.lastUpdated ? `Updated ${new Date(card.lastUpdated).toLocaleTimeString()}` : 'No live data'}</span>
                {card.link && <span style={{ color: '#f59e0b' }}>Open →</span>}
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}

function getDefaultCards(): CardData[] {
  return [
    {
      icon: '🎨',
      title: 'POD Pipeline',
      subtitle: 'Print-on-Demand Design Factory',
      stats: [
        { label: 'Designs', value: 'Loading...', trend: 'neutral' },
        { label: 'Pass Rate', value: '—' },
        { label: 'Cost', value: '—' },
      ],
      status: 'warning',
      link: 'http://localhost:3001',
      color: '#22c55e',
    },
    {
      icon: '💰',
      title: 'Aura Clothing',
      subtitle: 'Amazon POD Store',
      stats: [
        { label: 'Revenue', value: '—', trend: 'neutral' },
        { label: 'Orders', value: '—' },
        { label: 'Active SKUs', value: '—' },
      ],
      status: 'offline',
      color: '#f59e0b',
    },
    {
      icon: '📊',
      title: 'MDP',
      subtitle: 'Monster Digital Platform',
      stats: [
        { label: 'Units Sold', value: '—', trend: 'neutral' },
        { label: 'Bestseller', value: '—' },
        { label: 'Retailers', value: '—' },
      ],
      status: 'offline',
      color: '#3b82f6',
    },
    {
      icon: '🎬',
      title: 'Licensing',
      subtitle: 'NatLamp • Bob Ross • Duck Dynasty',
      stats: [
        { label: 'Active Deals', value: '—' },
        { label: 'Revenue Share', value: '—' },
        { label: 'Renewals', value: '—' },
      ],
      status: 'offline',
      color: '#f97316',
    },
    {
      icon: '🎮',
      title: 'Oneshot',
      subtitle: 'iOS Game App',
      stats: [
        { label: 'Version', value: '—' },
        { label: 'TestFlight', value: '—' },
        { label: 'Downloads', value: '—' },
      ],
      status: 'offline',
      color: '#8b5cf6',
    },
    {
      icon: '🖥️',
      title: 'Infrastructure',
      subtitle: 'Marcus + Titus Compute',
      stats: [
        { label: 'Marcus', value: 'M4 • 192.168.81.76' },
        { label: 'Titus', value: 'M4 Pro • 192.168.81.123' },
        { label: 'Gateway', value: 'Port 18789' },
      ],
      status: 'online',
      color: '#14b8a6',
    },
  ];
}
