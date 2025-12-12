import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className,
    value,
    max = 100,
    showLabel = false, 
    size = 'md',
    variant = 'primary',
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const variantClasses = {
      primary: 'bg-blue-600',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      accent: 'bg-accent-500',
    };

    return (
      <div
        className={cn('w-full', className)}
        ref={ref}
        {...props}
      >
        {showLabel && (
          <div className="flex justify-end mb-1">
            <span className="text-xs font-medium text-slate-500">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn('rounded-full transition-all duration-300', variantClasses[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };