import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  DollarSign,
  Users,
  Target
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
import { useAuth } from '../../context/AuthContext';
import { businessIntelligenceService } from '../../services/businessIntelligenceService';
import { 
  ResponsiveGrid, 
  MobileCard, 
  MobileStatsGrid, 
  MobileChartContainer,
  MobileTabs
} from './MobileComponents';
import MobileNavigation from './MobileNavigation';

// Types
interface PerformanceScorecard {
  overallScore: number;
  categories: Array<{
    name: string;
    score: number;
    weight: number;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    expectedImpact: string;
  }>;
}

interface CompetitiveAnalysis {
  organizationRank: number;
  totalOrganizations: number;
  benchmarks: Array<{
    metric: string;
    yourValue: number;
    industryAverage: number;
    topPerformer: number;
  }>;
  strengths: string[];
  improvementAreas: string[];
}

interface CostEfficiencyAnalysis {
  costPerBeneficiary: number;
  programROI: Array<{
    programName: string;
    roi: number;
  }>;
}

interface ImpactMeasurement {
  socialReturn: {
    ratio: number;
  };
  outcomeMetrics: Array<{
    outcome: string;
    achieved: number;
    unit: string;
    progress: number;
  }>;
}

interface ExecutiveSummary {
  overallHealth: 'excellent' | 'good' | 'needs_attention' | 'critical';
  keyWins: string[];
  criticalAlerts: string[];
  upcomingMilestones: Array<{
    title: string;
    date: string;
    status: string;
  }>;
}

