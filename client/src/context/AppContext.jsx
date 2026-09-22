import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('paytodo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [subscription, setSubscription] = useState(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const [checkboxStyle, setCheckboxStyleState] = useState('circle');

  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureName: '',
    requiredPlan: 'Pro'
  });

  // Load user's saved global checkbox style
  useEffect(() => {
    if (user) {
      const savedStyle = localStorage.getItem(`paytodo_style_${user.id}`);
      setCheckboxStyleState(savedStyle || 'circle');
    } else {
      setCheckboxStyleState('circle');
    }
  }, [user]);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      return;
    }
    try {
      setIsLoadingSub(true);
      const res = await api.getMySubscription();
      if (res.success && res.subscription) {
        setSubscription(res.subscription);
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    } finally {
      setIsLoadingSub(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user, fetchSubscription]);

  const enterUser = (userData) => {
    localStorage.setItem('paytodo_user', JSON.stringify(userData));
    setUser(userData);
  };

  const exitUser = () => {
    localStorage.removeItem('paytodo_user');
    setUser(null);
    setSubscription(null);
  };

  const openUpgradeModal = (featureName, requiredPlan = 'Pro') => {
    setUpgradeModal({
      isOpen: true,
      featureName,
      requiredPlan
    });
  };

  const closeUpgradeModal = () => {
    setUpgradeModal(prev => ({ ...prev, isOpen: false }));
  };

  const hasFeature = (featureName) => {
    if (!subscription || !subscription.features) return false;
    return subscription.features.includes(featureName);
  };

  const updateGlobalCheckboxStyle = (newStyle) => {
    if (!hasFeature('custom_checkboxes') && newStyle !== 'circle') {
      openUpgradeModal('Custom Checkboxes', 'Starter');
      return;
    }
    setCheckboxStyleState(newStyle);
    if (user) {
      localStorage.setItem(`paytodo_style_${user.id}`, newStyle);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        enterUser,
        exitUser,
        subscription,
        isLoadingSub,
        refreshSubscription: fetchSubscription,
        hasFeature,
        upgradeModal,
        openUpgradeModal,
        closeUpgradeModal,
        checkboxStyle,
        updateGlobalCheckboxStyle
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
