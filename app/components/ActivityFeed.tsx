'use client';

import { motion } from 'framer-motion';

interface FeedItem {
  time: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  source: string;
}

const feedItems: FeedItem[] = [
  { time: '19:21', message: 'Mission Control dashboard deployed', type: 'success', source: 'MARCUS' },
  { time: '18:45', message: 'POD batch #47 completed — 12 designs generated', type: 'success', source: 'POD' },
  { time: '18:30', message: 'Dropbox sync: 12 files uploaded to Spring 2026', type: 'info', source: 'DROPBOX' },
  { time: '17:15', message: 'Printify: 3 new products published to Aura Clothing', type: 'success', source: 'PRINTIFY' },
  { time: '16:42', message: 'MDP report pulled — Bob Ross Tee still #1 bestseller', type: 'info', source: 'MDP' },
  { time: '15:30', message: 'Oneshot build v2.1.0 submitted to TestFlight', type: 'success', source: 'ONESHOT' },
  { time: '14:20', message: 'Email: Target buyer review scheduled for Friday', type: 'warning', source: 'EMAIL' },
  { time: '13:05', message: 'Amazon order #847 fulfilled — Duck Dynasty Hoodie', type: 'success', source: 'AMAZON' },
  { time: '12:30', message: 'Notion task board updated — 4 tasks completed', type: 'info', source: 'NOTION' },
  { time: '11:15', message: 'Kohl\'s product URLs verified via reverse image search', type: 'info', source: 'TOOLS' },
  { time: '10:00', message: 'Morning systems check — all nodes operational', type: 'success', source: 'SYSTEM' },
  { time: '09:30', message: 'Calendar: Blended Clothing production call at 2pm', type: 'warning', source: 'CALENDAR' },
];

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
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      maxHeight: '500px',
      overflowY: 'auto',
    }}>
      {feedItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
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
    </div>
  );
}
