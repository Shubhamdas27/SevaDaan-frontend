import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Download,
  Lightbulb,
  Bell,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEnhancedRealtimeDashboard } from '../hooks/useRealtimeDashboard';
import { aiInsightsService, AIInsight, AnalyticsInput } from '../services/aiInsightsService';
import { pdfReportService, ReportConfig, ChartData, TableData, MetricsData } from '../services/pdfReportService';
import AdvancedFiltering, { CustomView } from '../components/AdvancedFiltering';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

// Interface for dashboard data
interface DashboardData {
  donations: Array<{ amount: number; date: string; donor: string; program: string }>;
  volunteers: Array<{ count: number; date: string; activity: string; hours: number }>;
  programs: Array<{ id: string; name: string; success_rate: number; participants: number; date: string; budget: number }>;
  users: Array<{ role: string; activity: string; date: string; active: boolean }>;
  metrics: MetricsData;
}

// Sample data generation (in real app, this would come from API)
const generateSampleData = (): DashboardData => {
  const donations = Array.from({ length: 30 }, (_, i) => ({
    amount: Math.floor(Math.random() * 10000) + 1000,
    date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    donor: `Donor ${i + 1}`,
    program: ['Education', 'Health', 'Environment', 'Poverty'][Math.floor(Math.random() * 4)]
  }));

  const volunteers = Array.from({ length: 20 }, (_, i) => ({
    count: Math.floor(Math.random() * 50) + 10,
    date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    activity: ['Field Work', 'Fundraising', 'Admin', 'Training'][Math.floor(Math.random() * 4)],
    hours: Math.floor(Math.random() * 8) + 1
  }));

  const programs = Array.from({ length: 10 }, (_, i) => ({
    id: `prog-${i + 1}`,
    name: `Program ${i + 1}`,
    success_rate: Math.floor(Math.random() * 40) + 60,
    participants: Math.floor(Math.random() * 200) + 50,
    date: format(subDays(new Date(), i * 3), 'yyyy-MM-dd'),
    budget: Math.floor(Math.random() * 100000) + 50000
  }));

  const users = Array.from({ length: 50 }, (_, i) => ({
    role: ['ngo_admin', 'volunteer', 'donor'][Math.floor(Math.random() * 3)],
    activity: 'login',
    date: format(subDays(new Date(), Math.floor(i / 2)), 'yyyy-MM-dd'),
    active: Math.random() > 0.3
  }));

  return {
    donations,
    volunteers,
    programs,
    users,
    metrics: {
      totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
      totalVolunteers: volunteers.reduce((sum, v) => sum + v.count, 0),
      activePrograms: programs.length,
      successRate: programs.reduce((sum, p) => sum + p.success_rate, 0) / programs.length,
      growthRate: 15.5,
      impactMetrics: [
        { label: 'People Helped', value: '12,450', change: 8.2 },
        { label: 'Projects Completed', value: '89', change: 12.1 },
        { label: 'Partner Organizations', value: '34', change: -2.1 }
      ]
    }
  };
};

