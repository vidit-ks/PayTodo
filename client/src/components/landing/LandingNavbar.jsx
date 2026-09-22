import React, { useState, useEffect } from 'react';
import { CheckSquare, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingNavbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.75rem 1rem' : '1.25rem 1rem',
      transition: 'all 0.25s ease'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        borderRadius: scrolled ? '12px' : '16px',
        background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid #e2e8f0',
        boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : 'none',
        transition: 'all 0.25s ease'
      }}>
        {/* Brand */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
          }}>
            <CheckSquare size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            PayTodo
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="landing-desktop-nav">
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{ fontSize: '0.88rem', fontWeight: '500', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#0d9488'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            style={{ fontSize: '0.88rem', fontWeight: '500', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#0d9488'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('demo')}
            style={{ fontSize: '0.88rem', fontWeight: '500', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#0d9488'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Interactive Demo
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            style={{ fontSize: '0.88rem', fontWeight: '500', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#0d9488'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Plans
          </button>
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onOpenAuth()}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#0f172a',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0d9488'}
            onMouseLeave={(e) => e.target.style.color = '#0f172a'}
          >
            Login
          </button>

          <button
            onClick={() => onOpenAuth()}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem', color: '#0f172a', background: 'none', border: 'none' }}
            className="landing-mobile-trigger"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          maxWidth: '1100px',
          margin: '0.5rem auto 0 auto',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button onClick={() => scrollToSection('how-it-works')} style={{ textAlign: 'left', padding: '0.5rem', fontWeight: '500', color: '#0f172a' }}>How It Works</button>
          <button onClick={() => scrollToSection('features')} style={{ textAlign: 'left', padding: '0.5rem', fontWeight: '500', color: '#0f172a' }}>Features</button>
          <button onClick={() => scrollToSection('demo')} style={{ textAlign: 'left', padding: '0.5rem', fontWeight: '500', color: '#0f172a' }}>Interactive Demo</button>
          <button onClick={() => scrollToSection('pricing')} style={{ textAlign: 'left', padding: '0.5rem', fontWeight: '500', color: '#0f172a' }}>Plans</button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .landing-desktop-nav { display: flex !important; }
          .landing-mobile-trigger { display: none !important; }
        }
        @media (max-width: 767px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-trigger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
