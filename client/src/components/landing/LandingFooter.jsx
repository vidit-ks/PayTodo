import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function LandingFooter() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      padding: '3.5rem 1rem 2.5rem 1rem',
      background: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <CheckSquare size={15} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
              PayTodo
            </span>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Simple tasks. Better focus.
            </p>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <button onClick={() => scrollTo('how-it-works')} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>How It Works</button>
          <button onClick={() => scrollTo('features')} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Features</button>
          <button onClick={() => scrollTo('pricing')} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Plans</button>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          © 2026 PayTodo
        </div>
      </div>
    </footer>
  );
}
