import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Layers
} from 'lucide-react';

export default function PlansPage() {
  const { subscription, refreshSubscription } = useApp();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const res = await api.getPlans();
        if (res.success) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (plan.slug === subscription?.plan) return;
    if (plan.slug === 'free') {
      if (window.confirm('Switch back to the Free plan?')) {
        api.changePlan('free').then(() => refreshSubscription());
      }
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const planFeaturesList = {
    free: [
      'Basic to-do management',
      '10 active tasks limit',
      'Standard circle checkbox'
    ],
    starter: [
      '50 active tasks limit',
      'Custom checkbox styles (Circle, Square, Ballot, Checkmark)',
      'Basic to-do lists'
    ],
    pro: [
      '100 active tasks limit',
      'Priority labels (High, Medium, Low)',
      'Custom task categories (Work, Study, Personal, etc.)',
      'Custom checkbox styles',
      'Everything in Starter'
    ],
    business: [
      'Unlimited active tasks',
      'Recurring task schedules (Daily, Weekly, Monthly)',
      'Task analytics and charts',
      'Export tasks to CSV',
      'Everything in Pro'
    ]
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 1rem 4rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '0.4rem' }}>
          Subscription Plans
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
          Choose a plan that fits your productivity requirements. Instant activation with Razorpay Test Mode.
        </p>
      </div>

      {/* Pricing Cards Grid (Spec #10 & #12) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3.5rem'
      }}>
        {plans.map((plan) => {
          const isCurrent = subscription?.plan === plan.slug;
          const isFeatured = plan.slug === 'pro';

          return (
            <div
              key={plan.id}
              className="glass-panel"
              style={{
                padding: '1.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: isCurrent 
                  ? '2px solid #10b981' 
                  : isFeatured 
                  ? '2px solid var(--primary-500)' 
                  : '1px solid var(--border-subtle)'
              }}
            >
              <div>
                {/* Plan Title */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {plan.name}
                  </span>
                  {isFeatured && (
                    <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>
                      Popular
                    </span>
                  )}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    ₹{Number(plan.price)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    /{plan.billing_interval || 'month'}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minHeight: '36px', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                  {plan.description}
                </p>

                {/* Features List */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {(planFeaturesList[plan.slug] || []).map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: '#334155' }}>
                        <Check size={14} color="#10b981" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontWeight: '700',
                      border: '1px solid #bbf7d0',
                      cursor: 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>Current Plan</span>
                  </button>
                ) : (
                  <button
                    className={isFeatured ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => handleSelectPlan(plan)}
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                  >
                    <span>{Number(plan.price) === 0 ? 'Switch to Free' : `Upgrade (${plan.name})`}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem' }}>
          Feature Breakdown
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.75rem', color: 'var(--text-main)' }}>Feature</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Free (₹0)</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Starter (₹5)</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Pro (₹10)</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center', color: 'var(--primary-600)' }}>Business (₹20)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Active Tasks</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>10 tasks</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>50 tasks</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>100 tasks</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '700', color: 'var(--primary-600)' }}>Unlimited</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Custom Checkbox Styles</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Priority Labels</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Task Categories</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Recurring Schedules</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>Task Analytics</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: '600' }}>CSV Export</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>—</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
