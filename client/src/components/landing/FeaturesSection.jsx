import React from 'react';
import { 
  CheckSquare, 
  FolderCheck, 
  TrendingUp, 
  RotateCw, 
  SquareCheck, 
  Download, 
  Lock 
} from 'lucide-react';

export default function FeaturesSection({ onOpenAuth }) {
  const features = [
    {
      title: 'Simple Tasks',
      desc: 'Create, edit and complete tasks in seconds with instantaneous reactivity.',
      badge: 'Free',
      badgeClass: 'badge-low',
      icon: CheckSquare
    },
    {
      title: 'Custom Checkboxes',
      desc: 'Choose from multiple checkbox styles (Circle, Square, Ballot, Checkmark).',
      badge: 'Starter (₹5)',
      badgeClass: 'badge-category',
      icon: SquareCheck
    },
    {
      title: 'Smart Organization',
      desc: 'Categorize your day (Work, Study, Personal) and assign priority flags.',
      badge: 'Pro (₹10)',
      badgeClass: 'badge-medium',
      icon: FolderCheck
    },
    {
      title: 'Progress Tracking',
      desc: 'Real-time task counters and completion indicators to keep your momentum high.',
      badge: 'Free',
      badgeClass: 'badge-low',
      icon: TrendingUp
    },
    {
      title: 'Recurring Tasks',
      desc: 'Never forget repeating habits. Auto-generate daily, weekly, or monthly tasks.',
      badge: 'Business (₹20)',
      badgeClass: 'badge-high',
      icon: RotateCw
    },
    {
      title: 'Task Export',
      desc: 'Export your complete task archive as CSV spreadsheets whenever you need.',
      badge: 'Business (₹20)',
      badgeClass: 'badge-high',
      icon: Download
    }
  ];

  return (
    <section id="features" style={{
      padding: '5rem 1rem',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Everything you need. Nothing you don't.
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Start with essential free tools, and unlock tiered superpowers when your workflow scales.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    color: '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(13, 148, 136, 0.08)'
                  }}>
                    <Icon size={19} />
                  </div>

                  <span className={`badge ${feat.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
                  {feat.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
