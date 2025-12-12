import React from 'react';
import { Alert } from './ui/Alert';

interface ErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: 'error' | 'warning' | 'success' | 'info' | 'danger' | 'primary' | 'secondary';
  onClose?: (() => void);
  title?: string;
}

/**
 * Component for displaying error messages
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  variant = 'error', 
  onClose = undefined,
  title,
  ...props 
}) => {
  // Map Bootstrap variants to our Alert variants
  const variantMap: Record<string, 'error' | 'warning' | 'success' | 'info' | 'default'> = {
    danger: 'error',
    warning: 'warning',
    success: 'success',
    info: 'info',
    primary: 'info',
    secondary: 'default',
  };

  const mappedVariant = variantMap[variant] || (variant as 'error' | 'warning' | 'success' | 'info' | 'default');

  return (
    <Alert 
      variant={mappedVariant}
      title={title}
      description={message}
      onClose={onClose}
      {...props}
    />
  );
};

export default ErrorDisplay;
