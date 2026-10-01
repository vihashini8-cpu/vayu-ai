import React from 'react';

interface VayuLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const VayuLogo: React.FC<VayuLogoProps> = ({
  className = '',
  size = 32,
  animated = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ width: size, height: size }}
      title="VAYU AI — India's Unified Weather Intelligence Platform"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(34,211,238,0.35)]"
      >
        <defs>
          {/* Main Aerodynamic Vayu Wing Gradient */}
          <linearGradient id="vayuWingGrad1" x1="10" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          {/* Secondary Swirling Wind Vortex Gradient */}
          <linearGradient id="vayuWingGrad2" x1="85" y1="15" x2="20" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Tertiary Inner Cyclone Core Gradient */}
          <linearGradient id="vayuCoreGlow" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#67E8F9" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0B1929" />
          </linearGradient>

          {/* Satellite Orbit Sweep Gradient */}
          <linearGradient id="orbitGrad" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>

          {/* Core Radial Bloom */}
          <radialGradient id="centerPulse" cx="50" cy="50" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          {/* Ambient Glow Filter */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Geostationary Scanner Ring (Subtle Track) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#orbitGrad)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.7"
        />

        {/* Elliptical Synoptic Radar Orbit Arc */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="22"
          transform="rotate(-28 50 50)"
          stroke="#22D3EE"
          strokeWidth="1.2"
          strokeDasharray="8 5 2 5"
          strokeOpacity="0.45"
        />

        {/* Ambient Center Glow */}
        <circle cx="50" cy="50" r="28" fill="url(#centerPulse)" />

        {/* Left Wing / 'V' Atmospheric Jetstream Blade */}
        <path
          d="
            M 18 20
            C 26 28, 38 42, 47 78
            C 48 83, 52 83, 53 78
            C 50 58, 42 42, 28 26
            C 24 22, 20 20, 18 20
            Z
          "
          fill="url(#vayuWingGrad1)"
          filter="url(#glowFilter)"
          opacity="0.95"
        />

        {/* Right Wing / Dynamic Cyclone Spiral Sweep */}
        <path
          d="
            M 82 20
            C 74 28, 62 42, 53 78
            C 52 83, 48 83, 47 78
            C 50 58, 58 42, 72 26
            C 76 22, 80 20, 82 20
            Z
          "
          fill="url(#vayuWingGrad2)"
          filter="url(#glowFilter)"
          opacity="0.95"
        />

        {/* Top Horizon Storm Cloud Crest (Unifying the V into Atmospheric Shield) */}
        <path
          d="
            M 24 26
            C 30 14, 46 12, 50 20
            C 54 12, 70 14, 76 26
            C 66 22, 58 24, 50 30
            C 42 24, 34 22, 24 26
            Z
          "
          fill="url(#vayuWingGrad1)"
          opacity="0.85"
        />

        {/* Inner Swirling Cyclone Eye Vortex */}
        <path
          d="
            M 50 34
            C 58 34, 66 40, 65 48
            C 64 56, 56 62, 50 62
            C 44 62, 38 56, 39 48
            C 40 43, 44 39, 50 38
            C 53 38, 56 41, 55 45
            C 54 48, 51 50, 49 49
          "
          stroke="#F0FDFA"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Central AI Telemetry Nexus Core (Diamond Star) */}
        <g className={animated ? 'animate-pulse' : ''}>
          <polygon
            points="50,42 53,49 60,50 53,51 50,58 47,51 40,50 47,49"
            fill="#FFFFFF"
          />
          <circle cx="50" cy="50" r="2.2" fill="#22D3EE" />
        </g>

        {/* Satellite Ingestion Nodes (3 Telemetry Coordinates) */}
        <circle cx="78" cy="30" r="2.4" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="78" cy="30" r="2" fill="#FFFFFF" />

        <circle cx="22" cy="30" r="2.4" fill="#2DD4BF" />
        <circle cx="22" cy="30" r="1.5" fill="#FFFFFF" />

        <circle cx="50" cy="84" r="2.8" fill="#22D3EE" />
        <circle cx="50" cy="84" r="1.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
