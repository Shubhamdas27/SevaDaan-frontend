import React from 'react';
import { Target, TrendingUp, Clock, CheckCircle, X, Play } from 'lucide-react';
import { Recommendation } from '../../../types/ai';
import { aiService } from '../../../services/aiService';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onStatusUpdate?: (id: string, status: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onStatusUpdate 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'rejected':
        return 'border-red-500 bg-red-50 text-red-700';
      case 'implemented':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'pending':
      default:
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donor_match':
      case 'volunteer_match':
        return Target;
      case 'program_optimization':
      case 'resource_allocation':
        return TrendingUp;
      case 'timing':
        return Clock;
      default:
        return Target;
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await aiService.updateRecommendationStatus(recommendation.id, newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(recommendation.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating recommendation status:', error);
    }
  };

  const TypeIcon = getTypeIcon(recommendation.type);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getStatusColor(recommendation.status)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <TypeIcon className="w-4 h-4" />
            <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
            <span className="px-2 py-1 text-xs rounded-full bg-white border capitalize">
              {recommendation.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
          
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Expected Impact:</span>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">+{recommendation.expectedImpact.improvement}</span>
              <span className="text-gray-500 ml-1">
                {recommendation.expectedImpact.unit} in {recommendation.expectedImpact.metric}
              </span>
            </div>
          </div>
          
          {recommendation.requiredActions && recommendation.requiredActions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Required Actions:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {recommendation.requiredActions.slice(0, 2).map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
            <span>Timeline: {recommendation.timeline}</span>
          </div>
        </div>
        
        {recommendation.status === 'pending' && (
          <div className="flex flex-col space-y-1 ml-3">
            <button
              onClick={() => handleStatusUpdate('accepted')}
              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="Accept recommendation"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Reject recommendation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {recommendation.status === 'accepted' && (
          <div className="ml-3">
            <button
              onClick={() => handleStatusUpdate('implemented')}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Mark as implemented"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
