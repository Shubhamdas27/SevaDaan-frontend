// Business Intelligence Types

export interface PerformanceScorecard {
  id: string;
  organizationId: string;
  period: string;
  overallScore: number;
  categories: ScorecardCategory[];
  timestamp: string;
  lastUpdated: string;
  recommendations: string[];
}

export interface ScorecardCategory {
  name: string;
  score: number;
  weight: number;
  metrics: ScorecardMetric[];
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface ScorecardMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

export interface CompetitiveAnalysis {
  id: string;
  organizationId: string;
  analysisDate: string;
  industryBenchmarks: BenchmarkData[];
  competitorComparison: CompetitorData[];
  marketPosition: MarketPosition;
  recommendations: string[];
  organizationRank: number;
  benchmarks: BenchmarkData[];
  improvementAreas: string[];
}

export interface BenchmarkData {
  metric: string;
  organizationValue: number;
  industryAverage: number;
  industryMedian: number;
  topQuartile: number;
  unit: string;
  ranking: number;
  totalParticipants: number;
}

export interface CompetitorData {
  name: string;
  type: 'direct' | 'indirect';
  metrics: {
    [key: string]: number;
  };
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
}

export interface MarketPosition {
  overallRanking: number;
  totalCompetitors: number;
  strengthAreas: string[];
  improvementAreas: string[];
  competitiveAdvantages: string[];
  threats: string[];
}

export interface CostEfficiencyAnalysis {
  id: string;
  organizationId: string;
  analysisDate: string;
  overallEfficiency: number;
  costBreakdown: CostCategory[];
  efficiency: EfficiencyMetric[];
  recommendations: EfficiencyRecommendation[];
  projections: CostProjection[];
  costPerBeneficiary: number;
  programROI: any[];
  resourceUtilization: any[];
}

export interface CostCategory {
  category: string;
  currentCost: number;
  budgetedCost: number;
  variance: number;
  variancePercentage: number;
  trend: 'up' | 'down' | 'stable';
  subCategories: SubCostCategory[];
}

export interface SubCostCategory {
  name: string;
  cost: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EfficiencyMetric {
  name: string;
  currentValue: number;
  benchmarkValue: number;
  unit: string;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface EfficiencyRecommendation {
  category: string;
  recommendation: string;
  potentialSavings: number;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  complexity: 'easy' | 'moderate' | 'complex';
}

export interface CostProjection {
  period: string;
  projectedCost: number;
  baseline: number;
  withOptimizations: number;
  potentialSavings: number;
}

export interface ImpactMeasurement {
  id: string;
  organizationId: string;
  measurementDate: string;
  overallImpactScore: number;
  socialROI: number;
  impactMetrics: ImpactMetric[];
  beneficiaryData: BeneficiaryData;
  outcomeAnalysis: OutcomeAnalysis[];
  longitudinalTrends: TrendData[];
  socialReturn: {
    ratio: number;
    totalInvestment: number;
    totalValue: number;
  };
  outcomeMetrics: any[];
  longTermImpact: any[];
}

export interface ImpactMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  achieved: boolean;
  category: 'social' | 'environmental' | 'economic' | 'educational' | 'health';
  methodology: string;
  dataSource: string;
  lastUpdated: string;
}

export interface BeneficiaryData {
  totalReached: number;
  directBeneficiaries: number;
  indirectBeneficiaries: number;
  demographics: Demographics;
  geographicDistribution: GeographicData[];
  engagementLevels: EngagementData[];
}

export interface Demographics {
  ageGroups: AgeGroup[];
  gender: GenderData;
  educationLevels: EducationData[];
  incomeLevels: IncomeData[];
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface GenderData {
  male: number;
  female: number;
  other: number;
  notSpecified: number;
}

export interface EducationData {
  level: string;
  count: number;
  percentage: number;
}

export interface IncomeData {
  level: string;
  count: number;
  percentage: number;
}

export interface GeographicData {
  region: string;
  beneficiaries: number;
  percentage: number;
  impactScore: number;
}

export interface EngagementData {
  level: 'high' | 'medium' | 'low';
  count: number;
  percentage: number;
  retentionRate: number;
}

export interface OutcomeAnalysis {
  outcome: string;
  category: string;
  achieved: boolean;
  targetValue: number;
  actualValue: number;
  unit: string;
  timeframe: string;
  methodology: string;
  confidence: number;
}

export interface TrendData {
  period: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

// Utility types for API responses
export interface BusinessIntelligenceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface BusinessIntelligenceParams {
  organizationId: string;
  startDate?: string;
  endDate?: string;
  includeProjections?: boolean;
  includeBenchmarks?: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  sections: string[];
  includeCharts: boolean;
  includeRawData: boolean;
}

// Dashboard specific types
export interface BusinessIntelligenceDashboard {
  scorecard: PerformanceScorecard;
  competitive: CompetitiveAnalysis;
  costEfficiency: CostEfficiencyAnalysis;
  impact: ImpactMeasurement;
  alerts: Alert[];
  insights: Insight[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
  recommendations: string[];
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  dataPoints: string[];
  recommendations: string[];
  timestamp: string;
}
