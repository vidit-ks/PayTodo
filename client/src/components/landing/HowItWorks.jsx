import React from 'react';
import { PlusCircle, Sliders, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Add',
      desc: 'Add the tasks you need to get done in seconds with a clean, fast interface.',
      icon: PlusCircle
    },
    {
      num: '02',
      title: 'Organize',
      desc: 'Keep your day organized with categories, priorities, and simple task management.',
      icon: Sliders
    },
    {
      num: '03',
      title: 'Complete',
      desc: 'Check tasks off and see your daily progress grow without unnecessary distraction.',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" style={{
      padding: '5rem 1rem',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Simple by design.
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Everything you need to stay productive, without complex setup.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '14px',
                padding: '2rem 1.5rem',
                position: 'relative',
                boxShadow: '0 4px 14px -2px rgba(15, 23, 42, 0.07)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.1)'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8' }}>
                  {step.num}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                {step.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5' }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
