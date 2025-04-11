import React from 'react';
import { motion } from 'framer-motion';

interface GovtLogoProps {
  className?: string;
  animated?: boolean;
  simplified?: boolean;
}

const GovtLogo: React.FC<GovtLogoProps> = ({ 
  className = '',
  animated = true,
  simplified = false
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Modern Tender Mitra Logo */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="w-full h-full"
        aria-label="Tender Mitra Logo"
        initial={animated ? { opacity: 0 } : false}
        animate={animated ? { opacity: 1 } : false}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced gradient definitions */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="30%" stopColor="#FEDB72" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>
          
          <linearGradient id="navyBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D1629" />
            <stop offset="50%" stopColor="#1A2A44" />
            <stop offset="100%" stopColor="#0D1629" />
          </linearGradient>
          
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="20%" stopColor="#FEDB72" />
            <stop offset="40%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#D4A017" />
            <animate 
              attributeName="x1" 
              from="-100%" 
              to="100%" 
              dur="3s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="x2" 
              from="0%" 
              to="200%" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Main navy blue circular background */}
        <motion.circle 
          cx="100" 
          cy="100" 
          r="85" 
          fill="url(#navyBlueGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          filter="url(#dropShadow)"
          initial={animated ? { scale: 0.9, opacity: 0 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
        
        {/* Document/Tender icon */}
        <motion.g
          fill="url(#goldGradient)"
          stroke="#89740A"
          strokeWidth="0.5"
          filter="url(#glow)"
          initial={animated ? { scale: 0, opacity: 0 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        >
          {/* Document base */}
          <path 
            d="M70,60 L130,60 L130,140 L70,140 Z" 
            fill="#1A2A44" 
            stroke="url(#goldGradient)" 
            strokeWidth="2"
          />
          
          {/* Folded corner */}
          <path 
            d="M130,60 L110,60 L110,80 L130,80 Z" 
            fill="url(#goldGradient)" 
            strokeWidth="0"
          />
          
          {/* Document lines */}
          <motion.path 
            d="M85,80 L115,80" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : false}
            animate={animated ? { pathLength: 1 } : false}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
          
          <motion.path 
            d="M85,95 L115,95" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : false}
            animate={animated ? { pathLength: 1 } : false}
            transition={{ delay: 1.0, duration: 0.5 }}
          />
          
          <motion.path 
            d="M85,110 L115,110" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : false}
            animate={animated ? { pathLength: 1 } : false}
            transition={{ delay: 1.1, duration: 0.5 }}
          />
          
          <motion.path 
            d="M85,125 L115,125" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : false}
            animate={animated ? { pathLength: 1 } : false}
            transition={{ delay: 1.2, duration: 0.5 }}
          />
        </motion.g>
        
        {/* Checkmark/success icon */}
        <motion.path 
          d="M120,105 L135,120 L155,80"
          fill="transparent"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          animate={animated ? { pathLength: 1, opacity: 1 } : false}
          transition={{ delay: 1.3, duration: 1 }}
        />
      </motion.svg>
      
      {/* Brand text with animation */}
      <motion.div 
        className="text-center mt-1"
        initial={animated ? { y: 10, opacity: 0 } : false}
        animate={animated ? { y: 0, opacity: 1 } : false}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold font-cinzel text-primary">Tender Mitra</h3>
      </motion.div>
    </div>
  );
};

export default GovtLogo; 