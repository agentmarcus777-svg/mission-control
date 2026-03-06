'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedItem {
  id: string;
  time: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  source: string;
}

const typeColors: Record<string, string> = {
  success: '#22c55e',
  info: '#3b82f6',
  warning: '#f59e0b',
  error: '#ef4444',
};

const typeIcons: Record<string, string> = {
  success: '✓',
  info: '●',
  warning: '⚠',
  error: '✕',
};

export default function ActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/activity');
      const data = await res.json();
      const mapped = data.map((item: { id: string; time: string; message: string; type: string; source: string }) => ({
        id: item.id,
        time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: item.message,
        type: item.type,
        source: item.source,
      }));
      setItems(mapped);
      setLastUpdate(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Live indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
        marginBottom: '8px',
        fontSize: '9px',
        color: '#475569',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#22c55e',
          display: 'inline-block',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        LIVE • Updated {lastUpdate}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        maxHeight: '500px',
        overflowY: 'auto',
      }}>
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="feed-item"
              style={{ borderLeftColor: typeColors[item.type] }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{
                  color: typeColors[item.type],
                  fontSize: '12px',
                  fontWeight: 600,
                  minWidth: '14px',
                }}>
                  {typeIcons[item.type]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#e2e8f0',
                    lineHeight: '1.4',
                  }}>
                    {item.message}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '4px',
                    fontSize: '10px',
                    color: '#475569',
                  }}>
                    <span>{item.time}</span>
                    <span style={{
                      color: typeColors[item.type],
                      opacity: 0.7,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.5px',
                    }}>
                      {item.source}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