export const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, notifications } = useEnhancedRealtimeDashboard();
  
  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [dashboardData, setDashboardData] = useState<DashboardData>(generateSampleData());
  const [filteredData, setFilteredData] = useState<DashboardData>(dashboardData);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update data when timeframe changes
  useEffect(() => {
    const newData = generateSampleData();
    // Adjust data based on timeframe
    if (selectedTimeframe === 'monthly') {
      newData.donations = newData.donations.slice(0, 15); // Show only last 15 days for monthly
      newData.volunteers = newData.volunteers.slice(0, 10);
    } else if (selectedTimeframe === 'yearly') {
      // For yearly, show aggregated data
      newData.donations = newData.donations.map(d => ({
        ...d,
        amount: d.amount * 12 // Simulate yearly aggregation
      }));
    }
    setDashboardData(newData);
    setFilteredData(newData);
    setLastUpdated(new Date());
  }, [selectedTimeframe]);

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Load AI insights
  const loadAIInsights = useCallback(async (data: DashboardData) => {
    if (!user) return;
    
    setIsLoadingInsights(true);
    try {
      const analyticsInput: AnalyticsInput = {
        donations: data.donations,
        volunteers: data.volunteers,
        programs: data.programs,
        users: data.users
      };
      
      const insights = await aiInsightsService.generateInsights(analyticsInput, user.role);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [user]);

  // Initialize insights
  useEffect(() => {
    loadAIInsights(filteredData);
  }, [filteredData, loadAIInsights]);

  // Handle filters change
  const handleFiltersChange = useCallback((filters: Record<string, any>) => {
    let filtered = { ...dashboardData };

    // Apply date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered.donations = filtered.donations.filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
      });
      
      filtered.volunteers = filtered.volunteers.filter(v => {
        const date = new Date(v.date);
        return date >= startDate && date <= endDate;
      });
    }

    // Apply program filter
    if (filters.program && filters.program.length > 0) {
      filtered.donations = filtered.donations.filter(d => 
        filters.program.includes(d.program.toLowerCase())
      );
    }

    // Apply donation range filter
    if (filters.donationRange) {
      filtered.donations = filtered.donations.filter(d => 
        d.amount >= filters.donationRange.min && d.amount <= filters.donationRange.max
      );
    }

    // Recalculate metrics
    filtered.metrics = {
      ...filtered.metrics,
      totalDonations: filtered.donations.reduce((sum, d) => sum + d.amount, 0),
      totalVolunteers: filtered.volunteers.reduce((sum, v) => sum + v.count, 0)
    };

    setFilteredData(filtered);
  }, [dashboardData]);

  // Handle view change
  const handleViewChange = useCallback((_view: CustomView | null) => {
    // View change handling would be implemented here
    // For now, we'll just apply the filters if view exists
    if (_view) {
      handleFiltersChange(_view.filters);
    }
  }, [handleFiltersChange]);

  // Generate PDF report
  const generateReport = async (type: 'quick' | 'detailed' | 'charts') => {
    if (!user) return;
    
    setIsGeneratingReport(true);
    try {
      const chartsData: ChartData[] = [
        {
          id: 'donations-chart',
          title: 'Donations Over Time',
          type: 'line',
          data: filteredData.donations.slice(0, 10)
        },
        {
          id: 'volunteer-chart',
          title: 'Volunteer Activities',
          type: 'bar',
          data: filteredData.volunteers.slice(0, 10)
        }
      ];

      const tablesData: TableData[] = [
        {
          id: 'programs-table',
          title: 'Program Performance',
          headers: ['Program', 'Success Rate', 'Participants'],
          rows: filteredData.programs.map(p => [p.name, `${p.success_rate}%`, p.participants.toString()])
        }
      ];

      switch (type) {
        case 'quick':
          await pdfReportService.generateQuickReport(filteredData.metrics, user.name || 'NGO Dashboard');
          break;
        case 'charts':
          await pdfReportService.generateChartsReport(chartsData, user.name || 'NGO Dashboard');
          break;
        case 'detailed':
          const config: ReportConfig = {
            title: 'Comprehensive NGO Report',
            subtitle: `Generated for ${user.name || 'Your Organization'}`,
            includeSummary: true,
            includeCharts: true,
            includeTables: true,
            includeMetrics: true,
            dateRange: { start: subMonths(new Date(), 1), end: new Date() },
            sections: [
              { id: '1', title: 'Summary', type: 'summary', order: 1 },
              { id: '2', title: 'Donation Trends', type: 'chart', chartId: 'donations-chart', order: 2 },
              { id: '3', title: 'Program Performance', type: 'table', tableId: 'programs-table', order: 3 }
            ],
            branding: {
              organizationName: user.name || 'NGO Dashboard'
            }
          };
          await pdfReportService.generateReport(config, chartsData, tablesData, filteredData.metrics);
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
      setShowReportModal(false);
    }
  };

  // Prepare chart data
  const donationChartData = filteredData.donations
    .slice(0, 10)
    .reverse()
    .map(d => ({
      date: format(new Date(d.date), 'MMM dd'),
      amount: d.amount,
      program: d.program
    }));

  const volunteerChartData = filteredData.volunteers
    .slice(0, 8)
    .reduce((acc, v) => {
      const existing = acc.find(item => item.activity === v.activity);
      if (existing) {
        existing.count += v.count;
        existing.hours += v.hours;
      } else {
        acc.push({ activity: v.activity, count: v.count, hours: v.hours });
      }
      return acc;
    }, [] as Array<{ activity: string; count: number; hours: number }>);

  const programChartData = filteredData.programs
    .slice(0, 6)
    .map(p => ({
      name: p.name,
      successRate: p.success_rate,
      participants: p.participants
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Dashboard</h1>
              {isConnected && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Live Updates Active</span>
                </div>
              )}
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">{notifications.length} notifications</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                aria-label="Select timeframe"
              >
                <option value="monthly">Monthly View</option>
                <option value="quarterly">Quarterly View</option>
                <option value="yearly">Yearly View</option>
              </select>

              <div className="text-sm text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>

              <button
                onClick={() => loadAIInsights(filteredData)}
                disabled={isLoadingInsights}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingInsights ? 'animate-spin' : ''}`} />
                <span>Refresh Insights</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filtering */}
      <div className="px-6 py-4">
        <AdvancedFiltering
          onFiltersChange={handleFiltersChange}
          onViewChange={handleViewChange}
          role={user?.role || 'volunteer'}
        />
      </div>

      {/* AI Insights Panel */}
      {showInsights && aiInsights.length > 0 && (
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiInsights.slice(0, 6).map(insight => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.severity === 'success' ? 'border-green-500 bg-green-50' :
                      insight.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      insight.severity === 'critical' ? 'border-red-500 bg-red-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            insight.type === 'prediction' ? 'bg-purple-100 text-purple-700' :
                            insight.type === 'trend' ? 'bg-blue-100 text-blue-700' :
                            insight.type === 'anomaly' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {insight.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {insight.recommendations && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium">Recommendations:</p>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {insight.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{filteredData.metrics.totalDonations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.metrics.totalVolunteers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.metrics.activePrograms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredData.metrics.successRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donations Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#0088FE" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volunteer Activities Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Activities</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volunteerChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#00C49F" />
                  <Bar dataKey="hours" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Success Rates</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={programChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="successRate" stroke="#8884D8" fill="#8884D8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Impact Metrics Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData.metrics.impactMetrics.map((metric, index) => ({
                      name: metric.label,
                      value: parseInt(metric.value.replace(/[^0-9]/g, '')) || index + 1
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {filteredData.metrics.impactMetrics.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">Choose the type of report you want to generate:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => generateReport('quick')}
                  disabled={isGeneratingReport}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">Quick Summary</div>
                  <div className="text-sm text-gray-600">Key metrics and overview</div>
                </button>
                
                <button
                  onClick={() => generateReport('charts')}
                  disabled={isGeneratingReport}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">Charts Report</div>
                  <div className="text-sm text-gray-600">Visual analytics and trends</div>
                </button>
                
                <button
                  onClick={() => generateReport('detailed')}
                  disabled={isGeneratingReport}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">Comprehensive Report</div>
                  <div className="text-sm text-gray-600">Full analysis with recommendations</div>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                disabled={isGeneratingReport}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
            {isGeneratingReport && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-gray-900">Generating report...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;
