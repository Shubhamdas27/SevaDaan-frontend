import React from 'react';
import { cn } from '../../lib/utils';
import './Progress.css';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  size = 'md',
  color = 'primary',
  showLabel = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const roundedValue = Math.round(value);
  const roundedMax = Math.round(max);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size], className)}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div 
        className={cn(
          'h-full rounded-full transition-all duration-300 ease-in-out',
          colorClasses[color],
          barClassName
        )}
        /* eslint-disable-next-line no-inline-styles */
        style={{ width: `${percentage}%` }}
        role="progressbar"
        {...{
          'aria-valuenow': roundedValue,
          'aria-valuemin': 0,
          'aria-valuemax': roundedMax,
          'aria-label': `Progress: ${percentage.toFixed(1)}%`
        }}
        data-testid="progress-bar"
      />
      {showLabel && (
        <div className="text-xs text-gray-600 mt-1">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default Progress;
