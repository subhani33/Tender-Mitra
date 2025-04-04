import React from 'react';

interface GovtLogoProps {
  className?: string;
  onClick?: () => void;
}

const GovtLogo: React.FC<GovtLogoProps> = ({ className = '', onClick }) => {
  // Generate spokes for the Dharma Chakra
  const spokes = [];
  for (let i = 0; i < 24; i++) {
    spokes.push(
      <line
        key={i}
        x1="100"
        y1="100"
        x2={100 + 18 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={100 + 18 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#D4A017"
        strokeWidth="1"
      />
    );
  }

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-2 shadow-gold">
        {/* Government of India Emblem - Lion Capital of Ashoka */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-16 h-16"
          aria-label="Government of India Emblem"
        >
          {/* Base golden color */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="50%" stopColor="#FEDB72" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>
          </defs>
          
          {/* Circular abacus */}
          <circle cx="100" cy="100" r="60" fill="url(#goldGradient)" />
          
          {/* Three lions visible from front */}
          <g fill="url(#goldGradient)" stroke="#89740A" strokeWidth="0.5">
            {/* Left Lion */}
            <path d="M60,65 C55,60 52,52 55,47 C58,42 65,40 70,42 C75,44 78,50 76,54 C74,58 68,60 65,58 C62,56 64,52 68,53 C72,54 70,49 66,47 C62,45 58,50 60,55 C62,60 66,63 70,62" />
            
            {/* Center Lion */}
            <path d="M100,60 C95,55 92,47 95,42 C98,37 105,35 110,37 C115,39 118,45 116,49 C114,53 108,55 105,53 C102,51 104,47 108,48 C112,49 110,44 106,42 C102,40 98,45 100,50 C102,55 106,58 110,57" />
            
            {/* Right Lion */}
            <path d="M140,65 C145,60 148,52 145,47 C142,42 135,40 130,42 C125,44 122,50 124,54 C126,58 132,60 135,58 C138,56 136,52 132,53 C128,54 130,49 134,47 C138,45 142,50 140,55 C138,60 134,63 130,62" />
          </g>
          
          {/* Abacus with four animals */}
          <g stroke="#89740A" strokeWidth="0.5" fill="url(#goldGradient)">
            {/* Lion (North) */}
            <path d="M100,45 C97,42 95,39 98,36 C101,33 105,34 107,36 C109,38 109,41 107,43"/>
            
            {/* Elephant (East) */}
            <path d="M135,100 C140,97 144,98 146,101 C148,104 146,108 142,110 C138,112 134,111 132,108"/>
            
            {/* Horse (South) */}
            <path d="M100,155 C103,158 105,161 102,164 C99,167 95,166 93,164 C91,162 91,159 93,157"/>
            
            {/* Bull (West) */}
            <path d="M65,100 C60,97 56,98 54,101 C52,104 54,108 58,110 C62,112 66,111 68,108"/>
          </g>
          
          {/* Capital base */}
          <rect x="65" y="135" width="70" height="12" fill="url(#goldGradient)" stroke="#89740A" strokeWidth="0.5" />
          
          {/* Dharma Chakra (24-spoked wheel) */}
          <circle cx="100" cy="100" r="20" fill="none" stroke="#89740A" strokeWidth="1" />
          <circle cx="100" cy="100" r="18" fill="#FFF" />
          <circle cx="100" cy="100" r="3" fill="#D4A017" />
          
          {/* 24 spokes for the Dharma Chakra */}
          {spokes}
          
          {/* Satyameva Jayate in Devanagari */}
          <g transform="translate(0, 160)">
            <text
              x="100"
              y="10"
              textAnchor="middle"
              fill="#000000"
              fontSize="11"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              सत्यमेव जयते
            </text>
          </g>
        </svg>

        {/* Tricolor bar and text */}
        <div className="ml-2 flex flex-col">
          {/* Tricolor vertical bar */}
          <div className="flex h-full">
            <div className="w-1 h-16 flex flex-col">
              <div className="flex-1 bg-[#FF9933]"></div> {/* Saffron */}
              <div className="flex-1 bg-white"></div> {/* White */}
              <div className="flex-1 bg-[#138808]"></div> {/* Green */}
            </div>
            
            {/* Text */}
            <div className="ml-2 flex flex-col justify-center">
              <span className="text-lg font-bold text-primary">भारत सरकार</span>
              <span className="text-lg font-bold text-primary">GOVERNMENT</span>
              <span className="text-lg font-bold text-primary">OF INDIA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtLogo; 