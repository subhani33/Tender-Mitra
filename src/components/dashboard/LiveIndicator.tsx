import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  isLive: boolean;
}

export default function LiveIndicator({ isLive = true }: LiveIndicatorProps) {
  const [isBlinking, setIsBlinking] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!isLive) {
    return (
      <div className="flex items-center">
        <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
        <span className="text-xs text-gray-500">Offline</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <motion.div 
        animate={{ 
          scale: isBlinking ? 1 : 0.8,
          opacity: isBlinking ? 1 : 0.7
        }}
        transition={{ duration: 0.5 }}
        className="h-2 w-2 rounded-full bg-green-500 mr-2"
      />
      <span className="text-xs text-green-600 font-medium">Live</span>
    </div>
  );
} 