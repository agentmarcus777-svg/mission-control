'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

interface PipelineStats {
  passed: number;
  failed: number;
  errors: number;
  avgScore: number;
}

interface PipelineData {
  totalDesigns: number;
  passedDesigns: number;
  errorDesigns: number;
  batches: Array<{ id: string }>;
  stats: PipelineStats;
  costs: Record<string, number>;
  pipelineStatus: string;
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'TOTAL DESIGNS', value: '—', change: '', positive: true },
    { label: 'PASSED QA', value: '—', change: '', positive: true },
    { label: 'PASS RATE', value: '—', change: '', positive: true },
    { label: 'AVG SCORE', value: '—', change: '', positive: true },
    { label: 'BATCHES RUN', value: '—', change: '', positive: true },
    { label: 'PIPELINE COST', value: '—', change: '', positive: true },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/pipeline-status');
        if (!res.ok) return;
        const data: PipelineData = await res.json();

        const totalCost = Object.values(data.costs).reduce((a, b) => a + b, 0);
        const passRate = data.totalDesigns > 0
          ? Math.round((data.passedDesigns / data.totalDesigns) * 100)
          : 0;

        setStats([
          {
            label: 'TOTAL DESIGNS',
            value: data.totalDesigns.toString(),
            change: `${data.errorDesigns} errors`,
            positive: data.errorDesigns === 0,
          },
          {
            label: 'PASSED QA',
            value: data.passedDesigns.toString(),
            change: `of ${data.totalDesigns}`,
            positive: true,
          },
          {
            label: 'PASS RATE',
            value: `${passRate}%`,
            change: data.stats.avgScore > 70 ? 'good' : 'needs work',
            positive: passRate >= 50,
          },
          {
            label: 'AVG SCORE',
            value: `${data.stats.avgScore}/100`,
            change: `${data.stats.passed} passed`,
            positive: data.stats.avgScore >= 70,
          },
          {
            label: 'BATCHES RUN',
            value: data.batches.length.toString(),
            change: data.pipelineStatus,
            positive: data.pipelineStatus === 'complete',
          },
          {
            label: 'PIPELINE COST',
            value: `$${totalCost.toFixed(2)}`,
            change: 'all-time',
            positive: true,
          },
        ]);
      } catch {
        // Keep showing "—" if pipeline unreachable
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
            {stat.change}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
