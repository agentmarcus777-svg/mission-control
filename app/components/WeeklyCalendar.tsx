'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  day: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  color: string;
  category: string;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);

export default function WeeklyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load calendar:', err));
  }, []);

  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return DAYS.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        label,
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === now.toDateString(),
      };
    });
  };

  const weekDates = getWeekDates();

  const getEventStyle = (event: CalendarEvent) => {
    const startOffset = (event.startHour - 8) * 48 + (event.startMin / 60) * 48;
    const duration = ((event.endHour - event.startHour) * 60 + (event.endMin - event.startMin)) / 60 * 48;
    return {
      top: `${startOffset}px`,
      height: `${Math.max(duration, 20)}px`,
    };
  };

  const formatTime = (h: number, m: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div>
      {/* Week Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '50px repeat(7, 1fr)',
        gap: '0',
        marginBottom: '0',
      }}>
        <div />
        {weekDates.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
            }}
          >
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              color: d.isToday ? '#f59e0b' : '#64748b',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {d.label}
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: d.isToday ? 700 : 400,
              color: d.isToday ? '#f59e0b' : '#94a3b8',
              marginTop: '2px',
              ...(d.isToday ? {
                background: 'rgba(245, 158, 11, 0.15)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '2px auto 0',
              } : {}),
            }}>
              {d.date}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '50px repeat(7, 1fr)',
        position: 'relative',
        maxHeight: '380px',
        overflowY: 'auto',
      }}>
        {/* Hour Labels */}
        <div>
          {HOURS.map(h => (
            <div key={h} style={{
              height: '48px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: '8px',
              paddingTop: '0',
              fontSize: '9px',
              color: '#475569',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {h > 12 ? h - 12 : h}{h >= 12 ? 'P' : 'A'}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {DAYS.map((_, dayIdx) => (
          <div
            key={dayIdx}
            style={{
              position: 'relative',
              borderLeft: '1px solid rgba(245, 158, 11, 0.05)',
            }}
          >
            {/* Hour grid lines */}
            {HOURS.map(h => (
              <div key={h} style={{
                height: '48px',
                borderBottom: '1px solid rgba(245, 158, 11, 0.04)',
              }} />
            ))}

            {/* Events */}
            {events
              .filter(e => e.day === dayIdx + 1)
              .map(event => {
                const evtStyle = getEventStyle(event);
                const isHovered = hoveredEvent === event.id;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onHoverStart={() => setHoveredEvent(event.id)}
                    onHoverEnd={() => setHoveredEvent(null)}
                    style={{
                      position: 'absolute',
                      top: evtStyle.top,
                      left: '2px',
                      right: '2px',
                      height: evtStyle.height,
                      background: `${event.color}22`,
                      borderLeft: `3px solid ${event.color}`,
                      borderRadius: '4px',
                      padding: '3px 6px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      zIndex: isHovered ? 10 : 1,
                      transition: 'all 0.2s',
                      ...(isHovered ? {
                        background: `${event.color}33`,
                        boxShadow: `0 2px 12px ${event.color}33`,
                      } : {}),
                    }}
                  >
                    <div style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      color: event.color,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {event.title}
                    </div>
                    <div style={{
                      fontSize: '8px',
                      color: '#64748b',
                      marginTop: '1px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {formatTime(event.startHour, event.startMin)}
                    </div>
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        background: 'rgba(21, 21, 48, 0.95)',
                        border: `1px solid ${event.color}44`,
                        borderRadius: '6px',
                        padding: '8px 10px',
                        zIndex: 20,
                        minWidth: '160px',
                        backdropFilter: 'blur(10px)',
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: event.color, marginBottom: '4px' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>
                          {event.description}
                        </div>
                        <div style={{ fontSize: '9px', color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatTime(event.startHour, event.startMin)} – {formatTime(event.endHour, event.endMin)}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
