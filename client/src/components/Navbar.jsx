import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Layers, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  LogOut, 
  ChevronDown, 
  Lock, 
  User, 
  Users 
} from 'lucide-react';

const DEMO_NAMES = ['Vidit', 'Rahul', 'Priya', 'Aman'];

export default function Navbar({ currentTab, setCurrentTab }) {
  const { user, subscription, exitUser, enterUser, refreshSubscription } = useApp();
  const [demoUsers, setDemoUsers] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const isDemoAccount = user && DEMO_NAMES.includes(user.name);

  useEffect(() => {
    async function loadDemoUsers() {
      try {
        const res = await api.getDemoUsers();
        if (res.success && res.users) {
          const canonicalDemos = res.users.filter(u => DEMO_NAMES.includes(u.name));
          setDemoUsers(canonicalDemos);
        }
      } catch (err) {
        console.error('Failed to load demo users:', err);
      }
    }
    if (isDemoAccount) {
      loadDemoUsers();
    }
  }, [isDemoAccount]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchUser = async (demo) => {
    enterUser({ id: demo.id, name: demo.name });
    setShowUserMenu(false);
    await refreshSubscription();
  };

  const isBusiness = subscription?.plan === 'business';

  const getBadgeStyle = () => {
    switch (subscription?.plan) {
      case 'business':
        return { bg: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
      case 'pro':
        return { bg: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
      case 'starter':
        return { bg: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' };
      default:
        return { bg: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tasks', icon: CheckSquare },
    { id: 'plans', label: 'Plans', icon: Layers },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, locked: !isBusiness }
  ];

  return (
    <header style={{
      maxWidth: '1140px',
      margin: '1.25rem auto',
      padding: '0 1rem'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '34px',
            height: '34px',
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

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#0d9488' : '#64748b',
                  background: isActive ? '#f0fdfa' : 'transparent',
                  border: isActive ? '1px solid #ccfbf1' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.locked && <Lock size={12} color="#94a3b8" />}
              </button>
            );
          })}
        </div>

        {/* User Account / Demo Switcher */}
        <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {isDemoAccount ? (
            /* Demo User: Dropdown Switcher */
            <div 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <Users size={14} color="#0d9488" />
              
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                {user?.name}
              </span>

              <span style={{
                fontSize: '0.65rem',
                fontWeight: '600',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                ...getBadgeStyle()
              }}>
                {subscription?.plan_name || 'Free'}
              </span>

              <ChevronDown size={14} color="#64748b" />
            </div>
          ) : (
            /* Custom User: Static indicator */
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px'
            }}>
              <User size={14} color="#4f46e5" />
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                {user?.name}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '600',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                ...getBadgeStyle()
              }}>
                {subscription?.plan_name || 'Free'}
              </span>
            </div>
          )}

          {/* Direct Logout / Exit Button */}
          <button
            onClick={exitUser}
            title="Log Out / Exit"
            style={{
              padding: '0.45rem',
              borderRadius: '6px',
              color: '#64748b',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <LogOut size={15} />
          </button>

          {/* Demo Users Switcher Dropdown (Only rendered for Demo users) */}
          {isDemoAccount && showUserMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              background: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.5rem',
              zIndex: 200
            }}>
              <div style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Switch Demo Preset
                </span>
              </div>

              {demoUsers.map((d) => (
                <div
                  key={d.id}
                  onClick={() => handleSwitchUser(d)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: user?.id === d.id ? '#f0f4ff' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (user?.id !== d.id) e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (user?.id !== d.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: user?.id === d.id ? '700' : '600', color: '#0f172a' }}>
                      {d.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {d.name === 'Vidit' ? 'Business (₹20)' : d.name === 'Rahul' ? 'Pro (₹10)' : d.name === 'Priya' ? 'Starter (₹5)' : 'Free (₹0)'}
                    </span>
                  </div>
                  <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>
                    {d.plan_name || 'Free'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
