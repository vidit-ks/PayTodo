import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Receipt, 
  CreditCard
} from 'lucide-react';

export default function BillingPage() {
  const { user, subscription } = useApp();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const res = await api.getPaymentHistory();
        if (res.success) {
          setPayments(res.payments);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'successful':
        return <span className="badge badge-low">Successful</span>;
      case 'failed':
        return <span className="badge badge-high">Failed</span>;
      default:
        return <span className="badge badge-medium">Pending</span>;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem 4rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', marginBottom: '0.25rem' }}>
          Billing History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Review payment transactions and receipts processed through Razorpay.
        </p>
      </div>

      {/* Current Active Plan Overview Card (Spec #23) */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Subscription
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.1rem' }}>
              {subscription?.plan_name || 'Free'} Plan
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Rate
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              ₹{subscription?.price || 0}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mo</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Status
            </div>
            <div style={{ marginTop: '0.15rem' }}>
              <span className="badge badge-low">
                {subscription?.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table (Spec #23 & #50) */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
            Invoices & Receipts
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {payments.length} Transaction{payments.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <p>Loading transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Receipt size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              No payment history yet.
            </p>
            <p style={{ fontSize: '0.82rem' }}>
              When you complete a payment via Razorpay, receipt records will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Date</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Plan</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Payment ID</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: '600' }}>
                      {formatDate(p.paid_at || p.created_at)}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {p.plan_name || 'Subscription'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      ₹{Number(p.amount)}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569' }}>
                      {p.razorpay_payment_id || 'pay_test_ref'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                      {getStatusBadge(p.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
