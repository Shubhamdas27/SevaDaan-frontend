import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Activity } from 'lucide-react';
import { AIInsight, Prediction, AnomalyDetection, Recommendation } from '../../../types/ai';

interface AIOverviewStatsProps {
  insights: AIInsight[];
  predictions: Prediction[];
  anomalies: AnomalyDetection[];
  recommendations: Recommendation[];
}

export const AIOverviewStats: React.FC<AIOverviewStatsProps> = ({
  insights,
  predictions,
  anomalies,
  recommendations
}) => {
  const activeAnomalies = anomalies.filter(a => !a.resolved).length;
  const criticalInsights = insights.filter(i => i.severity === 'critical' || i.severity === 'high').length;
  const highConfidencePredictions = predictions.filter(p => p.confidence > 0.8).length;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;

  const stats = [
    {
      title: 'Active Insights',
      value: insights.length,
      critical: criticalInsights,
      icon: Brain,
      color: 'blue',
      description: `${criticalInsights} critical`
    },
    {
      title: 'Predictions',
      value: predictions.length,
      critical: highConfidencePredictions,
      icon: TrendingUp,
      color: 'green',
      description: `${highConfidencePredictions} high confidence`
    },
    {
      title: 'Anomalies',
      value: anomalies.length,
      critical: activeAnomalies,
      icon: AlertTriangle,
      color: activeAnomalies > 0 ? 'red' : 'gray',
      description: `${activeAnomalies} active`
    },
    {
      title: 'Recommendations',
      value: recommendations.length,
      critical: pendingRecommendations,
      icon: Target,
      color: 'purple',
      description: `${pendingRecommendations} pending`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getColorClasses(stat.color)} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold text-lg">{stat.value}</h3>
                  <p className="text-sm font-medium">{stat.title}</p>
                </div>
              </div>
              {stat.critical > 0 && (
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.critical}</span>
                </div>
              )}
            </div>
            <p className="text-xs mt-2 opacity-80">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
};
