import React, { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle,
  UserCheck,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { StatCard } from '../../ui/StatCard';
import { ProgressBar } from '../../ui/ProgressBar';
import { Button } from '../../ui/Button';
import GrantAnalyticsChart from './GrantAnalyticsChart';
import ProgramManagementTable from './ProgramManagementTable';
import ServiceHeatmap from './ServiceHeatmap';
import ReferralTrackingList from './ReferralTrackingList';
import apiService from '../../../lib/apiService';
import DashboardErrorBoundary from '../DashboardErrorBoundary';

interface DashboardStats {
  totalGrants: number;
  totalVolunteers: number;
  totalBeneficiaries: number;
  pendingApprovals: number;
  programCompletion: number;
  fundingProgress: number;
  totalNGOs: number;
  activeNGOs: number;
  totalUsers: number;
  totalDonations: number;
  monthlyDonations: number;
  totalPrograms: number;
  activePrograms: number;
  activeVolunteers: number;
  systemHealth: 'good' | 'warning' | 'critical';
  platformUsage: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGrants: 0,
    totalVolunteers: 0,
    totalBeneficiaries: 0,
    pendingApprovals: 0,
    programCompletion: 0,
    fundingProgress: 0,
    totalNGOs: 0,
    activeNGOs: 0,
    totalUsers: 0,
    totalDonations: 0,
    monthlyDonations: 0,
    totalPrograms: 0,
    activePrograms: 0,
    activeVolunteers: 0,
    systemHealth: 'good',
    platformUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, fetch this data from your API
        const response = await apiService.getNGOAdminDashboard();
        // Use the actual response data
        setStats({
          totalGrants: response.stats.totalGrants || 24,
          totalVolunteers: response.stats.totalVolunteers || 128,
          totalBeneficiaries: response.stats.totalBeneficiaries || 1245,
          pendingApprovals: response.stats.pendingApprovals || 8,
          programCompletion: response.stats.programCompletion || 75,
          fundingProgress: response.stats.fundingProgress || 68,
          totalNGOs: response.stats.totalNGOs || 50,
          activeNGOs: response.stats.activeNGOs || 45,
          totalUsers: response.stats.totalUsers || 2500,
          totalDonations: response.stats.totalDonations || 5000000,
          monthlyDonations: response.stats.monthlyDonations || 500000,
          totalPrograms: response.stats.totalPrograms || 150,
          activePrograms: response.stats.activePrograms || 120,
          activeVolunteers: response.stats.activeVolunteers || 100,
          systemHealth: response.stats.systemHealth || 'good',
          platformUsage: response.stats.platformUsage || 85,
        });
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to load dashboard data. Please try again.');
        // Use fallback data when API fails
        setStats({
          totalGrants: 24,
          totalVolunteers: 128,
          totalBeneficiaries: 1245,
          pendingApprovals: 8,
          programCompletion: 75,
          fundingProgress: 68,
          totalNGOs: 50,
          activeNGOs: 45,
          totalUsers: 2500,
          totalDonations: 5000000,
          monthlyDonations: 500000,
          totalPrograms: 150,
          activePrograms: 120,
          activeVolunteers: 100,
          systemHealth: 'good',
          platformUsage: 85,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  if (error) {
    return (
      <div className="p-6 rounded-lg border border-error-200 bg-error-50">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-error-700">Error Loading Dashboard</h3>
        </div>
        <p className="text-error-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">NGO Admin Dashboard</h2>
        <div className="flex gap-4">
          <Button variant="primary" size="sm">
            <FileText className="w-4 h-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        <StatCard
          title="Total Grants"
          value={stats.totalGrants}
          icon={DollarSign}
          iconColor="text-success-500"
          subtitle="Funding Opportunities"
          loading={loading}
        />
        <StatCard
          title="Total Volunteers"
          value={stats.totalVolunteers}
          icon={Users}
          iconColor="text-primary-500"
          change="+12 since last month"
          changeType="positive"
          loading={loading}
        />
        <StatCard
          title="Beneficiaries"
          value={stats.totalBeneficiaries}
          icon={UserCheck}
          iconColor="text-accent-500"
          change="+85 since last month"
          changeType="positive"
          loading={loading}
        />
      </div>

      {/* Dashboard Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          className={`py-2 px-4 ${
            activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-500'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'programs' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-500'
          }`}
          onClick={() => setActiveTab('programs')}
        >
          Programs
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'grants' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-500'
          }`}
          onClick={() => setActiveTab('grants')}
        >
          Grants
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'impact' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-500'
          }`}
          onClick={() => setActiveTab('impact')}
        >
          Impact Map
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <DashboardErrorBoundary componentName="GrantAnalyticsChart">
              <Card>
                <CardHeader>
                  <CardTitle>Grant Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <GrantAnalyticsChart />
                  </div>
                </CardContent>
              </Card>
            </DashboardErrorBoundary>
          )}
          
          {activeTab === 'programs' && (
            <DashboardErrorBoundary componentName="ProgramManagementTable">
              <ProgramManagementTable />
            </DashboardErrorBoundary>
          )}
          
          {activeTab === 'impact' && (
            <DashboardErrorBoundary componentName="ServiceHeatmap">
              <ServiceHeatmap />
            </DashboardErrorBoundary>
          )}
            {activeTab === 'grants' && (
            <DashboardErrorBoundary componentName="GrantFundingProgress">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Grant Funding Progress</CardTitle>
                    <Button variant="outline" size="sm">View All Grants</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Community Development Grant</span>
                        <span className="text-sm font-medium text-primary-600">65%</span>
                      </div>
                      <ProgressBar value={65} max={100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Healthcare Initiative</span>
                        <span className="text-sm font-medium text-primary-600">89%</span>
                      </div>
                      <ProgressBar value={89} max={100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Rural Education Program</span>
                        <span className="text-sm font-medium text-primary-600">42%</span>
                      </div>
                      <ProgressBar value={42} max={100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DashboardErrorBoundary>
          )}
        </div>        {/* Right Column */}
        <div className="space-y-6">
          <DashboardErrorBoundary componentName="OverallProgress">
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Program Completion</span>
                      <span className="text-sm font-medium">{stats.programCompletion}%</span>
                    </div>
                    <ProgressBar value={stats.programCompletion} max={100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Funding Progress</span>
                      <span className="text-sm font-medium">{stats.fundingProgress}%</span>
                    </div>
                    <ProgressBar value={stats.fundingProgress} max={100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Volunteer Recruitment</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <ProgressBar value={82} max={100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Beneficiary Reach</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <ProgressBar value={78} max={100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </DashboardErrorBoundary>

          <DashboardErrorBoundary componentName="ReferralTrackingList">
            <Card>
              <CardHeader>
                <CardTitle>Referral Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ReferralTrackingList />
              </CardContent>
            </Card>
          </DashboardErrorBoundary>          <DashboardErrorBoundary componentName="PendingApprovals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Volunteer Application</div>
                      <div className="text-xs text-slate-500">From: Rahul Sharma</div>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      aria-label="Review volunteer application from Rahul Sharma"
                    >Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Program Proposal</div>
                      <div className="text-xs text-slate-500">By: Priya Patel</div>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      aria-label="Review program proposal by Priya Patel"
                    >Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Grant Request</div>
                      <div className="text-xs text-slate-500">Amount: ₹50,000</div>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      aria-label="Review grant request for ₹50,000"
                    >Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DashboardErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
