import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { businessIntelligenceService } from '../services/businessIntelligenceService';
import { 
  PerformanceScorecard, 
  CompetitiveAnalysis, 
  CostEfficiencyAnalysis,
  ImpactMeasurement
} from '../types/businessIntelligence';

// Interface for executive summary
interface ExecutiveSummary {
  overallHealth: 'excellent' | 'good' | 'needs_attention' | 'critical';
  keyWins: string[];
  criticalAlerts: string[];
  upcomingMilestones: Array<{
    title: string;
    date: string;
    status: 'on_track' | 'at_risk' | 'delayed';
  }>;
}

export const ExecutiveDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // State management
  const [scorecard, setScorecard] = useState<PerformanceScorecard | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostEfficiencyAnalysis | null>(null);
  const [impactMeasurement, setImpactMeasurement] = useState<ImpactMeasurement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);

  // Generate executive summary
  const generateExecutiveSummary = useCallback((
    scorecard: PerformanceScorecard,
    competitive: CompetitiveAnalysis,
    cost: CostEfficiencyAnalysis
  ): ExecutiveSummary => {
    const overallHealth = scorecard.overallScore >= 85 ? 'excellent' :
                         scorecard.overallScore >= 75 ? 'good' :
                         scorecard.overallScore >= 60 ? 'needs_attention' : 'critical';

    return {
      overallHealth,
      keyWins: [
        `Overall performance score: ${scorecard.overallScore.toFixed(1)}/100`,
        `Ranked #${competitive.organizationRank} out of ${competitive.marketPosition?.totalCompetitors || 0} organizations`,
        `Cost per beneficiary: ₹${cost.costPerBeneficiary.toLocaleString()}`,
        'Strong program completion rates across all initiatives'
      ],
      criticalAlerts: scorecard.overallScore < 70 ? [
        'Performance below 70% threshold - immediate attention required',
        'Review underperforming categories for improvement opportunities'
      ] : [],
      upcomingMilestones: [
        { title: 'Q4 Fundraising Target', date: '2025-12-31', status: 'on_track' },
        { title: 'Annual Impact Report', date: '2025-11-30', status: 'on_track' },
        { title: 'Volunteer Training Program', date: '2025-10-15', status: 'at_risk' }
      ]
    };
  }, []);

  // Load executive dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [
        scorecardData,
        competitiveData,
        costData,
        impactData
      ] = await Promise.all([
        businessIntelligenceService.generatePerformanceScorecard(user.role, selectedTimeframe),
        businessIntelligenceService.getCompetitiveAnalysis('ngo', 'india'),
        businessIntelligenceService.analyzeCostEfficiency(),
        businessIntelligenceService.measureImpact(['education', 'healthcare', 'environment'])
      ]);

      setScorecard(scorecardData);
      setCompetitiveAnalysis(competitiveData);
      setCostAnalysis(costData);
      setImpactMeasurement(impactData);
      setExecutiveSummary(generateExecutiveSummary(scorecardData, competitiveData, costData));
    } catch (error) {
      console.error('Error loading executive dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedTimeframe, generateExecutiveSummary]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Render performance scorecard
  const renderPerformanceScorecard = () => {
    if (!scorecard) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Scorecard</h3>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              scorecard.overallScore >= 85 ? 'bg-green-100 text-green-800' :
              scorecard.overallScore >= 75 ? 'bg-blue-100 text-blue-800' :
              scorecard.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {scorecard.overallScore.toFixed(1)}/100
            </div>
          </div>
        </div>

        {/* Overall Score Visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Performance</span>
            <span className="text-2xl font-bold text-gray-900">{scorecard.overallScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            {/* eslint-disable-next-line no-inline-styles */}
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                scorecard.overallScore >= 85 ? 'bg-green-500' :
                scorecard.overallScore >= 75 ? 'bg-blue-500' :
                scorecard.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, scorecard.overallScore))}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scorecard.categories.map((category: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Weight: {(category.weight * 100).toFixed(0)}%
                  </span>
                  <span className={`text-lg font-semibold ${
                    category.score >= 85 ? 'text-green-600' :
                    category.score >= 75 ? 'text-blue-600' :
                    category.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {category.score}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                {/* eslint-disable-next-line no-inline-styles */}
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.score >= 85 ? 'bg-green-500' :
                    category.score >= 75 ? 'bg-blue-500' :
                    category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, category.score))}%` }}
                />
              </div>

              <div className="space-y-1">
                {category.insights?.slice(0, 2).map((insight: string, i: number) => (
                  <p key={i} className="text-xs text-gray-600">• {insight}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Strategic Recommendations</h4>
          <div className="space-y-2">
            {scorecard.recommendations.slice(0, 3).map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-blue-100 text-blue-700">
                  {(index + 1)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render competitive analysis
  const renderCompetitiveAnalysis = () => {
    if (!competitiveAnalysis) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Competitive Position</h3>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Rank #{competitiveAnalysis.organizationRank} of {competitiveAnalysis.marketPosition?.totalCompetitors || 0}
            </span>
          </div>
        </div>

        {/* Benchmark Radar Chart */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Performance Benchmarks</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competitiveAnalysis.benchmarks.map(b => ({
                metric: b.metric.replace(/ /g, '\n'),
                yours: (b.organizationValue / b.topQuartile) * 100,
                industry: (b.industryAverage / b.topQuartile) * 100,
                top: 100
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Your Organization" dataKey="yours" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                <Radar name="Industry Average" dataKey="industry" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths and Improvement Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Key Strengths
            </h4>
            <ul className="space-y-2">
              {competitiveAnalysis.marketPosition?.strengthAreas?.map((strength: string, index: number) => (
                <li key={index} className="text-sm text-green-800">• {strength}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Improvement Areas
            </h4>
            <ul className="space-y-2">
              {competitiveAnalysis.improvementAreas?.map((area: string, index: number) => (
                <li key={index} className="text-sm text-orange-800">• {area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Render cost efficiency analysis
  const renderCostAnalysis = () => {
    if (!costAnalysis) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Efficiency Analysis</h3>

        {/* Key Metric */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Cost per Beneficiary</h4>
              <p className="text-sm text-blue-700">Average cost to help one person</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                ₹{costAnalysis.costPerBeneficiary.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Program ROI Chart */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Program Return on Investment</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costAnalysis.programROI}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="programName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'roi' ? `${value}x` : `₹${value.toLocaleString()}`,
                  name === 'roi' ? 'ROI' : name === 'investment' ? 'Investment' : 'Impact Value'
                ]} />
                <Legend />
                <Bar dataKey="investment" fill="#FF8042" name="Investment" />
                <Bar dataKey="impact" fill="#00C49F" name="Impact Value" />
                <Bar dataKey="roi" fill="#0088FE" name="ROI Ratio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {costAnalysis.resourceUtilization.map((resource: any, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">{resource.resource}</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className={`text-lg font-semibold ${
                  resource.efficiency >= 90 ? 'text-green-600' :
                  resource.efficiency >= 75 ? 'text-blue-600' :
                  resource.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {resource.efficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* eslint-disable-next-line no-inline-styles */}
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    resource.efficiency >= 90 ? 'bg-green-500' :
                    resource.efficiency >= 75 ? 'bg-blue-500' :
                    resource.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, resource.efficiency))}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {resource.utilized}/{resource.allocated} utilized
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render impact measurement
  const renderImpactMeasurement = () => {
    if (!impactMeasurement) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Impact Measurement</h3>

        {/* Social Return on Investment */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-3">Social Return on Investment (SROI)</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-700">
                Investment: ₹{impactMeasurement.socialReturn.totalInvestment.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">
                Social Value: ₹{impactMeasurement.socialReturn.totalValue.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-900">
                {impactMeasurement.socialReturn.ratio.toFixed(1)}:1
              </div>
              <div className="text-sm text-purple-700">Return Ratio</div>
            </div>
          </div>
        </div>

        {/* Outcome Metrics */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Outcome Achievements</h4>
          <div className="space-y-4">
            {impactMeasurement.outcomeMetrics.map((outcome: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{outcome.outcome}</h5>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">
                      {outcome.achieved.toLocaleString()} {outcome.unit}
                    </span>
                    <div className={`text-sm ${
                      outcome.progress >= 100 ? 'text-green-600' :
                      outcome.progress >= 80 ? 'text-blue-600' :
                      outcome.progress >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {outcome.progress.toFixed(1)}% of target
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  {/* eslint-disable-next-line no-inline-styles */}
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      outcome.progress >= 100 ? 'bg-green-500' :
                      outcome.progress >= 80 ? 'bg-blue-500' :
                      outcome.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, outcome.progress))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Long-term Impact */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Long-term Impact Indicators</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactMeasurement.longTermImpact.map((indicator: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">{indicator.indicator}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Baseline:</span>
                    <span className="font-medium">{indicator.baseline.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">{indicator.current.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Improvement:</span>
                    <span className={`font-medium ${
                      indicator.improvement > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {indicator.improvement > 0 ? '+' : ''}{indicator.improvement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attribution:</span>
                    <span className="font-medium">{indicator.attribution}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading Executive Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600">Strategic insights and performance overview</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select timeframe"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Health */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  executiveSummary.overallHealth === 'excellent' ? 'bg-green-100' :
                  executiveSummary.overallHealth === 'good' ? 'bg-blue-100' :
                  executiveSummary.overallHealth === 'needs_attention' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Activity className={`h-8 w-8 ${
                    executiveSummary.overallHealth === 'excellent' ? 'text-green-600' :
                    executiveSummary.overallHealth === 'good' ? 'text-blue-600' :
                    executiveSummary.overallHealth === 'needs_attention' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {executiveSummary.overallHealth.replace('_', ' ')}
                </h3>
                <p className="text-sm text-gray-600">Overall Health</p>
              </div>

              {/* Key Wins */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Key Achievements
                </h3>
                <ul className="space-y-1">
                  {executiveSummary.keyWins.slice(0, 3).map((win: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">• {win}</li>
                  ))}
                </ul>
              </div>

              {/* Critical Alerts */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  {executiveSummary.criticalAlerts.length > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-600 mr-2" />
                  )}
                  {executiveSummary.criticalAlerts.length > 0 ? 'Critical Alerts' : 'Upcoming Milestones'}
                </h3>
                <ul className="space-y-1">
                  {(executiveSummary.criticalAlerts.length > 0 
                    ? executiveSummary.criticalAlerts 
                    : executiveSummary.upcomingMilestones.slice(0, 3).map(m => m.title)
                  ).map((item: string, index: number) => (
                    <li key={index} className={`text-sm ${
                      executiveSummary.criticalAlerts.length > 0 ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="px-6 py-4 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {renderPerformanceScorecard()}
          {renderCompetitiveAnalysis()}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {renderCostAnalysis()}
          {renderImpactMeasurement()}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
