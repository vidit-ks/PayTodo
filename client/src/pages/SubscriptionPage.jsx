import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  XCircle, 
  Database
} from 'lucide-react';

export default function SubscriptionPage({ onNavigateToPlans }) {
  const { user, subscription, refreshSubscription } = useApp();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      const res = await api.cancelSubscription();
      if (res.success) {
        setMessage('Subscription scheduled for cancellation at the end of the billing period.');
        setShowCancelConfirm(false);
        refreshSubscription();
      }
    } catch (err) {
      setMessage(err.message || 'Failed to cancel subscription.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isFree = !subscription || subscription.plan === 'free';
  const isCancelled = subscription?.cancel_at_period_end || subscription?.status === 'cancelled';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem 4rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', marginBottom: '0.25rem' }}>
          Subscription Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your plan, billing renewal dates, and workspace features.
        </p>
      </div>

      {message && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <ShieldCheck size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Main Subscription Card (Spec #22) */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Tier
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {subscription?.plan_name || 'Free'} Plan
              </h2>
              <span className={`badge ${isCancelled ? 'badge-medium' : isFree ? 'badge-category' : 'badge-low'}`}>
                {isCancelled ? 'Cancels at Period End' : isFree ? 'Active' : 'Active'}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
              ₹{subscription?.price || 0}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/month</span>
          </div>
        </div>

        {/* Billing Period Details */}
        <div style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Period Start
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {formatDate(subscription?.current_period_start)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Period End / Renewal
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {formatDate(subscription?.current_period_end)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Payment Provider
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#15803d', marginTop: '0.15rem' }}>
              Razorpay Test Mode
            </div>
          </div>
        </div>

        {/* Active Features List */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Active Feature Entitlements
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {(subscription?.features || ['basic_tasks']).map((f, i) => (
              <span key={i} className="badge badge-category" style={{ padding: '0.25rem 0.55rem' }}>
                <Check size={12} color="#10b981" strokeWidth={2.5} />
                <span>{f.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          {!isFree && !isCancelled && (
            <button
              className="btn-secondary"
              onClick={() => setShowCancelConfirm(true)}
              style={{ color: '#dc2626', borderColor: '#fecaca' }}
            >
              <XCircle size={15} />
              <span>Cancel Subscription</span>
            </button>
          )}

          <button
            className="btn-primary"
            onClick={onNavigateToPlans}
          >
            <span>{isFree ? 'Upgrade Plan' : 'Change Plan'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal (Spec #26) */}
      {showCancelConfirm && (
        <div className="modal-overlay" onClick={() => setShowCancelConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <AlertCircle size={22} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>
              Cancel Subscription?
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '1.25rem' }}>
              Your features will remain available until the end of your billing period ({formatDate(subscription?.current_period_end)}).
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Plan
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                style={{ background: '#dc2626' }}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Demo Guide Note (Spec #52) */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: '#f8fafc',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <Database size={15} color="var(--primary-500)" />
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Manual Supabase Control (Spec #52)
          </h4>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
          Developers can modify subscriptions directly in the Supabase PostgreSQL <code style={{ background: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>subscriptions</code> table:
        </p>
        <div style={{
          background: '#0f172a',
          color: '#38bdf8',
          padding: '0.6rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          fontFamily: 'monospace'
        }}>
          UPDATE subscriptions SET plan_id = (SELECT id FROM plans WHERE slug = 'business') WHERE user_id = {user?.id || 101};
        </div>
      </div>
    </div>
  );
}
