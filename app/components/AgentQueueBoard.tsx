'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AgentTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  notes: string;
  deadline: string;
}

interface AgentSnapshot {
  agent: string;
  source: 'local' | 'remote-file' | 'unavailable';
  currentTask: AgentTask | null;
  activeTasks: AgentTask[];
  summary: string;
}

function statusColor(status: string) {
  if (status === 'in_progress') return '#22c55e';
  if (status === 'blocked') return '#ef4444';
  if (status === 'queued') return '#f59e0b';
  return '#94a3b8';
}

function priorityColor(priority: string) {
  if (priority === 'p0') return '#ef4444';
  if (priority === 'p1') return '#f59e0b';
  if (priority === 'p2') return '#3b82f6';
  return '#64748b';
}

export default function AgentQueueBoard() {
  const [agents, setAgents] = useState<AgentSnapshot[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/agent-queue');
        const data = await res.json();
        setAgents(data.agents || []);
      } catch {
        setAgents([]);
      }
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {agents.map((agent, idx) => (
        <motion.div
          key={agent.agent}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          style={{
            background: 'rgba(21, 21, 48, 0.45)',
            borderRadius: 14,
            border: '1px solid rgba(245, 158, 11, 0.12)',
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', letterSpacing: 1 }}>{agent.agent}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{agent.source === 'unavailable' ? 'Task feed unavailable' : 'Live task queue'}</div>
            </div>
            {agent.currentTask && (
              <div style={{
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 999,
                background: `${priorityColor(agent.currentTask.priority)}22`,
                color: priorityColor(agent.currentTask.priority),
                border: `1px solid ${priorityColor(agent.currentTask.priority)}55`,
                textTransform: 'uppercase',
              }}>
                {agent.currentTask.priority}
              </div>
            )}
          </div>

          <div style={{
            padding: 14,
            borderRadius: 12,
            background: 'rgba(10, 10, 26, 0.55)',
            border: '1px solid rgba(245, 158, 11, 0.08)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, letterSpacing: 1 }}>WORKING ON RIGHT NOW</div>
            <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, marginBottom: 8 }}>
              {agent.currentTask?.title || 'No current task'}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: statusColor(agent.currentTask?.status || ''), fontSize: 11, textTransform: 'uppercase' }}>
                {agent.currentTask?.status?.replace('_', ' ') || agent.summary}
              </span>
              {agent.currentTask?.deadline && (
                <span style={{ color: '#94a3b8', fontSize: 11 }}>Due {agent.currentTask.deadline}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agent.activeTasks.slice(0, 5).map((task) => (
              <div key={task.id} style={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr auto',
                gap: 10,
                alignItems: 'start',
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ color: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{task.id}</span>
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: 12 }}>{task.title}</div>
                  <div style={{ color: statusColor(task.status), fontSize: 10, textTransform: 'uppercase', marginTop: 4 }}>{task.status.replace('_', ' ')}</div>
                </div>
                <span style={{ color: priorityColor(task.priority), fontSize: 10, textTransform: 'uppercase' }}>{task.priority}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
