'use client';

import { useState } from 'react';

const periods = ['Today', 'Week', 'Month', 'All'];

export default function TimeFilter() {
  const [active, setActive] = useState('Today');

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {periods.map((period) => (
        <button
          key={period}
          className={`time-btn ${active === period ? 'active' : ''}`}
          onClick={() => setActive(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
