import React, { useMemo } from 'react';
import { ChartData, DashboardWidget } from '../../types/dashboard';
import { WidgetWrapper } from './WidgetWrapper';
import './ChartWidget.css';

interface ChartWidgetProps {
  widget: DashboardWidget;
  onUpdate: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  onRemove: (widgetId: string) => void;
  onRefresh: (widgetId: string) => void;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  onUpdate,
  onRemove,
  onRefresh
}) => {
  const chartData = useMemo(() => {
    if (!widget.data) return null;
    return widget.data as ChartData;
  }, [widget.data]);

  const chartType = widget.config.chartType || 'line';
  const showLegend = widget.config.showLegend !== false;
  const showAxes = widget.config.showAxes !== false;

  const renderChart = () => {
    if (!chartData) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return <LineChart data={chartData} showAxes={showAxes} showLegend={showLegend} />;
      case 'bar':
        return <BarChart data={chartData} showAxes={showAxes} showLegend={showLegend} />;
      case 'pie':
        return <PieChart data={chartData} showLegend={showLegend} />;
      case 'doughnut':
        return <DoughnutChart data={chartData} showLegend={showLegend} />;
      default:
        return <LineChart data={chartData} showAxes={showAxes} showLegend={showLegend} />;
    }
  };

  return (
    <WidgetWrapper
      widget={widget}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onRefresh={onRefresh}
    >
      <div className="h-full flex flex-col">
        {renderChart()}
      </div>
    </WidgetWrapper>
  );
};

// Simple Chart Components (can be replaced with Chart.js or Recharts)
interface ChartProps {
  data: ChartData;
  showAxes?: boolean;
  showLegend?: boolean;
}

