import React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-600',
  className,
  size = 'md',
  loading = false,
  subtitle
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          card: 'p-4',
          icon: 'w-8 h-8',
          value: 'text-xl',
          title: 'text-sm',
          change: 'text-xs'
        };
      case 'lg':
        return {
          card: 'p-8',
          icon: 'w-12 h-12',
          value: 'text-4xl',
          title: 'text-lg',
          change: 'text-sm'
        };
      default:
        return {
          card: 'p-6',
          icon: 'w-10 h-10',
          value: 'text-3xl',
          title: 'text-base',
          change: 'text-sm'
        };
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-600';
      case 'negative':
        return 'text-error-600';
      default:
        return 'text-slate-500';
    }
  };

  const styles = getSizeStyles();

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className={styles.card}>
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              {change && <div className="h-3 bg-gray-200 rounded w-1/3"></div>}
            </div>
            {Icon && (
              <div className={cn('bg-gray-200 rounded-lg flex items-center justify-center', styles.icon)}>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow duration-200', className)}>
      <CardContent className={styles.card}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn('font-medium text-slate-600 mb-1', styles.title)}>
              {title}
            </p>
            <p className={cn('font-bold text-slate-900 mb-1', styles.value)}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 mb-2">
                {subtitle}
              </p>
            )}
            {change && (
              <div className={cn('flex items-center font-medium', styles.change, getChangeColor())}>
                {changeType === 'positive' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {changeType === 'negative' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {change}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              'rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 ml-4',
              styles.icon
            )}>
              <Icon className={cn(styles.icon, iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

StatCard.displayName = 'StatCard';

export { StatCard };
