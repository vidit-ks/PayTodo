import React from 'react';

export default function StatsSection() {
  const stats = [
    { value: '10', label: 'Free active tasks limit' },
    { value: '3', label: 'Simple premium plans' },
    { value: '₹5', label: 'Starting monthly plan' },
    { value: '1', label: 'Simple place for your tasks' }
  ];

  return (
    <section style={{
      padding: '3.5rem 1rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.5rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '2rem',
        textAlign: 'center'
      }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div className="gradient-text" style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              marginBottom: '0.25rem'
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
