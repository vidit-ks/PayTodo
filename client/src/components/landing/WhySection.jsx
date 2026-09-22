import React from 'react';

export default function WhySection() {
  return (
    <section style={{
      padding: '5rem 1rem',
      maxWidth: '850px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.7rem, 3vw, 2.3rem)',
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: '-0.02em',
        marginBottom: '1.25rem'
      }}>
        Your tasks shouldn't get in the way of your work.
      </h2>

      <p style={{
        fontSize: '1.05rem',
        color: '#64748b',
        lineHeight: '1.7',
        maxWidth: '620px',
        margin: '0 auto'
      }}>
        PayTodo keeps task management simple. No complicated project management systems. No overwhelming dashboards. Just your tasks, your priorities, and what needs to get done.
      </p>
    </section>
  );
}
