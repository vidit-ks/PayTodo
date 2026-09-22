import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import FeaturesSection from '../components/landing/FeaturesSection';
import InteractiveDemo from '../components/landing/InteractiveDemo';
import PricingSection from '../components/landing/PricingSection';
import WhySection from '../components/landing/WhySection';
import StatsSection from '../components/landing/StatsSection';
import LandingFooter from '../components/landing/LandingFooter';
import AuthModal from '../components/landing/AuthModal';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: '#0f172a',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Sticky Blur Navbar */}
      <LandingNavbar onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Main SaaS Landing Sections */}
      <main>
        {/* 1. Hero with Floating Todo Interface */}
        <HeroSection onOpenAuth={() => setAuthModalOpen(true)} />

        {/* 2. Real Product Facts Stats */}
        <StatsSection />

        {/* 3. How It Works (3 Steps) */}
        <HowItWorks />

        {/* 4. Feature Cards with Tier Badges */}
        <FeaturesSection onOpenAuth={() => setAuthModalOpen(true)} />

        {/* 5. Live Interactive Todo Sandbox (Try It Yourself) */}
        <InteractiveDemo onOpenAuth={() => setAuthModalOpen(true)} />

        {/* 6. Why PayTodo Philosophy */}
        <WhySection />

        {/* 7. Pricing Plans Matrix (Free, ₹5, ₹10, ₹20) */}
        <PricingSection onOpenAuth={() => setAuthModalOpen(true)} />
      </main>

      {/* Minimal Footer */}
      <LandingFooter />

      {/* Entry Modal for Name + Password & Demo Presets */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
