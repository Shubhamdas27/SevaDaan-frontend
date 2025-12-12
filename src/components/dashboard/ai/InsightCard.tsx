import React from 'react';
import { AlertTriangle, TrendingUp, Target, Lightbulb, Eye, CheckCircle, X } from 'lucide-react';
import { AIInsight } from '../../../types/ai';
import { aiService } from '../../../services/aiService';

interface InsightCardProps {
  insight: AIInsight;
  onStatusUpdate?: (id: string, status: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onStatusUpdate }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return TrendingUp;
      case 'anomaly':
        return AlertTriangle;
      case 'opportunity':
        return Target;
      case 'risk':
        return AlertTriangle;
      case 'recommendation':
        return Lightbulb;
      default:
        return Lightbulb;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700';
      case 'high':
        return 'text-orange-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await aiService.updateInsightStatus(insight.id, newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(insight.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating insight status:', error);
    }
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getSeverityColor(insight.severity)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Icon className={`w-5 h-5 mt-0.5 ${getSeverityTextColor(insight.severity)}`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">{insight.title}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${getSeverityTextColor(insight.severity)} bg-white border`}>
                {insight.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
            
            {insight.suggestions && insight.suggestions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {insight.suggestions.slice(0, 2).map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
              <span>{new Date(insight.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {insight.status === 'new' && (
          <div className="flex items-center space-x-1 ml-3">
            <button
              onClick={() => handleStatusUpdate('acknowledged')}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
              title="Acknowledge"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStatusUpdate('dismissed')}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {insight.status === 'acknowledged' && (
          <div className="flex items-center space-x-1 ml-3">
            <button
              onClick={() => handleStatusUpdate('acted_upon')}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Mark as acted upon"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
