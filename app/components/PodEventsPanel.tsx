'use client';

import { useEffect, useState } from 'react';

interface PodEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  note: string;
}

export default function PodEventsPanel() {
  const [events, setEvents] = useState<PodEvent[]>([]);

  useEffect(() => {
    fetch('/api/pod-events')
      .then((res) => res.json())
      .then((data) => setEvents(data || []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {events.map((event) => (
        <div key={event.id} style={{
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{event.title}</div>
            <div style={{ color: '#f59e0b', fontSize: 11, whiteSpace: 'nowrap' }}>{event.date}</div>
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 4, textTransform: 'uppercase' }}>{event.type}</div>
          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>{event.note}</div>
        </div>
      ))}
    </div>
  );
}
