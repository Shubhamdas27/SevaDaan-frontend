import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  EnhancedBarChart,
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedPieChart,
  MultiLineChart,
  StackedBarChart,
  COLORS
} from '../charts/EnhancedCharts';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Target,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react';

// Interface definitions
interface AnalyticsData {
  monthlyTrends: Array<{ name: string; value: number; volunteers: number; donations: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  performanceMetrics: Array<{ name: string; current: number; target: number; lastMonth: number }>;
  userGrowth: Array<{ name: string; value: number }>;
  donationTrends: Array<{ name: string; amount: number; count: number }>;
  programEffectiveness: Array<{ name: string; success: number; total: number; effectiveness: number }>;
}

interface DateRange {
  start: string;
  end: string;
  label: string;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    label: 'Last 30 Days'
  });
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'performance' | 'comparison'>('overview');

  // Date range presets
  const dateRanges: DateRange[] = [
    {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 7 Days'
    },
    {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 30 Days'
    },
    {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 3 Months'
    },
    {
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last Year'
    }
  ];

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?start=${selectedDateRange.start}&end=${selectedDateRange.end}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Fallback to mock data
        setAnalyticsData(generateMockAnalyticsData());
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData(generateMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  // Generate mock analytics data
  const generateMockAnalyticsData = (): AnalyticsData => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return {
      monthlyTrends: months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 1000) + 500,
        volunteers: Math.floor(Math.random() * 100) + 50,
        donations: Math.floor(Math.random() * 50000) + 10000
      })),
      categoryDistribution: [
        { name: 'Education', value: 400 },
        { name: 'Healthcare', value: 300 },
        { name: 'Environment', value: 200 },
        { name: 'Social Work', value: 150 },
        { name: 'Emergency Aid', value: 100 }
      ],
      performanceMetrics: [
        { name: 'User Satisfaction', current: 94, target: 95, lastMonth: 92 },
        { name: 'Program Completion', current: 87, target: 90, lastMonth: 85 },
        { name: 'Volunteer Retention', current: 78, target: 80, lastMonth: 76 },
        { name: 'Donation Growth', current: 112, target: 110, lastMonth: 108 }
      ],
      userGrowth: months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 200) + 100
      })),
      donationTrends: months.map(month => ({
        name: month,
        amount: Math.floor(Math.random() * 100000) + 50000,
        count: Math.floor(Math.random() * 500) + 200
      })),
      programEffectiveness: [
        { name: 'Education Programs', success: 45, total: 50, effectiveness: 90 },
        { name: 'Health Initiatives', success: 38, total: 45, effectiveness: 84 },
        { name: 'Environmental Projects', success: 28, total: 30, effectiveness: 93 },
        { name: 'Community Support', success: 22, total: 25, effectiveness: 88 }
      ]
    };
  };

  // Export analytics data
  const exportData = () => {
    if (!analyticsData) return;
    
    const exportData = {
      dateRange: selectedDateRange,
      exportDate: new Date().toISOString(),
      analytics: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${selectedDateRange.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-600">
        <p>Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              title="Select Date Range"
              value={selectedDateRange.label}
              onChange={(e) => {
                const range = dateRanges.find(r => r.label === e.target.value);
                if (range) setSelectedDateRange(range);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateRanges.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <Button onClick={fetchAnalyticsData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'comparison', label: 'Comparison', icon: PieChart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedLineChart
                data={analyticsData.monthlyTrends}
                height={300}
                color={COLORS.primary}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedPieChart
                data={analyticsData.categoryDistribution}
                height={300}
                showLabels={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedAreaChart
                data={analyticsData.userGrowth}
                height={300}
                color={COLORS.secondary}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <p className="text-sm text-gray-600">Target: {metric.target}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{metric.current}%</p>
                      <Badge
                        variant={metric.current >= metric.target ? 'success' : 'warning'}
                      >
                        {metric.current >= metric.target ? 'On Track' : 'Below Target'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {activeView === 'trends' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Metric Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiLineChart
                data={analyticsData.monthlyTrends}
                lines={[
                  { dataKey: 'value', name: 'Total Activity', color: COLORS.primary },
                  { dataKey: 'volunteers', name: 'Volunteers', color: COLORS.secondary },
                ]}
                height={400}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Donation Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedBarChart
                  data={analyticsData.donationTrends.map(d => ({ name: d.name, value: d.amount }))}
                  dataKey="value"
                  height={300}
                  color={COLORS.accent}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <StackedBarChart
                  data={analyticsData.programEffectiveness.map(p => ({ 
                    name: p.name, 
                    value: p.total,
                    success: p.success, 
                    total: p.total 
                  }))}
                  bars={[
                    { dataKey: 'success', name: 'Successful', color: COLORS.secondary },
                    { dataKey: 'total', name: 'Total', color: COLORS.primary }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeView === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedBarChart
                data={analyticsData.performanceMetrics.map(m => ({
                  name: m.name,
                  value: m.current,
                  target: m.target
                }))}
                height={300}
                color={COLORS.purple}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Effectiveness Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedPieChart
                data={analyticsData.programEffectiveness.map(p => ({
                  name: p.name,
                  value: p.effectiveness
                }))}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Tab */}
      {activeView === 'comparison' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiLineChart
                data={analyticsData.monthlyTrends}
                lines={[
                  { dataKey: 'value', name: 'Current Year', color: COLORS.primary },
                  { dataKey: 'volunteers', name: 'Volunteers', color: COLORS.secondary },
                  { dataKey: 'donations', name: 'Donations (scaled)', color: COLORS.accent }
                ]}
                height={400}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
