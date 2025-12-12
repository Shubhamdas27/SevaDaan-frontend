import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
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
  LucideIcon,
  Download,
  Search,
  Bell,
  RefreshCw
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

const EnhancedRoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get KPIs based on user role
  const getKPIsForRole = (role: string): KPI[] => {
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
        return [
          { title: 'Total Items', value: '1,234', change: '12.5', trend: 'up', icon: Users },
          { title: 'Active Today', value: '89', change: '5.2', trend: 'up', icon: Activity },
          { title: 'Growth Rate', value: '23.8%', change: '2.1', trend: 'up', icon: TrendingUp },
          { title: 'Engagement', value: '94.2%', change: '1.8', trend: 'neutral', icon: Heart }
        ];
    }
  };

  // Generate mock notifications based on role
  const generateMockNotifications = (role: string): NotificationItem[] => {
    const baseNotifications: NotificationItem[] = [
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
      baseNotifications.push({
        id: '3',
        title: 'User Verification',
        message: '5 users pending verification',
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    return baseNotifications;
  };

  // Generate mock activity based on role
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

  // Generate mock dashboard data
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

  // Enhanced data fetching
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
          ...result,
          notifications: generateMockNotifications(user?.role || ''),
          recentActivity: generateMockActivity()
        });
      } else {
        setDashboardData(generateMockDashboardData(user?.role || ''));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(generateMockDashboardData(user?.role || ''));
    } finally {
      setLoading(false);
    }
  };

  // Export dashboard data
  const exportData = () => {
    if (!dashboardData) return;
    
    const dataToExport = {
      role: user?.role,
      exportDate: new Date().toISOString(),
      kpis: dashboardData.kpis,
      notifications: dashboardData.notifications,
      recentActivity: dashboardData.recentActivity
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${user?.role}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData || !user) {
    return (
      <div className="text-center text-red-600">
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getRoleDisplayName(user.role)} Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {dashboardData.notifications.filter(n => !n.read).length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                {dashboardData.notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>

          {/* Export */}
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Advanced Analytics */}
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>

          {/* Refresh */}
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'error' ? 'bg-red-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    notification.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <Bell className={`h-4 w-4 ${
                      notification.type === 'error' ? 'text-red-600' :
                      notification.type === 'warning' ? 'text-yellow-600' :
                      notification.type === 'success' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' :
                      kpi.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
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

      {/* Main Content Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {getTabsForRole(user.role).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewSection user={user} data={dashboardData} />}
        {activeTab === 'analytics' && <AnalyticsSection />}
        {activeTab === 'management' && <ManagementSection user={user} />}
        {activeTab === 'profile' && <ProfileSection user={user} />}
      </div>
    </div>
  );
};

// Helper components
const OverviewSection: React.FC<{ user: any; data: DashboardData }> = ({ user, data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {getQuickActionsForRole(user.role).map((action: any, index: number) => (
            <Button key={index} variant="outline" className="flex items-center space-x-2">
              {React.createElement(action.icon, { className: "h-4 w-4" })}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                {React.createElement(activity.icon, { className: "h-4 w-4 text-gray-600" })}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const AnalyticsSection: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Advanced analytics and reporting features will be displayed here.</p>
      </CardContent>
    </Card>
  </div>
);

const ManagementSection: React.FC<{ user: any }> = ({ user }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Management Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Role-specific management tools for {getRoleDisplayName(user.role)} will be displayed here.</p>
      </CardContent>
    </Card>
  </div>
);

const ProfileSection: React.FC<{ user: any }> = ({ user }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Profile management and settings for {user.name} will be displayed here.</p>
      </CardContent>
    </Card>
  </div>
);

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
      { id: 'profile', label: 'Profile' }
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

export default EnhancedRoleBasedDashboard;
