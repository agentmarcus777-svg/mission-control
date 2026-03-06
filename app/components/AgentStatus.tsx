'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Agent {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'offline';
  host: string;
  uptime: string;
  lastTask: string;
  cpu: number;
  memory: number;
}

const agents: Agent[] = [
  {
    name: 'MARCUS',
    role: 'Primary Agent',
    status: 'active',
    host: 'Mac Mini M4 Pro',
    uptime: '47h 23m',
    lastTask: 'Mission Control Deploy',
    cpu: 23,
    memory: 41,
  },
  {
    name: 'TITUS',
    role: 'Compute Node',
    status: 'active',
    host: 'Mac Mini M4 Pro',
    uptime: '23h 12m',
    lastTask: 'POD Batch Processing',
    cpu: 15,
    memory: 28,
  },
  {
    name: 'POD-PIPELINE',
    role: 'V7 Design Engine',
    status: 'idle',
    host: 'Titus',
    uptime: 'On-demand',
    lastTask: 'Batch #47 — 215 designs',
    cpu: 0,
    memory: 0,
  },
  {
    name: 'GATEWAY',
    role: 'Communication Hub',
    status: 'active',
    host: 'localhost:18789',
    uptime: '47h 23m',
    lastTask: 'Message Routing',
    cpu: 2,
    memory: 12,
  },
];

const statusColors: Record<string, string> = {
  active: '#22c55e',
  idle: '#f59e0b',
  offline: '#ef4444',
};

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{
      width: '60px',
      height: '4px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          height: '100%',
          background: color,
          borderRadius: '2px',
        }}
      />
    </div>
  );
}

export default function AgentStatus() {
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = Math.floor(now.getTime() / 3600000) % 100;
      const minutes = now.getMinutes();
      setUptime(`${hours}h ${minutes}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {agents.map((agent, i) => (
        <motion.div
          key={agent.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(21, 21, 48, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.08)',
          }}
        >
          {/* Status dot */}
          <div className={`pulse-dot ${agent.status === 'idle' ? 'warning' : agent.status === 'offline' ? 'error' : ''}`} />

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: statusColors[agent.status],
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '1px',
              }}>
                {agent.name}
              </span>
              <span style={{
                fontSize: '9px',
                color: '#475569',
                padding: '2px 6px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
              }}>
                {agent.role}
              </span>
            </div>
            <div style={{
              fontSize: '10px',
              color: '#475569',
              marginTop: '4px',
            }}>
              {agent.host} • {agent.lastTask}
            </div>
          </div>

          {/* Resource bars */}
          {agent.cpu > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9px', color: '#475569' }}>CPU</span>
                <MiniBar value={agent.cpu} color="#3b82f6" />
                <span style={{ fontSize: '9px', color: '#64748b', width: '28px', textAlign: 'right' }}>{agent.cpu}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9px', color: '#475569' }}>MEM</span>
                <MiniBar value={agent.memory} color="#8b5cf6" />
                <span style={{ fontSize: '9px', color: '#64748b', width: '28px', textAlign: 'right' }}>{agent.memory}%</span>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* System Summary */}
      <div style={{
        marginTop: '8px',
        padding: '12px 16px',
        background: 'rgba(245, 158, 11, 0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(245, 158, 11, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#64748b',
      }}>
        <span>System Uptime: {uptime || '—'}</span>
        <span style={{ color: '#22c55e' }}>● All Systems Nominal</span>
      </div>
    </div>
  );
}
