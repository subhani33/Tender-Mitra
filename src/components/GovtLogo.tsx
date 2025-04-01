import React from 'react';

interface GovtLogoProps {
  className?: string;
}

const GovtLogo: React.FC<GovtLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Ashoka Pillar - Government of India Emblem */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 150 200"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))' }}
      >
        {/* Base golden color */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F9DF74" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        
        {/* Circular base */}
        <circle cx="75" cy="100" r="65" fill="url(#goldGradient)" />
        
        {/* Dharma Chakra (Wheel) */}
        <circle cx="75" cy="100" r="52" fill="none" stroke="#000" strokeWidth="2.5" />
        <circle cx="75" cy="100" r="47" fill="navy" />
        <circle cx="75" cy="100" r="44" fill="none" stroke="#fff" strokeWidth="1.5" />
        
        {/* 24 spokes for the Dharma Chakra */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="75"
            y1="100"
            x2={75 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={100 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}
        
        {/* Central hub of the wheel */}
        <circle cx="75" cy="100" r="8" fill="#fff" />
        
        {/* Lions - Simplified representation */}
        <g transform="translate(41, 30) scale(0.8)">
          {/* Left Lion */}
          <path
            d="M20,80 C15,75 12,65 15,58 C18,51 25,48 30,50 C35,52 38,60 36,65 C34,70 28,72 25,70 C22,68 24,63 28,65 C32,67 30,60 26,58 C22,56 18,62 20,68 C22,74 26,77 30,76"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="1"
          />
          
          {/* Right Lion */}
          <path
            d="M80,80 C85,75 88,65 85,58 C82,51 75,48 70,50 C65,52 62,60 64,65 C66,70 72,72 75,70 C78,68 76,63 72,65 C68,67 70,60 74,58 C78,56 82,62 80,68 C78,74 74,77 70,76"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="1"
          />
          
          {/* Back Lions - Simplified */}
          <path
            d="M35,55 C30,50 28,40 32,35 C36,30 42,32 45,35 C48,38 49,45 46,48"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="1"
          />
          
          <path
            d="M65,55 C70,50 72,40 68,35 C64,30 58,32 55,35 C52,38 51,45 54,48"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="1"
          />
          
          {/* Central Pedestal */}
          <rect x="35" y="80" width="30" height="10" fill="url(#goldGradient)" stroke="#000" strokeWidth="1" />
          
          {/* Horse */}
          <path
            d="M40,85 C35,90 30,95 35,100 C40,105 45,105 50,100"
            fill="none"
            stroke="#000"
            strokeWidth="1"
          />
          
          {/* Bull */}
          <path
            d="M60,85 C65,90 70,95 65,100 C60,105 55,105 50,100"
            fill="none"
            stroke="#000"
            strokeWidth="1"
          />
        </g>
        
        {/* Text band with Satyameva Jayate */}
        <path
          d="M25,142 C25,142 75,162 125,142"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
        />
        
        <text
          x="75"
          y="150"
          textAnchor="middle"
          fill="#000"
          fontSize="8"
          fontFamily="serif"
          fontWeight="bold"
        >
          सत्यमेव जयते
        </text>
      </svg>
      
      {/* Emblem text */}
      <div className="text-center mt-1">
        <h3 className="text-[8px] font-bold text-primary">Government of India</h3>
        <p className="text-[6px] text-white">Digital India Initiative</p>
      </div>
    </div>
  );
};

export default GovtLogo; 