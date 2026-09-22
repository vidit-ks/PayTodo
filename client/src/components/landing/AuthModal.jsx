import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { X, ArrowRight, AlertCircle, Users } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { enterUser } = useApp();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEnter = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.enterUser(name.trim(), password);
      if (res.success && res.user) {
        enterUser(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to enter workspace.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoName, demoPass) => {
    setName(demoName);
    setPassword(demoPass);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', position: 'relative', maxWidth: '420px' }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#64748b',
            background: '#f1f5f9',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
            Enter PayTodo
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            No complicated registration required. Enter your identifier to continue.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.6rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEnter}>
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Vidit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                background: '#ffffff'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                background: '#ffffff'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '8px' }}
          >
            <span>{loading ? 'Entering...' : 'Continue to Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Presets */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              Preset Demo Accounts
            </span>
            <Users size={14} color="#94a3b8" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => quickFill('Vidit', '123')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'space-between' }}
            >
              <span>Vidit</span>
              <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>Business</span>
            </button>

            <button
              type="button"
              onClick={() => quickFill('Rahul', '123')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'space-between' }}
            >
              <span>Rahul</span>
              <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>Pro</span>
            </button>

            <button
              type="button"
              onClick={() => quickFill('Priya', '123')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'space-between' }}
            >
              <span>Priya</span>
              <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>Starter</span>
            </button>

            <button
              type="button"
              onClick={() => quickFill('Aman', '123')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'space-between' }}
            >
              <span>Aman</span>
              <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
