'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
      setDate(now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
      background: 'rgba(10, 10, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 700,
          color: '#000',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
        }}>
          ⚡
        </div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#f59e0b',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            MISSION CONTROL
          </div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '2px',
            color: '#94a3b8',
            marginTop: '2px',
          }}>
            BCI EMPIRE COMMAND CENTER
          </div>
        </div>
      </div>

      {/* Center: Ticker */}
      <div className="ticker-wrap" style={{
        flex: 1,
        maxWidth: '500px',
        margin: '0 32px',
        borderLeft: '1px solid rgba(245, 158, 11, 0.15)',
        borderRight: '1px solid rgba(245, 158, 11, 0.15)',
        padding: '0 16px',
      }}>
        <div className="ticker-content" style={{
          fontSize: '11px',
          color: '#94a3b8',
          letterSpacing: '0.5px',
        }}>
          <span style={{ color: '#22c55e' }}>▲ POD</span> 12 designs today &nbsp;•&nbsp;
          <span style={{ color: '#f59e0b' }}>◆ AURA</span> $2.4K revenue &nbsp;•&nbsp;
          <span style={{ color: '#3b82f6' }}>● MDP</span> 847 units &nbsp;•&nbsp;
          <span style={{ color: '#22c55e' }}>▲ ONESHOT</span> v2.1 live &nbsp;•&nbsp;
          <span style={{ color: '#f59e0b' }}>◆ LICENSING</span> 3 active deals &nbsp;•&nbsp;
          <span style={{ color: '#22c55e' }}>▲ MARCUS</span> all systems nominal &nbsp;•&nbsp;
          <span style={{ color: '#22c55e' }}>▲ POD</span> 12 designs today &nbsp;•&nbsp;
          <span style={{ color: '#f59e0b' }}>◆ AURA</span> $2.4K revenue &nbsp;•&nbsp;
          <span style={{ color: '#3b82f6' }}>● MDP</span> 847 units &nbsp;•&nbsp;
          <span style={{ color: '#22c55e' }}>▲ ONESHOT</span> v2.1 live &nbsp;•&nbsp;
          <span style={{ color: '#f59e0b' }}>◆ LICENSING</span> 3 active deals &nbsp;•&nbsp;
          <span style={{ color: '#22c55e' }}>▲ MARCUS</span> all systems nominal &nbsp;•&nbsp;
        </div>
      </div>

      {/* Right: Clock */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 300,
          color: '#e2e8f0',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '2px',
        }}>
          {time}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#64748b',
          letterSpacing: '1px',
        }}>
          {date} • PST
        </div>
      </div>
    </header>
  );
}
