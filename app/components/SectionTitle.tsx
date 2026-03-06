'use client';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px',
    }}>
      {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      <div>
        <h2 style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#f59e0b',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{
            fontSize: '10px',
            color: '#475569',
            margin: '2px 0 0',
          }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), transparent)',
        marginLeft: '12px',
      }} />
    </div>
  );
}
