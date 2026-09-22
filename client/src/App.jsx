import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import UpgradeModal from './components/UpgradeModal';
import BackgroundEffects from './components/BackgroundEffects';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PlansPage from './pages/PlansPage';
import SubscriptionPage from './pages/SubscriptionPage';
import BillingPage from './pages/BillingPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const { user } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard'); // dashboard, plans, subscription, billing, analytics

  if (!user) {
    return (
      <>
        <BackgroundEffects />
        <LandingPage />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'plans':
        return <PlansPage />;
      case 'subscription':
        return <SubscriptionPage onNavigateToPlans={() => setCurrentTab('plans')} />;
      case 'billing':
        return <BillingPage />;
      case 'analytics':
        return <AnalyticsPage onNavigateToPlans={() => setCurrentTab('plans')} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigateToPlans={() => setCurrentTab('plans')} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <BackgroundEffects />
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main style={{ flex: '1' }}>
        {renderActiveTab()}
      </main>

      {/* Global Upgrade Modal for Locked Feature Interceptions */}
      <UpgradeModal onNavigateToPlans={() => setCurrentTab('plans')} />

      {/* Subtle Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        fontSize: '0.8rem',
        color: 'var(--text-light)',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)',
        marginTop: 'auto'
      }}>
        <p>
          <strong>PayTodo</strong> — Portfolio Project Demonstrating Razorpay Payments, Webhook Idempotency & Tiered Subscriptions.
        </p>
      </footer>
    </div>
  );
}
