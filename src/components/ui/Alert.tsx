import React from 'react';
import { Icons } from '../icons';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'default', 
    title, 
    description, 
    onClose, 
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'bg-slate-50 border-slate-200 text-slate-900',      success: 'bg-success-50 border-success-200 text-success-900',
      warning: 'bg-warning-50 border-warning-200 text-warning-900',
      error: 'bg-error-50 border-error-200 text-error-900',
      info: 'bg-blue-50 border-blue-200 text-blue-900',
    };

    const iconStyles = {
      default: 'text-slate-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      error: 'text-error-600',
      info: 'text-blue-600',
    };    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <Icons.success className="w-5 h-5" />;
        case 'warning':
          return <Icons.warning className="w-5 h-5" />;
        case 'error':
          return <Icons.error className="w-5 h-5" />;
        case 'info':
          return <Icons.info className="w-5 h-5" />;
        default:
          return <Icons.error className="w-5 h-5" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border p-4',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className={cn('flex-shrink-0 mt-0.5', iconStyles[variant])}>
              {getIcon()}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            {description && (
              <div className="text-sm opacity-90">
                {description}
              </div>
            )}
            {children && (
              <div className="text-sm opacity-90">
                {children}
              </div>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                iconStyles[variant]
              )}              aria-label="Close alert"
            >
              <Icons.close className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
