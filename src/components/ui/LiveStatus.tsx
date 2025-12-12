import React, { useState, useEffect } from 'react';
import { realTimeService } from '../../services/realTimeService';

interface LiveStatusProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LiveStatus: React.FC<LiveStatusProps> = ({ 
  showText = true, 
  size = 'md',
  className = ''
}) => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Animate the live indicator
    const liveInterval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);

    // Subscribe to any data updates to show when last updated
    const unsubscribe = realTimeService.subscribe('stats', () => {
      setLastUpdate(new Date());
    });

    return () => {
      clearInterval(liveInterval);
      unsubscribe();
    };
  }, []);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full transition-colors duration-300 ${
          isLive ? 'bg-green-500 shadow-green-500/50 shadow-sm' : 'bg-green-300'
        }`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`text-gray-600 font-medium ${textSizes[size]}`}>
            Live
          </span>
          <span className="text-xs text-gray-400">
            {formatLastUpdate()}
          </span>
        </div>
      )}
    </div>
  );
};

export default LiveStatus;
