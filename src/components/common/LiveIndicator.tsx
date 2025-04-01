import React, { useState, useEffect } from 'react';

interface LiveIndicatorProps {
  text?: string;
  showPulse?: boolean;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ 
  text = 'Live Updates', 
  showPulse = true 
}) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Simulate live updates by toggling the status
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex h-3 w-3 ${showPulse ? '' : 'ml-1'}`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
      </div>
      {text && (
        <span className="text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

export default LiveIndicator;
 