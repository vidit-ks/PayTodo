import React from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ArrowRight, X, ShieldCheck } from 'lucide-react';

export default function UpgradeModal({ onNavigateToPlans }) {
  const { upgradeModal, closeUpgradeModal } = useApp();

  if (!upgradeModal.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeUpgradeModal}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.75rem', textAlign: 'center', position: 'relative' }}
      >
        <button 
          onClick={closeUpgradeModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'var(--text-muted)',
            background: '#f1f5f9',
            borderRadius: 'var(--radius-sm)',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={15} />
        </button>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--primary-50)',
          color: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <Lock size={22} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.35rem' }}>
          Feature Locked
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          <strong>{upgradeModal.featureName || 'This feature'}</strong> requires the{' '}
          <strong style={{ color: 'var(--primary-600)' }}>{upgradeModal.requiredPlan || 'Pro'}</strong> plan or higher.
        </p>

        <div style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem',
          textAlign: 'left',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#334155', marginBottom: '0.3rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Instant Razorpay test activation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Cancel anytime without penalty</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
          <button 
            className="btn-secondary" 
            onClick={closeUpgradeModal}
            style={{ flex: '1' }}
          >
            Close
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              closeUpgradeModal();
              if (onNavigateToPlans) onNavigateToPlans();
            }}
            style={{ flex: '1.2' }}
          >
            <span>View Plans</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
