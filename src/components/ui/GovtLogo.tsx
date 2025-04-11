import React from 'react';

interface TenderMitraLogoProps {
  className?: string;
  onClick?: () => void;
}

const TenderMitraLogo: React.FC<TenderMitraLogoProps> = ({ className = '', onClick }) => {
  return (
    <div 
      className={`relative flex items-center ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-2 shadow-gold">
        {/* Enhanced Tender Mitra Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 100"
          className="w-auto h-16"
          aria-label="Tender Mitra Logo"
        >
          {/* Define enhanced gradients for the logo */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2A44" />
              <stop offset="50%" stopColor="#2A4C8A" />
              <stop offset="100%" stopColor="#4A90E2" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="50%" stopColor="#F0D98B" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#D4A017" floodOpacity="0.3" result="glow" />
              <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background Shape with enhanced styling */}
          <rect x="10" y="10" width="180" height="80" rx="12" fill="url(#blueGradient)" filter="url(#shadow)" />
          
          {/* Decorative border */}
          <rect x="15" y="15" width="170" height="70" rx="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="2,1" opacity="0.6" />
          
          {/* Enhanced TM Monogram */}
          <g filter="url(#glow)">
            <path d="M40,30 H90 V40 H75 V70 H55 V40 H40 Z" fill="url(#goldGradient)" />
            <path d="M100,30 H130 L140,70 H125 L123,63 H107 L105,70 H90 Z M110,50 H120 L115,35 Z" fill="url(#goldGradient)" />
          </g>
          
          {/* Enhanced Gavel Icon */}
          <g transform="translate(150, 40) scale(0.8)" filter="url(#glow)">
            <rect x="-5" y="10" width="20" height="5" rx="2" fill="url(#goldGradient)" />
            <rect x="-15" y="15" width="10" height="15" rx="2" fill="url(#goldGradient)" />
            <rect x="0" y="-15" width="5" height="25" rx="1" fill="url(#goldGradient)" transform="rotate(45)" />
          </g>
          
          {/* Enhanced Document Icon */}
          <g transform="translate(30, 55) scale(0.6)">
            <path d="M0,0 H30 V40 H0 Z" fill="#fff" fillOpacity="0.9" filter="url(#shadow)" />
            <path d="M5,8 H25 M5,16 H25 M5,24 H25 M5,32 H15" stroke="#1E2A44" strokeWidth="2" />
            <path d="M32,-3 L42,7 V43 H12 V-3 Z" fill="#fff" fillOpacity="0.5" transform="translate(-5,0)" />
            <path d="M32,-3 L42,7 H32 Z" fill="#ddd" fillOpacity="0.8" transform="translate(-5,0)" />
          </g>
          
          {/* Decorative elements */}
          <circle cx="20" cy="20" r="3" fill="url(#goldGradient)" opacity="0.8" />
          <circle cx="180" cy="20" r="3" fill="url(#goldGradient)" opacity="0.8" />
          <circle cx="20" cy="80" r="3" fill="url(#goldGradient)" opacity="0.8" />
          <circle cx="180" cy="80" r="3" fill="url(#goldGradient)" opacity="0.8" />
          
          {/* Tender label */}
          <text x="100" y="85" textAnchor="middle" fill="url(#goldGradient)" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold">TENDER MITRA</text>
        </svg>
      </div>
    </div>
  );
};

export default TenderMitraLogo; 