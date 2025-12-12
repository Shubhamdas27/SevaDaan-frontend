import React from 'react';
import { TrendingUp, TrendingDown, Target, Clock, Info } from 'lucide-react';
import { Prediction } from '../../../types/ai';

interface PredictionWidgetProps {
  prediction: Prediction;
}

export const PredictionWidget: React.FC<PredictionWidgetProps> = ({ prediction }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getValueTrend = (value: number) => {
    if (value > 0) return { icon: TrendingUp, color: 'text-green-600', label: 'Increasing' };
    if (value < 0) return { icon: TrendingDown, color: 'text-red-600', label: 'Decreasing' };
    return { icon: Target, color: 'text-gray-600', label: 'Stable' };
  };

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  };

  const trend = getValueTrend(prediction.value);
  const TrendIcon = trend.icon;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendIcon className={`w-5 h-5 ${trend.color}`} />
          <h4 className="font-medium text-gray-900 capitalize">{prediction.type}</h4>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(prediction.confidence)}`}>
          {Math.round(prediction.confidence * 100)}%
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{formatValue(prediction.value)}</span>
          <span className="text-sm text-gray-500">{prediction.timeframe}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{trend.label} trend predicted</p>
      </div>
      
      {prediction.factors && prediction.factors.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center space-x-1 mb-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Key Factors:</span>
          </div>
          <div className="space-y-1">
            {prediction.factors.slice(0, 2).map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{factor.name}</span>
                <span className="text-xs font-medium text-gray-700">
                  {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Generated {new Date(prediction.generatedAt).toLocaleDateString()}</span>
        </div>
        <span>Model: {prediction.modelId.slice(0, 8)}</span>
      </div>
    </div>
  );
};
