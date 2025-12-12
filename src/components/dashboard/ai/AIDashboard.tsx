import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, RefreshCw } from 'lucide-react';
import { AIInsight, Prediction, AnomalyDetection, Recommendation } from '../../../types/ai';
import { InsightCard } from './InsightCard';
import { PredictionWidget } from './PredictionWidget';
import { AnomalyAlert } from './AnomalyAlert';
import { RecommendationCard } from './RecommendationCard';
import { AIOverviewStats } from './AIOverviewStats';
import { aiService } from '../../../services/aiService';

interface AIDashboardProps {
  className?: string;
}

export const AIDashboard: React.FC<AIDashboardProps> = ({ className = '' }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAIData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [insightsRes, predictionsRes, anomaliesRes, recommendationsRes] = await Promise.all([
        aiService.getInsights({ limit: 5 }),
        aiService.getPredictions({ limit: 4 }),
        aiService.getAnomalies({ limit: 3 }),
        aiService.getRecommendations({ limit: 4 })
      ]);

      setInsights(insightsRes);
      setPredictions(predictionsRes);
      setAnomalies(anomaliesRes);
      setRecommendations(recommendationsRes);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching AI data:', err);
      setError('Failed to load AI insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchAIData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchAIData();
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-sm border border-gray-200 p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading AI insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-sm border border-gray-200 p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Insights Dashboard</h2>
            <p className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overview Stats */}
      <AIOverviewStats
        insights={insights}
        predictions={predictions}
        anomalies={anomalies}
        recommendations={recommendations}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Recent Insights
              </h3>
              <span className="text-sm text-gray-500">{insights.length} insights</span>
            </div>
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
            {insights.length > 3 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all insights ({insights.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Anomaly Alerts */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Anomaly Alerts
              </h3>
              <span className="text-sm text-gray-500">{anomalies.length} alerts</span>
            </div>
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <AnomalyAlert key={anomaly.id} anomaly={anomaly} />
              ))}
            </div>
            {anomalies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No anomalies detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Predictions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Predictions
              </h3>
              <span className="text-sm text-gray-500">{predictions.length} predictions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.slice(0, 4).map((prediction) => (
                <PredictionWidget key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 text-purple-500 mr-2" />
                Recommendations
              </h3>
              <span className="text-sm text-gray-500">{recommendations.length} items</span>
            </div>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
            {recommendations.length > 3 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all recommendations ({recommendations.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
