import React, { useEffect, useState } from 'react';

export default function BackgroundEffects() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-effects-container" aria-hidden="true">
      {/* Interactive Ambient Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)`
        }}
      />

      {/* Floating Aurora Mesh Orbs */}
      <div className="aurora-orb orb-1" />
      <div className="aurora-orb orb-2" />
      <div className="aurora-orb orb-3" />
      <div className="aurora-orb orb-4" />

      {/* Subtle Dot Matrix Grid */}
      <div className="dot-grid-pattern" />

      {/* Floating Minimal Decorative Chips */}
      <div className="floating-chip chip-1">
        <span className="chip-dot" />
        <span>Sync Active</span>
      </div>
      <div className="floating-chip chip-2">
        <span className="chip-metric">99.9%</span>
        <span>Uptime</span>
      </div>
      <div className="floating-chip chip-3">
        <span>Instant UPI</span>
      </div>
    </div>
  );
}
