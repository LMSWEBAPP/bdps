'use client';

import { Sparkles, GraduationCap } from 'lucide-react';

export default function BDPSLoadingScreen() {
  return (
    <div className="bdps-full-loading-screen">
      <div className="bdps-loader-backdrop-glow" />
      <div className="bdps-loader-card">
        <div className="bdps-loader-spinner-wrapper">
          <div className="bdps-loader-ring-outer" />
          <div className="bdps-loader-ring-inner" />
          <div className="bdps-loader-logo-circle">
            <span className="bdps-loader-logo-text">BDPS</span>
          </div>
        </div>

        <div className="bdps-loader-info">
          <h2 className="bdps-loader-title">BDPS Computer Education</h2>
          <p className="bdps-loader-subtitle">
            <GraduationCap size={15} className="bdps-loader-icon" />
            Empowering Technical Careers Since 2006
          </p>

          <p className="bdps-loader-tagline">
            <Sparkles size={13} className="bdps-loader-icon-sparkle" />
            Loading live institute catalog...
          </p>
        </div>
      </div>
    </div>
  );
}
