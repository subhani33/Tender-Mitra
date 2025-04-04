import React from 'react';

interface GovtLogoProps {
  className?: string;
}

const GovtLogo: React.FC<GovtLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Government of India Emblem - Lion Capital of Ashoka */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 300"
        className="w-full h-full"
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
        <circle cx="100" cy="130" r="70" fill="url(#goldGradient)" />
        
        {/* Three lions visible from front */}
        <g fill="url(#goldGradient)" stroke="#89740A" strokeWidth="0.5">
          {/* Left Lion */}
          <path d="M60,90 C55,85 52,75 55,68 C58,61 65,58 70,60 C75,62 78,70 76,75 C74,80 68,82 65,80 C62,78 64,73 68,75 C72,77 70,70 66,68 C62,66 58,72 60,78 C62,84 66,87 70,86" />
          
          {/* Center Lion */}
          <path d="M100,85 C95,80 92,70 95,63 C98,56 105,53 110,55 C115,57 118,65 116,70 C114,75 108,77 105,75 C102,73 104,68 108,70 C112,72 110,65 106,63 C102,61 98,67 100,73 C102,79 106,82 110,81" />
          
          {/* Right Lion */}
          <path d="M140,90 C145,85 148,75 145,68 C142,61 135,58 130,60 C125,62 122,70 124,75 C126,80 132,82 135,80 C138,78 136,73 132,75 C128,77 130,70 134,68 C138,66 142,72 140,78 C138,84 134,87 130,86" />
        </g>
        
        {/* Abacus with four animals */}
        <g stroke="#89740A" strokeWidth="0.5" fill="url(#goldGradient)">
          {/* Lion (North) */}
          <path d="M100,65 C97,62 95,57 98,54 C101,51 105,52 107,54 C109,56 109,60 107,62"/>
          
          {/* Elephant (East) */}
          <path d="M145,130 C150,127 155,128 157,132 C159,136 157,141 152,143 C147,145 142,144 140,140"/>
          
          {/* Horse (South) */}
          <path d="M100,195 C103,198 105,203 102,206 C99,209 95,208 93,206 C91,204 91,200 93,198"/>
          
          {/* Bull (West) */}
          <path d="M55,130 C50,127 45,128 43,132 C41,136 43,141 48,143 C53,145 58,144 60,140"/>
        </g>
        
        {/* Capital base */}
        <rect x="60" y="170" width="80" height="15" fill="url(#goldGradient)" stroke="#89740A" strokeWidth="0.5" />
        
        {/* Dharma Chakra (24-spoked wheel) */}
        <circle cx="100" cy="130" r="25" fill="none" stroke="#89740A" strokeWidth="1" />
        <circle cx="100" cy="130" r="23" fill="#FFF" />
        <circle cx="100" cy="130" r="4" fill="#D4A017" />
        
        {/* 24 spokes for the Dharma Chakra */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="130"
            x2={100 + 23 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={130 + 23 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#D4A017"
            strokeWidth="1"
          />
        ))}
        
        {/* Satyameva Jayate in Devanagari */}
        <g transform="translate(0, 230)">
          <rect x="50" y="0" width="100" height="20" fill="transparent" />
        <text
            x="100"
            y="15"
          textAnchor="middle"
            fill="#000000"
            fontSize="14"
            fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          सत्यमेव जयते
        </text>
        </g>
      </svg>
      
      {/* Official text */}
      <div className="text-center mt-1">
        <h3 className="text-xs font-bold text-primary">Government of India</h3>
      </div>
    </div>
  );
};

export default GovtLogo; 