const LineChart: React.FC<ChartProps> = ({ data, showAxes = true, showLegend = true }) => {
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
  const minValue = Math.min(...data.datasets.flatMap(d => d.data));
  const range = maxValue - minValue;

  return (
    <div className="h-full flex flex-col">
      {showLegend && (
        <div className="flex flex-wrap gap-4 mb-4">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="chart-legend-item">
              <div
                className="chart-legend-color-circle"
                style={{ 
                  backgroundColor: Array.isArray(dataset.backgroundColor) 
                    ? dataset.backgroundColor[0] 
                    : dataset.backgroundColor || (Array.isArray(dataset.borderColor) 
                      ? dataset.borderColor[0] 
                      : dataset.borderColor) || '#3b82f6'
                }}
              />
              <span className="chart-legend-text">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 relative">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {showAxes && (
            <g className="grid-lines">
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + (i * 30)}
                  x2="360"
                  y2={40 + (i * 30)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {data.labels.map((_, i) => (
                <line
                  key={i}
                  x1={40 + (i * (320 / (data.labels.length - 1)))}
                  y1="40"
                  x2={40 + (i * (320 / (data.labels.length - 1)))}
                  y2="160"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}
          
          {/* Data lines */}
          {data.datasets.map((dataset, datasetIndex) => {
            const points = dataset.data.map((value, index) => ({
              x: 40 + (index * (320 / (data.labels.length - 1))),
              y: 160 - ((value - minValue) / range) * 120
            }));
            
            const pathData = points.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ');
            
            return (
              <g key={datasetIndex}>
                <path
                  d={pathData}
                  stroke={
                    Array.isArray(dataset.borderColor) 
                      ? dataset.borderColor[0] 
                      : dataset.borderColor || 
                        (Array.isArray(dataset.backgroundColor) 
                          ? dataset.backgroundColor[0] 
                          : dataset.backgroundColor) || '#3b82f6'
                  }
                  strokeWidth="2"
                  fill="none"
                />
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill={
                      Array.isArray(dataset.backgroundColor) 
                        ? dataset.backgroundColor[0] 
                        : dataset.backgroundColor || '#3b82f6'
                    }
                  />
                ))}
              </g>
            );
          })}
          
          {/* Axes */}
          {showAxes && (
            <g className="axes">
              <line x1="40" y1="40" x2="40" y2="160" stroke="#374151" strokeWidth="2" />
              <line x1="40" y1="160" x2="360" y2="160" stroke="#374151" strokeWidth="2" />
              
              {/* Y-axis labels */}
              {Array.from({ length: 5 }, (_, i) => {
                const value = maxValue - (i * range / 4);
                return (
                  <text
                    key={i}
                    x="35"
                    y={45 + (i * 30)}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {Math.round(value)}
                  </text>
                );
              })}
              
              {/* X-axis labels */}
              {data.labels.map((label, i) => (
                <text
                  key={i}
                  x={40 + (i * (320 / (data.labels.length - 1)))}
                  y="175"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {label}
                </text>
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

const BarChart: React.FC<ChartProps> = ({ data, showAxes = true, showLegend = true }) => {
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
  const barWidth = 320 / data.labels.length * 0.8;
  const barGroupWidth = 320 / data.labels.length;

  return (
    <div className="h-full flex flex-col">
      {showLegend && (
        <div className="flex flex-wrap gap-4 mb-4">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="chart-legend-item">
              <div
                className="chart-legend-color"
                style={{ 
                  backgroundColor: Array.isArray(dataset.backgroundColor) 
                    ? dataset.backgroundColor[0] 
                    : dataset.backgroundColor || '#3b82f6'
                }}
              />
              <span className="chart-legend-text">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 relative">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {showAxes && (
            <g className="grid-lines">
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + (i * 30)}
                  x2="360"
                  y2={40 + (i * 30)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}
          
          {/* Bars */}
          {data.datasets.map((dataset, datasetIndex) => {
            const barsPerGroup = data.datasets.length;
            const individualBarWidth = barWidth / barsPerGroup;
            
            return dataset.data.map((value, index) => {
              const barHeight = (value / maxValue) * 120;
              const x = 40 + (index * barGroupWidth) + (datasetIndex * individualBarWidth) + (barGroupWidth - barWidth) / 2;
              const y = 160 - barHeight;
              
              return (
                <rect
                  key={`${datasetIndex}-${index}`}
                  x={x}
                  y={y}
                  width={individualBarWidth}
                  height={barHeight}
                  fill={
                    Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[0] 
                      : dataset.backgroundColor || '#3b82f6'
                  }
                />
              );
            });
          })}
          
          {/* Axes */}
          {showAxes && (
            <g className="axes">
              <line x1="40" y1="40" x2="40" y2="160" stroke="#374151" strokeWidth="2" />
              <line x1="40" y1="160" x2="360" y2="160" stroke="#374151" strokeWidth="2" />
              
              {/* Y-axis labels */}
              {Array.from({ length: 5 }, (_, i) => {
                const value = maxValue - (i * maxValue / 4);
                return (
                  <text
                    key={i}
                    x="35"
                    y={45 + (i * 30)}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {Math.round(value)}
                  </text>
                );
              })}
              
              {/* X-axis labels */}
              {data.labels.map((label, i) => (
                <text
                  key={i}
                  x={40 + (i * barGroupWidth) + barGroupWidth / 2}
                  y="175"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {label}
                </text>
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

const PieChart: React.FC<ChartProps> = ({ data, showLegend = true }) => {
  const total = data.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 0;
  let currentAngle = 0;
  
  const slices = data.datasets[0]?.data.map((value, index) => {
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return {
      path: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      color: Array.isArray(data.datasets[0].backgroundColor) 
        ? data.datasets[0].backgroundColor[index] 
        : data.datasets[0].backgroundColor || '#3b82f6',
      label: data.labels[index],
      value,
      percentage: ((value / total) * 100).toFixed(1)
    };
  }) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.path}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
          
          {showLegend && (
            <div className="space-y-2">
              {slices.map((slice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {slice.label} ({slice.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DoughnutChart: React.FC<ChartProps> = ({ data, showLegend = true }) => {
  const total = data.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 0;
  let currentAngle = 0;
  
  const slices = data.datasets[0]?.data.map((value, index) => {
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    const outerRadius = 80;
    const innerRadius = 50;
    
    const x1 = 100 + outerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 100 + outerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 100 + outerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 100 + outerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const x3 = 100 + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y3 = 100 + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x4 = 100 + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y4 = 100 + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return {
      path: `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3} Z`,
      color: Array.isArray(data.datasets[0].backgroundColor) 
        ? data.datasets[0].backgroundColor[index] 
        : data.datasets[0].backgroundColor || '#3b82f6',
      label: data.labels[index],
      value,
      percentage: ((value / total) * 100).toFixed(1)
    };
  }) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg viewBox="0 0 200 200" className="w-48 h-48">
              {slices.map((slice, index) => (
                <path
                  key={index}
                  d={slice.path}
                  fill={slice.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
          
          {showLegend && (
            <div className="space-y-2">
              {slices.map((slice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {slice.label} ({slice.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
