import React from 'react';
import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  isConnected: boolean;
  lastUpdated: Date | null;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ isConnected, lastUpdated }) => {
  // Format last updated time to be readable
  const getFormattedTime = () => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    
    // If less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // If less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // If today
    if (lastUpdated.toDateString() === now.toDateString()) {
      return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise, show date and time
    return lastUpdated.toLocaleString();
  };
  
  return (
    <div className="flex items-center">
      <div className="flex items-center mr-3">
        <motion.div
          animate={{
            scale: isConnected ? [1, 1.2, 1] : 1,
            opacity: isConnected ? 1 : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: isConnected ? Infinity : 0,
            repeatType: "loop"
          }}
          className={`w-2.5 h-2.5 rounded-full mr-1.5 ${
            isConnected ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
        <span className={`text-xs font-medium ${
          isConnected ? 'text-emerald-400' : 'text-amber-400'
        }`}>
          {isConnected ? 'LIVE' : 'DISCONNECTED'}
        </span>
      </div>
      
      <span className="text-xs text-white/60">
        Updated: {getFormattedTime()}
      </span>
    </div>
  );
}; 