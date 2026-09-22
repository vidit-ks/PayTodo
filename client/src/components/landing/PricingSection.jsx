import React from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingSection({ onOpenAuth }) {
  const plans = [
    {
      name: 'Free',
      price: '0',
      desc: 'Essential to-do management for personal productivity.',
      features: [
        '10 active tasks limit',
        'Basic to-do list',
        'Real-time task completion',
        'Standard checkbox'
      ],
      buttonText: 'Start Free',
      featured: false
    },
    {
      name: 'Starter',
      price: '5',
      desc: 'Expanded task limits and personalized styling.',
      features: [
        '50 active tasks limit',
        'Custom checkbox styles',
        'Everything in Free',
        'Faster workflows'
      ],
      buttonText: 'Get Starter (₹5)',
      featured: false
    },
    {
      name: 'Pro',
      price: '10',
      desc: 'Advanced organization with priorities and categories.',
      features: [
        '100 active tasks limit',
        'Task categories (Work, Study, etc.)',
        'Priority tags (High, Med, Low)',
        'Custom checkbox styles',
        'Everything in Starter'
      ],
      buttonText: 'Get Pro (₹10)',
      featured: true
    },
    {
      name: 'Business',
      price: '20',
      desc: 'Unlimited power, recurring tasks, and visual analytics.',
      features: [
        'Unlimited active tasks',
        'Recurring task schedules',
        'Visual task analytics & charts',
        'CSV spreadsheet export',
        'Everything in Pro'
      ],
      buttonText: 'Get Business (₹20)',
      featured: false
    }
  ];

  return (
    <section id="pricing" style={{
      padding: '5rem 1rem',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Simple plans. Small price.
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Start free. Upgrade only when you need more productivity power.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem'
      }}>
        {plans.map((p) => (
          <div
            key={p.name}
            style={{
              background: '#ffffff',
              border: p.featured ? '2px solid #0d9488' : '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.75rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: p.featured ? '0 12px 30px -5px rgba(13, 148, 136, 0.2)' : 'none',
              transform: p.featured ? 'scale(1.02)' : 'none',
              zIndex: p.featured ? 2 : 1
            }}
          >
            {p.featured && (
              <div style={{
                position: 'absolute',
                top: '-11px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '0.2rem 0.75rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
              }}>
                Recommended
              </div>
            )}

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                {p.name}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                  ₹{p.price}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/month</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748b', minHeight: '36px', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                {p.desc}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {p.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: '#334155' }}>
                      <Check size={14} color="#10b981" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth()}
              className={p.featured ? 'btn-primary' : 'btn-secondary'}
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <span>{p.buttonText}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Payment Explanation Flow (Spec #13) */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
          Upgrade in seconds
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          color: '#64748b',
          fontSize: '0.85rem'
        }}>
          <span>1. Choose a plan</span>
          <span>→</span>
          <span>2. Secure checkout</span>
          <span>→</span>
          <span style={{ color: '#10b981', fontWeight: '700' }}>3. Features unlocked</span>
        </div>
      </div>
    </section>
  );
}
