'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchItem {
  id: string;
  type: 'memory' | 'task' | 'conversation';
  content: string;
  source: string;
  timestamp: string;
}

const filters = ['all', 'memory', 'task', 'conversation'] as const;

const typeBadgeColors: Record<string, { bg: string; text: string; label: string }> = {
  memory: { bg: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa', label: 'MEMORY' },
  task: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e', label: 'TASK' },
  conversation: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', label: 'CONV' },
};

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>('all');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (activeFilter !== 'all') params.set('filter', activeFilter);
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, activeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      search();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, activeFilter, search]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return 'just now';
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
  };

  return (
    <div>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        marginBottom: '16px',
      }}>
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b',
          fontSize: '16px',
          pointerEvents: 'none',
        }}>
          🔍
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memories, tasks, conversations..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            background: 'rgba(10, 10, 26, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', monospace",
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(245, 158, 11, 0.2)'; }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: activeFilter === f ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.15)',
              background: activeFilter === f ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeFilter === f ? '#f59e0b' : '#64748b',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.2s',
            }}
          >
            {f === 'all' ? 'All' : f === 'memory' ? 'Memories' : f === 'task' ? 'Tasks' : 'Conversations'}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        {isLoading && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '2px',
          }}>
            SEARCHING...
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div style={{
            padding: '30px 20px',
            textAlign: 'center',
            color: '#475569',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            NO RESULTS FOUND
          </div>
        )}

        <AnimatePresence>
          {!isLoading && results.map((item, i) => {
            const badge = typeBadgeColors[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(10, 10, 26, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    background: badge.bg,
                    color: badge.text,
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#e2e8f0',
                      lineHeight: '1.5',
                    }}>
                      {item.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '6px',
                      fontSize: '10px',
                      color: '#475569',
                    }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {item.source}
                      </span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