const MobileExecutiveDashboard: React.FC = () => {
  const [scorecard, setScorecard] = useState<PerformanceScorecard | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostEfficiencyAnalysis | null>(null);
  const [impactMeasurement, setImpactMeasurement] = useState<ImpactMeasurement | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [scorecardData, competitiveData, costData, impactData] = await Promise.all([
        businessIntelligenceService.generatePerformanceScorecard(user?.role || 'ngo', selectedTimeframe),
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
  }, [user, selectedTimeframe]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
        `Ranked #${competitive.organizationRank} out of ${competitive.totalOrganizations} organizations`,
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

  // Generate key stats for mobile stats grid
  const generateKeyStats = (): Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
    change?: { value: number; type: 'increase' | 'decrease' };
  }> => {
    if (!scorecard || !competitiveAnalysis || !costAnalysis || !impactMeasurement) return [];

    return [
      {
        label: 'Performance Score',
        value: `${scorecard.overallScore.toFixed(1)}/100`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: (scorecard.overallScore >= 85 ? 'green' : scorecard.overallScore >= 75 ? 'blue' : 'yellow') as 'green' | 'blue' | 'yellow',
        change: { value: 5.2, type: 'increase' as const }
      },
      {
        label: 'Market Rank',
        value: `#${competitiveAnalysis.organizationRank}`,
        icon: <Award className="h-5 w-5" />,
        color: 'blue' as const,
        change: { value: 2, type: 'increase' as const }
      },
      {
        label: 'Cost per Beneficiary',
        value: `₹${costAnalysis.costPerBeneficiary.toLocaleString()}`,
        icon: <DollarSign className="h-5 w-5" />,
        color: 'green' as const,
        change: { value: 8.5, type: 'decrease' as const }
      },
      {
        label: 'SROI Ratio',
        value: `${impactMeasurement.socialReturn.ratio.toFixed(1)}:1`,
        icon: <Target className="h-5 w-5" />,
        color: 'purple' as const,
        change: { value: 12.3, type: 'increase' as const }
      },
      {
        label: 'Active Programs',
        value: '45',
        icon: <Users className="h-5 w-5" />,
        color: 'indigo' as const,
        change: { value: 3, type: 'increase' as const }
      },
      {
        label: 'Lives Impacted',
        value: '12.5K',
        icon: <Activity className="h-5 w-5" />,
        color: 'green' as const,
        change: { value: 18.7, type: 'increase' as const }
      }
    ];
  };

  // Render performance scorecard for mobile
  const renderMobilePerformanceScorecard = () => {
    if (!scorecard) return null;

    return (
      <MobileCard 
        title="Performance Scorecard" 
        subtitle={`Overall Score: ${scorecard.overallScore.toFixed(1)}/100`}
        icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        isCollapsible
      >
        <div className="space-y-4">
          {/* Overall Score Bar */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Performance</span>
              <span className="text-2xl font-bold text-gray-900">{scorecard.overallScore.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  scorecard.overallScore >= 85 ? 'bg-green-500' :
                  scorecard.overallScore >= 75 ? 'bg-blue-500' :
                  scorecard.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                data-width={`${scorecard.overallScore}%`}
              />
            </div>
          </div>

          {/* Categories Grid */}
          <ResponsiveGrid cols={{ default: 1, sm: 2 }} gap={3}>
            {scorecard.categories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                  <span className={`text-lg font-semibold ${
                    category.score >= 85 ? 'text-green-600' :
                    category.score >= 75 ? 'text-blue-600' :
                    category.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {category.score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full ${
                      category.score >= 85 ? 'bg-green-500' :
                      category.score >= 75 ? 'bg-blue-500' :
                      category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    data-width={`${category.score}%`}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Weight: {(category.weight * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </ResponsiveGrid>

          {/* Top Recommendations */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 text-sm">Top Recommendations</h4>
            <div className="space-y-2">
              {scorecard.recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {rec.priority.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900">{rec.action}</p>
                    <p className="text-xs text-blue-700">{rec.expectedImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileCard>
    );
  };

  // Render competitive analysis for mobile
  const renderMobileCompetitiveAnalysis = () => {
    if (!competitiveAnalysis) return null;

    return (
      <MobileCard 
        title="Competitive Position" 
        subtitle={`Rank #${competitiveAnalysis.organizationRank} of ${competitiveAnalysis.totalOrganizations}`}
        icon={<Award className="h-6 w-6 text-yellow-600" />}
        isCollapsible
      >
        <div className="space-y-4">
          {/* Radar Chart */}
          <MobileChartContainer title="Performance Benchmarks" height={250}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competitiveAnalysis.benchmarks.map(b => ({
                metric: b.metric.split(' ').slice(0, 2).join(' '),
                yours: (b.yourValue / b.topPerformer) * 100,
                industry: (b.industryAverage / b.topPerformer) * 100,
                top: 100
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Your Org" dataKey="yours" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                <Radar name="Industry Avg" dataKey="industry" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </MobileChartContainer>

          {/* Strengths and Improvements */}
          <ResponsiveGrid cols={{ default: 1, sm: 2 }} gap={4}>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Key Strengths
              </h4>
              <ul className="space-y-1">
                {competitiveAnalysis.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-xs text-green-800">• {strength}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2 flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Improve Areas
              </h4>
              <ul className="space-y-1">
                {competitiveAnalysis.improvementAreas.slice(0, 3).map((area, index) => (
                  <li key={index} className="text-xs text-orange-800">• {area}</li>
                ))}
              </ul>
            </div>
          </ResponsiveGrid>
        </div>
      </MobileCard>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const tabsData = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Activity className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          {/* Key Stats */}
          <MobileStatsGrid stats={generateKeyStats()} />
          
          {/* Executive Summary */}
          {executiveSummary && (
            <MobileCard 
              title="Executive Summary" 
              icon={<Info className="h-6 w-6 text-blue-600" />}
            >
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                    executiveSummary.overallHealth === 'excellent' ? 'bg-green-100' :
                    executiveSummary.overallHealth === 'good' ? 'bg-blue-100' :
                    executiveSummary.overallHealth === 'needs_attention' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Activity className={`h-6 w-6 ${
                      executiveSummary.overallHealth === 'excellent' ? 'text-green-600' :
                      executiveSummary.overallHealth === 'good' ? 'text-blue-600' :
                      executiveSummary.overallHealth === 'needs_attention' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {executiveSummary.overallHealth.replace('_', ' ')} Health
                  </h3>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {executiveSummary.keyWins.slice(0, 3).map((win, index) => (
                      <li key={index} className="text-xs text-gray-700">• {win}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </MobileCard>
          )}
        </div>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <TrendingUp className="h-4 w-4" />,
      content: renderMobilePerformanceScorecard()
    },
    {
      id: 'competitive',
      label: 'Market Position',
      icon: <Award className="h-4 w-4" />,
      content: renderMobileCompetitiveAnalysis()
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          {/* Cost Analysis */}
          {costAnalysis && (
            <MobileCard 
              title="Cost Efficiency" 
              subtitle={`₹${costAnalysis.costPerBeneficiary.toLocaleString()} per beneficiary`}
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
            >
              <MobileChartContainer height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costAnalysis.programROI.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="programName" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="roi" fill="#0088FE" name="ROI" />
                  </BarChart>
                </ResponsiveContainer>
              </MobileChartContainer>
            </MobileCard>
          )}

          {/* Impact Measurement */}
          {impactMeasurement && (
            <MobileCard 
              title="Social Impact" 
              subtitle={`${impactMeasurement.socialReturn.ratio.toFixed(1)}:1 SROI`}
              icon={<Target className="h-6 w-6 text-purple-600" />}
            >
              <div className="space-y-3">
                {impactMeasurement.outcomeMetrics.slice(0, 3).map((outcome, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{outcome.outcome}</h5>
                      <span className="text-sm font-semibold text-gray-900">
                        {outcome.achieved.toLocaleString()} {outcome.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                          outcome.progress >= 100 ? 'bg-green-500' :
                          outcome.progress >= 80 ? 'bg-blue-500' :
                          outcome.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        data-width={`${Math.min(outcome.progress, 100)}%`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {outcome.progress.toFixed(1)}% of target
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 pt-16 lg:pt-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-sm text-gray-600">Strategic insights and performance</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select timeframe"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              
              <button
                onClick={loadDashboardData}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Refresh dashboard"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <MobileTabs tabs={tabsData} defaultTab="overview" />
      </div>
    </div>
  );
};

export default MobileExecutiveDashboard;
