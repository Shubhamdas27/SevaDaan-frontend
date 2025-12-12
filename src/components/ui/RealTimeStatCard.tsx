import React, { useState, useEffect } from 'react';
import { realTimeService } from '../../services/realTimeService';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import LiveStatus from './LiveStatus';

interface RealTimeStatCardProps {
  title: string;
  statKey: string;
  icon: React.ComponentType<any>;
  color: string;
  changeKey?: string;
  onClick?: () => void;
  className?: string;
  showLiveIndicator?: boolean;
}

const RealTimeStatCard: React.FC<RealTimeStatCardProps> = ({
  title,
  statKey,
  icon: Icon,
  color,
  changeKey,
  onClick,
  className = '',
  showLiveIndicator = true
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [changeValue, setChangeValue] = useState<number>(0);

  useEffect(() => {
    // Get initial stats
    const initialStats = realTimeService.getData('stats');
    setCurrentValue(initialStats[statKey] || 0);
    setPreviousValue(initialStats[statKey] || 0);
    if (changeKey) {
      setChangeValue(initialStats[changeKey] || 0);
    }

    // Subscribe to real-time updates
    const unsubscribe = realTimeService.subscribe('stats', (newStats: any) => {
      setPreviousValue(currentValue);
      setCurrentValue(newStats[statKey] || 0);
      if (changeKey) {
        setChangeValue(newStats[changeKey] || 0);
      }
    });

    return unsubscribe;
  }, [statKey, changeKey, currentValue]);

  const formatValue = (value: number): string => {
    if (statKey.includes('Donations') || statKey.includes('amount')) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString('en-IN');
  };

  const getChangeIndicator = () => {
    const diff = currentValue - previousValue;
    if (diff > 0) {
      return { icon: ArrowUpRight, color: 'text-green-500', bg: 'bg-green-50' };
    } else if (diff < 0) {
      return { icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-50' };
    }
    return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const changeIndicator = getChangeIndicator();
  const ChangeIcon = changeIndicator.icon;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {showLiveIndicator && <LiveStatus showText={false} size="sm" />}
          </div>
          
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(currentValue)}
          </p>
          
          {changeKey && changeValue > 0 && (
            <div className="flex items-center">
              <div className={`p-1 rounded ${changeIndicator.bg} mr-2`}>
                <ChangeIcon className={`w-3 h-3 ${changeIndicator.color}`} />
              </div>
              <span className={`text-sm font-medium ${changeIndicator.color}`}>
                +{formatValue(changeValue)} today
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center ml-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default RealTimeStatCard;
