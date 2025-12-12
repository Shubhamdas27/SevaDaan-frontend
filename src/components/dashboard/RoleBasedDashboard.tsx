import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Heart, 
  MapPin,
  Clock,
  DollarSign,
  Target,
  Award,
  Calculator,
  LucideIcon
} from 'lucide-react';

// Enhanced interfaces
interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  clickable?: boolean;
}

interface DashboardData {
  kpis: KPI[];
  analytics: any;
  notifications: NotificationItem[];
  recentActivity: ActivityItem[];
  userRole: string;
  timestamp: string;
  [key: string]: any;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  icon: LucideIcon;
}

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced data fetching with better error handling
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/role-specific', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDashboardData({
          ...result,        notifications: generateMockNotifications(user?.role || ''),
        recentActivity: generateMockActivity()
        });
      } else {
        // Fallback to mock data
        setDashboardData(generateMockDashboardData(user?.role || ''));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(generateMockDashboardData(user?.role || ''));
    } finally {
      setLoading(false);
    }
  };

  // Generate KPIs for role
  const getKPIsForRole = (role: string): KPI[] => {
    const baseKPIs: KPI[] = [
      { title: 'Total Users', value: '1,234', change: '12.5', trend: 'up', icon: Users },
      { title: 'Active Today', value: '89', change: '5.2', trend: 'up', icon: Activity },
      { title: 'Donations', value: '$45,678', change: '8.3', trend: 'up', icon: DollarSign },
      { title: 'Volunteers', value: '567', change: '15.2', trend: 'up', icon: Heart }
    ];

    switch (role) {
      case 'ngo_admin':
      case 'ngo':
        return [
          { title: 'Total Programs', value: '25', change: '5.2', trend: 'up', icon: Target },
          { title: 'Active Volunteers', value: '156', change: '12.3', trend: 'up', icon: Users },
          { title: 'Monthly Donations', value: '$12,450', change: '8.7', trend: 'up', icon: DollarSign },
          { title: 'Impact Score', value: '92%', change: '3.1', trend: 'up', icon: TrendingUp }
        ];
      case 'volunteer':
        return [
          { title: 'Hours Logged', value: '124', change: '15.2', trend: 'up', icon: Clock },
          { title: 'Programs Joined', value: '8', change: '2.1', trend: 'up', icon: Target },
          { title: 'Impact Points', value: '450', change: '10.5', trend: 'up', icon: Award },
          { title: 'Certificates', value: '3', change: '1.0', trend: 'up', icon: Award }
        ];
      case 'donor':
        return [
          { title: 'Total Donated', value: '$2,340', change: '22.1', trend: 'up', icon: DollarSign },
          { title: 'NGOs Supported', value: '5', change: '1.0', trend: 'up', icon: Heart },
          { title: 'Impact Created', value: '89%', change: '5.2', trend: 'up', icon: TrendingUp },
          { title: 'Tax Savings', value: '$780', change: '22.1', trend: 'up', icon: Calculator }
        ];
      default:
        return baseKPIs;
    }
  };

  // Generate mock data based on role
  const generateMockDashboardData = (role: string): DashboardData => {
    return {
      userRole: role,
      timestamp: new Date().toISOString(),
      kpis: getKPIsForRole(role),
      analytics: {},
      notifications: generateMockNotifications(role),
      recentActivity: generateMockActivity()
    };
  };

  // Generate mock notifications
  const generateMockNotifications = (role: string): NotificationItem[] => {
    const notifications: NotificationItem[] = [
      {
        id: '1',
        title: 'System Update',
        message: 'Dashboard has been updated with new features',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Welcome!',
        message: `Welcome to your ${getRoleDisplayName(role)} dashboard`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];

    // Role-specific notifications
    if (role === 'ngo_admin') {
      notifications.push({
        id: '3',
        title: 'User Verification',
        message: '5 users pending verification',
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    return notifications;
  };

  // Generate mock activity
  const generateMockActivity = (): ActivityItem[] => {
    return [
      {
        id: '1',
        title: 'Dashboard Accessed',
        description: 'Successfully logged into dashboard',
        timestamp: new Date().toISOString(),
        type: 'system',
        icon: Activity
      },
      {
        id: '2',
        title: 'Profile Updated',
        description: 'User profile information updated',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'user',
        icon: Users
      }
    ];
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up interval for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData || !user) {
    return (
      <div className="text-center text-gray-600">
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getRoleDisplayName(user.role)} Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.name}! Here's your overview.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {getTabsForRole(user.role).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <OverviewSection user={user} data={dashboardData.data} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsSection user={user} data={dashboardData.data} />
          )}
          {activeTab === 'management' && (
            <ManagementSection user={user} data={dashboardData.data} />
          )}
          {activeTab === 'profile' && (
            <ProfileSection user={user} data={dashboardData.data} />
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection: React.FC<{ user: any; data: any }> = ({ user, data }) => {
  const getKPIsForRole = (role: string): KPI[] => {
    const baseKPIs: KPI[] = [
      {
        title: 'Total Users',
        value: '1,234',
        change: '12.5',
        trend: 'up',
        icon: Users
      },
      {
        title: 'Active Today',
        value: '89',
        change: '5.2',
        trend: 'up',
        icon: Activity
      },
      {
        title: 'Growth Rate',
        value: '23.8%',
        change: '2.1',
        trend: 'up',
        icon: TrendingUp
      },
      {
        title: 'Engagement',
        value: '94.2%',
        change: '1.8',
        trend: 'neutral',
        icon: Heart
      }
    ];

    // Customize KPIs based on role
    switch (role) {
      case 'ngo_admin':
        return [
          { title: 'Total NGOs', value: '45', change: '8.3', trend: 'up', icon: Target },
          { title: 'Active Users', value: '1,256', change: '12.1', trend: 'up', icon: Users },
          { title: 'Total Donations', value: '₹2.4M', change: '15.7', trend: 'up', icon: DollarSign },
          { title: 'Success Rate', value: '96.8%', change: '2.3', trend: 'up', icon: Award }
        ];
      case 'ngo_manager':
        return [
          { title: 'Team Members', value: '23', change: '4.2', trend: 'up', icon: Users },
          { title: 'Active Projects', value: '8', change: '1.0', trend: 'neutral', icon: Target },
          { title: 'Volunteers', value: '156', change: '9.8', trend: 'up', icon: Heart },
          { title: 'Completion Rate', value: '89.3%', change: '3.1', trend: 'up', icon: Award }
        ];
      case 'volunteer':
        return [
          { title: 'Hours Logged', value: '142', change: '8.9', trend: 'up', icon: Clock },
          { title: 'Projects Joined', value: '7', change: '2.0', trend: 'up', icon: Target },
          { title: 'Impact Score', value: '94.2', change: '5.1', trend: 'up', icon: Award },
          { title: 'Activities', value: '23', change: '1.5', trend: 'neutral', icon: Activity }
        ];
      case 'donor':
        return [
          { title: 'Total Donated', value: '₹45,600', change: '12.4', trend: 'up', icon: DollarSign },
          { title: 'NGOs Supported', value: '6', change: '1.0', trend: 'up', icon: Heart },
          { title: 'Lives Impacted', value: '234', change: '18.7', trend: 'up', icon: Users },
          { title: 'Success Rate', value: '97.3%', change: '2.1', trend: 'up', icon: Award }
        ];
      case 'citizen':
        return [
          { title: 'Applications', value: '3', change: '1.0', trend: 'up', icon: Target },
          { title: 'Approved', value: '2', change: '1.0', trend: 'up', icon: Award },
          { title: 'In Progress', value: '1', change: '0.0', trend: 'neutral', icon: Clock },
          { title: 'Services Found', value: '12', change: '3.2', trend: 'up', icon: MapPin }
        ];
      default:
        return baseKPIs;
    }
  };

  const kpis = getKPIsForRole(user?.role || 'citizen');

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}{Math.abs(parseFloat(kpi.change))}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  {React.createElement(kpi.icon as any, { className: "h-6 w-6 text-blue-600" })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getQuickActionsForRole(user.role).map((action: any, index: number) => (
              <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <action.icon className="h-5 w-5" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentActivityForRole().map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <activity.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant={activity.status === 'success' ? 'success' : 'warning'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.notifications?.map((notification: any) => (
              <div key={notification.id} className={`flex items-center p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="p-2 rounded-full bg-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 ml-3">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Badge variant="primary" className="h-2.5 w-2.5 bg-blue-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Analytics Section Component
const AnalyticsSection: React.FC<{ user: any; data: any }> = () => {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
    { name: 'Jun', value: 900 }
  ];

  const pieData = [
    { name: 'Education', value: 400, color: '#0088FE' },
    { name: 'Health', value: 300, color: '#00C49F' },
    { name: 'Environment', value: 200, color: '#FFBB28' },
    { name: 'Others', value: 100, color: '#FF8042' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Management Section Component
const ManagementSection: React.FC<{ user: any; data: any }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Management tools and controls for {user.role} role will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Profile Section Component
const ProfileSection: React.FC<{ user: any; data: any }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profile management and settings for {user.name} will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Functions
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    'ngo_admin': 'NGO Administrator',
    'ngo_manager': 'NGO Manager',
    'ngo': 'NGO',
    'citizen': 'Citizen',
    'volunteer': 'Volunteer',
    'donor': 'Donor'
  };
  return roleNames[role] || 'User';
}

function getTabsForRole(role: string) {
  const commonTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' }
  ];

  if (['ngo_admin', 'ngo_manager', 'ngo'].includes(role)) {
    return [
      ...commonTabs,
      { id: 'management', label: 'Management' },
      { id: 'profile', label: 'Settings' }
    ];
  }

  return [
    ...commonTabs,
    { id: 'profile', label: 'Profile' }
  ];
}

function getQuickActionsForRole(role: string) {
  const actions: Record<string, Array<{ label: string; icon: LucideIcon }>> = {
    ngo_admin: [
      { label: 'Manage Users', icon: Users },
      { label: 'View Analytics', icon: TrendingUp },
      { label: 'System Settings', icon: Activity },
      { label: 'Generate Reports', icon: Target }
    ],
    volunteer: [
      { label: 'Log Hours', icon: Clock },
      { label: 'Find Opportunities', icon: Activity },
      { label: 'View Impact', icon: Heart },
      { label: 'Get Certified', icon: Award }
    ],
    donor: [
      { label: 'Make Donation', icon: DollarSign },
      { label: 'View Impact', icon: Heart },
      { label: 'Download Receipt', icon: Target },
      { label: 'Find NGOs', icon: MapPin }
    ],
    citizen: [
      { label: 'Apply for Service', icon: Activity },
      { label: 'Check Status', icon: Clock },
      { label: 'Community Forum', icon: Users },
      { label: 'Get Support', icon: Heart }
    ]
  };

  return actions[role] || actions.citizen;
}

function getRecentActivityForRole() {
  const activities = [
    { title: 'Dashboard updated', time: '2 minutes ago', status: 'success', icon: Activity },
    { title: 'New notification received', time: '1 hour ago', status: 'info', icon: Users },
    { title: 'Profile updated', time: '3 hours ago', status: 'success', icon: Heart },
    { title: 'Data synchronized', time: '1 day ago', status: 'success', icon: TrendingUp }
  ];

  return activities;
}

export default RoleBasedDashboard;
