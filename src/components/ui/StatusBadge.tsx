import React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'approved' | 'pending' | 'rejected' | 'completed' | 'ongoing' | 'upcoming' | 'cancelled' | 'active' | 'inactive' | 'verified' | 'unverified' | 'failed' | 'success';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = 'md', variant = 'subtle', ...props }, ref) => {
    const getStatusStyles = () => {
      const baseStyles = {
        approved: {
          subtle: 'bg-green-100 text-green-800 border-green-200',
          solid: 'bg-green-600 text-white border-green-600',
          outline: 'text-green-600 border-green-600 bg-transparent'
        },
        completed: {
          subtle: 'bg-green-100 text-green-800 border-green-200',
          solid: 'bg-green-600 text-white border-green-600',
          outline: 'text-green-600 border-green-600 bg-transparent'
        },
        success: {
          subtle: 'bg-green-100 text-green-800 border-green-200',
          solid: 'bg-green-600 text-white border-green-600',
          outline: 'text-green-600 border-green-600 bg-transparent'
        },
        verified: {
          subtle: 'bg-green-100 text-green-800 border-green-200',
          solid: 'bg-green-600 text-white border-green-600',
          outline: 'text-green-600 border-green-600 bg-transparent'
        },
        pending: {
          subtle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          solid: 'bg-yellow-600 text-white border-yellow-600',
          outline: 'text-yellow-600 border-yellow-600 bg-transparent'
        },
        upcoming: {
          subtle: 'bg-blue-100 text-blue-800 border-blue-200',
          solid: 'bg-blue-600 text-white border-blue-600',
          outline: 'text-blue-600 border-blue-600 bg-transparent'
        },
        ongoing: {
          subtle: 'bg-purple-100 text-purple-800 border-purple-200',
          solid: 'bg-purple-600 text-white border-purple-600',
          outline: 'text-purple-600 border-purple-600 bg-transparent'
        },
        active: {
          subtle: 'bg-blue-100 text-blue-800 border-blue-200',
          solid: 'bg-blue-600 text-white border-blue-600',
          outline: 'text-blue-600 border-blue-600 bg-transparent'
        },
        rejected: {
          subtle: 'bg-red-100 text-red-800 border-red-200',
          solid: 'bg-red-600 text-white border-red-600',
          outline: 'text-red-600 border-red-600 bg-transparent'
        },
        cancelled: {
          subtle: 'bg-red-100 text-red-800 border-red-200',
          solid: 'bg-red-600 text-white border-red-600',
          outline: 'text-red-600 border-red-600 bg-transparent'
        },
        failed: {
          subtle: 'bg-red-100 text-red-800 border-red-200',
          solid: 'bg-red-600 text-white border-red-600',
          outline: 'text-red-600 border-red-600 bg-transparent'
        },
        inactive: {
          subtle: 'bg-gray-100 text-gray-800 border-gray-200',
          solid: 'bg-gray-600 text-white border-gray-600',
          outline: 'text-gray-600 border-gray-600 bg-transparent'
        },
        unverified: {
          subtle: 'bg-gray-100 text-gray-800 border-gray-200',
          solid: 'bg-gray-600 text-white border-gray-600',
          outline: 'text-gray-600 border-gray-600 bg-transparent'
        }
      };

      return baseStyles[status]?.[variant] || baseStyles.pending.subtle;
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-2 py-0.5 text-xs';
        case 'lg':
          return 'px-4 py-2 text-sm';
        default:
          return 'px-3 py-1 text-xs';
      }
    };

    const getDisplayText = () => {
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          getSizeStyles(),
          getStatusStyles(),
          className
        )}
        {...props}
      >
        {getDisplayText()}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
