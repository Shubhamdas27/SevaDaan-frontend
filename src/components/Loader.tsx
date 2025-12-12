import React from 'react';
import { Spinner } from './ui/Spinner';
import { cn } from '../lib/utils';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
}

/**
 * Loading spinner component for indicating loading states
 */
const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  center = true, 
  variant = 'primary',
  className,
  ...props 
}) => {
  // Map Loader variant to Spinner variant
  const spinnerVariant: 'primary' | 'white' | 'current' | undefined =
    variant === 'primary' ? 'primary'
    : variant === 'secondary' ? 'current'
    : variant === 'success' ? 'primary'
    : variant === 'error' ? 'primary'
    : variant === 'warning' ? 'primary'
    : undefined;

  return (
    <div 
      className={cn(
        center && 'flex justify-center items-center py-4',
        className
      )}
      {...props}
    >
      <Spinner 
        size={size}
        variant={spinnerVariant}
        aria-label="Loading..."
      />
    </div>
  );
};

export default Loader;
