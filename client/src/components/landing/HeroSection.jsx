import React from 'react';
import InteractiveTodoHero from './InteractiveTodoHero';
import { ArrowRight, ChevronDown, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onOpenAuth }) {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      padding: '7rem 1rem 4rem 1rem',
      maxWidth: '1100px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* Micro Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: '#f0fdfa',
        border: '1px solid #ccfbf1',
        padding: '0.35rem 0.95rem',
        borderRadius: '999px',
        fontSize: '0.82rem',
        color: '#0f766e',
        fontWeight: '600',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 8px rgba(13, 148, 136, 0.1)'
      }}>
        <ShieldCheck size={15} color="#0d9488" />
        <span>Simple, distraction-free productivity</span>
      </div>

      {/* Main Headline (Spec #3) */}
      <h1 style={{
        fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        letterSpacing: '-0.03em',
        color: '#0f172a',
        marginBottom: '1rem'
      }}>
        Get things done.<br />
        <span className="gradient-text">Without the clutter.</span>
      </h1>

      {/* Supporting Text (Spec #3) */}
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        color: '#64748b',
        maxWidth: '560px',
        margin: '0 auto 2rem auto',
        lineHeight: '1.6'
      }}>
        A simple, beautiful to-do app designed to help you organize your day and focus on what matters.
      </p>

      {/* Hero CTA Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '3.5rem'
      }}>
        <button
          onClick={() => onOpenAuth()}
          className="btn-primary"
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
        >
          <span>Get Started Free</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={scrollToFeatures}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
        >
          <span>Explore Features</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Visual Hero: Floating Todo Interface */}
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <InteractiveTodoHero />
      </div>
    </section>
  );
}
