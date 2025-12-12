import React from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { AnomalyDetection } from '../../../types/ai';
import { aiService } from '../../../services/aiService';

interface AnomalyAlertProps {
  anomaly: AnomalyDetection;
  onResolve?: (id: string) => void;
}

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({ anomaly, onResolve }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50 text-red-700';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getDeviationDirection = (value: number, expectedRange: { min: number; max: number }) => {
    if (value > expectedRange.max) {
      return { icon: TrendingUp, text: 'Above expected range', color: 'text-red-600' };
    }
    if (value < expectedRange.min) {
      return { icon: TrendingDown, text: 'Below expected range', color: 'text-red-600' };
    }
    return { icon: CheckCircle, text: 'Within range', color: 'text-green-600' };
  };

  const handleResolve = async () => {
    try {
      await aiService.resolveAnomaly(anomaly.id);
      if (onResolve) {
        onResolve(anomaly.id);
      }
    } catch (error) {
      console.error('Error resolving anomaly:', error);
    }
  };

  const deviation = getDeviationDirection(anomaly.value, anomaly.expectedRange);
  const DeviationIcon = deviation.icon;

  if (anomaly.resolved) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg opacity-75">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Resolved: {anomaly.metric}</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Resolved on {new Date(anomaly.detectedAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border-l-4 ${getSeverityColor(anomaly.severity)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-medium text-gray-900">{anomaly.metric}</h4>
            <span className={`px-2 py-1 text-xs rounded-full bg-white border`}>
              {anomaly.severity}
            </span>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <DeviationIcon className={`w-4 h-4 ${deviation.color}`} />
              <span className="text-sm font-medium text-gray-900">{anomaly.value}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{deviation.text}</p>
          </div>
          
          <div className="text-xs text-gray-500 mb-2">
            <span>Expected: {anomaly.expectedRange.min} - {anomaly.expectedRange.max}</span>
            <span className="ml-3">Probability: {Math.round(anomaly.probability * 100)}%</span>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{anomaly.description}</p>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Detected {new Date(anomaly.detectedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <button
          onClick={handleResolve}
          className="ml-3 p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
          title="Mark as resolved"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
