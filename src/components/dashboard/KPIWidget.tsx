import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIData, DashboardWidget } from '../../types/dashboard';
import { WidgetWrapper } from './WidgetWrapper';

interface KPIWidgetProps {
  widget: DashboardWidget;
  onUpdate: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  onRemove: (widgetId: string) => void;
  onRefresh: (widgetId: string) => void;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  widget,
  onUpdate,
  onRemove,
  onRefresh
}) => {
  const kpiData = widget.data as KPIData;
  
  if (!kpiData) {
    return (
      <WidgetWrapper
        widget={widget}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onRefresh={onRefresh}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      </WidgetWrapper>
    );
  }

  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-IN').format(value);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <WidgetWrapper
      widget={widget}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onRefresh={onRefresh}
    >
      <div className="h-full flex flex-col justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatValue(kpiData.value, kpiData.format)}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {kpiData.label}
          </div>
          
          {kpiData.trend && (
            <div className={`flex items-center justify-center gap-1 ${getTrendColor(kpiData.trend.direction)}`}>
              {getTrendIcon(kpiData.trend.direction)}
              <span className="text-sm font-medium">
                {kpiData.trend.percentage}%
              </span>
              <span className="text-xs text-gray-500">
                vs {kpiData.trend.period}
              </span>
            </div>
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
};
