import React from 'react';

interface GovtLogoProps {
  className?: string;
  onClick?: () => void;
}

const GovtLogo: React.FC<GovtLogoProps> = ({ className = '', onClick }) => {
  return (
    <div 
      className={`relative flex items-center ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-center bg-white rounded-lg p-2 shadow-md">
        {/* Official Government of India Emblem with Asoka Lion Capital */}
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16"
          aria-label="Emblem of India"
        >
          {/* Lion Capital Base */}
          <g transform="translate(20, 20)">
            {/* Base pedestal with Ashoka Chakra */}
            <circle cx="100" cy="130" r="24" fill="none" stroke="#000" strokeWidth="2" />
            
            {/* Ashoka Chakra (24-spoke wheel) */}
            {Array.from({ length: 24 }).map((_, i) => (
              <line 
                key={i}
                x1="100" 
                y1="106" 
                x2="100" 
                y2="154" 
                stroke="#000" 
                strokeWidth="1.5"
                transform={`rotate(${i * 15} 100 130)`}
              />
            ))}
            
            {/* Lion Capital main structure */}
            <path 
              d="M60,40 C60,40 60,80 100,80 C140,80 140,40 140,40 L140,30 C140,30 120,10 100,10 C80,10 60,30 60,30 L60,40" 
              fill="#000" 
              stroke="#000" 
              strokeWidth="1" 
            />
            
            {/* Four Lions (simplified) */}
            <circle cx="100" cy="30" r="22" fill="#000" /> {/* Central dome */}
            
            {/* Stylized lions */}
            <path 
              d="M100,30 L85,5 C75,15 65,15 55,10 C55,20 60,30 75,35 L100,30" 
              fill="#000" 
              stroke="#000" 
              strokeWidth="0.5" 
            />
            <path 
              d="M100,30 L115,5 C125,15 135,15 145,10 C145,20 140,30 125,35 L100,30" 
              fill="#000" 
              stroke="#000" 
              strokeWidth="0.5" 
            />
            <path 
              d="M100,30 L125,35 C135,25 145,25 155,30 C145,35 135,45 120,45 L100,30" 
              fill="#000" 
              stroke="#000" 
              strokeWidth="0.5" 
            />
            <path 
              d="M100,30 L75,35 C65,25 55,25 45,30 C55,35 65,45 80,45 L100,30" 
              fill="#000" 
              stroke="#000" 
              strokeWidth="0.5" 
            />
            
            {/* Stylized manes */}
            <path 
              d="M85,5 C90,10 95,12 100,12 C105,12 110,10 115,5" 
              fill="none" 
              stroke="#000" 
              strokeWidth="1.5" 
            />

            {/* Base text */}
            <text 
              x="100" 
              y="170" 
              textAnchor="middle" 
              fontFamily="serif" 
              fontSize="10" 
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
              <span className="text-xl font-bold text-black">भारत सरकार</span>
              <span className="text-xl font-bold text-black">GOVERNMENT</span>
              <span className="text-xl font-bold text-black">OF INDIA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtLogo; 