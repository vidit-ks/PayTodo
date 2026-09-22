import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  X, 
  Loader2, 
  ArrowRight
} from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, selectedPlan, onSuccess }) {
  const { user, refreshSubscription } = useApp();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  if (!isOpen || !selectedPlan) return null;

  const handleStartPayment = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Create order on backend
      const orderRes = await api.createOrder(selectedPlan.slug);
      const { order_id, amount, key_id } = orderRes.order;

      const isRealRazorpay = window.Razorpay && key_id && key_id.startsWith('rzp_test_') && !key_id.includes('placeholder');

      if (isRealRazorpay) {
        const options = {
          key: key_id,
          amount: amount,
          currency: 'INR',
          name: 'PayTodo',
          description: `${selectedPlan.name} Subscription`,
          order_id: order_id,
          handler: async function (response) {
            try {
              const verifyRes = await api.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_slug: selectedPlan.slug
              });

              await refreshSubscription();
              setPaymentResult(verifyRes);
              setPaymentSuccess(true);
              if (onSuccess) onSuccess();
            } catch (err) {
              setErrorMsg(err.message || 'Payment verification failed.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || 'Demo User',
            email: 'demo@paytodo.com',
            contact: '9999999999'
          },
          theme: {
            color: '#0d9488'
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // High-fidelity Sandbox Simulator for local development
        setTimeout(async () => {
          try {
            const simulatedPaymentId = `pay_rzp_sim_${Date.now()}`;
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: order_id,
              razorpay_payment_id: simulatedPaymentId,
              razorpay_signature: 'simulated_signature',
              plan_slug: selectedPlan.slug
            });

            await refreshSubscription();
            setPaymentResult(verifyRes);
            setPaymentSuccess(true);
            if (onSuccess) onSuccess();
          } catch (err) {
            setErrorMsg(err.message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMsg(err.message || 'Failed to initiate payment.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentSuccess(false);
    setErrorMsg('');
    setPaymentResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.75rem', position: 'relative', textAlign: paymentSuccess ? 'center' : 'left' }}
      >
        <button 
          onClick={handleClose}
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

        {!paymentSuccess ? (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Upgrade to {selectedPlan.name}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Complete payment via Razorpay Test Mode.
            </p>

            {/* Plan Summary Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: '700' }}>{selectedPlan.name} Plan</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  ₹{selectedPlan.price}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>/mo</span>
                </span>
              </div>
              
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                {selectedPlan.description}
              </div>
            </div>

            {errorMsg && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}>
                {errorMsg}
              </div>
            )}

            {/* Test Mode Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: '#15803d',
              background: '#f0fdf4',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              border: '1px solid #bbf7d0'
            }}>
              <ShieldCheck size={15} />
              <span>Razorpay Test Sandbox (No real funds charged)</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleStartPayment}
                disabled={loading}
                style={{ minWidth: '160px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={15} />
                    <span>Pay ₹{selectedPlan.price}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success State */
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: '#f0fdf4',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              border: '1px solid #bbf7d0'
            }}>
              <CheckCircle2 size={26} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Payment Verified
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.4', marginBottom: '1.25rem' }}>
              Your <strong>{selectedPlan.name}</strong> subscription is now active at <strong>₹{selectedPlan.price}/month</strong>.
            </p>

            <div style={{
              background: '#f8fafc',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              fontSize: '0.8rem',
              color: '#334155',
              marginBottom: '1.25rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {paymentResult?.payment?.razorpay_payment_id || 'pay_demo_success'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#15803d', fontWeight: '700' }}>Active</span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleClose}
              style={{ width: '100%' }}
            >
              <span>Return to Dashboard</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
