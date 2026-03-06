'use client';

import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

const stats: Stat[] = [
  { label: 'REVENUE (MTD)', value: '$18,247', change: '+12.3%', positive: true },
  { label: 'ACTIVE SKUS', value: '147', change: '+8', positive: true },
  { label: 'DESIGNS TODAY', value: '12', change: '+4', positive: true },
  { label: 'ORDERS (MTD)', value: '234', change: '+18%', positive: true },
  { label: 'ACTIVE DEALS', value: '7', change: '0', positive: true },
  { label: 'PLATFORMS', value: '6', change: '+1', positive: true },
];

export default function QuickStats() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px',
    }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            padding: '16px',
            background: 'rgba(21, 21, 48, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.08)',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: '10px',
            color: '#475569',
            letterSpacing: '1px',
            marginBottom: '8px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stat.label}
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#e2e8f0',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '11px',
            color: stat.positive ? '#22c55e' : '#ef4444',
            marginTop: '4px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {stat.positive ? '▲' : '▼'} {stat.change}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
