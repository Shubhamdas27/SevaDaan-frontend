import React from 'react';
import { TrendingUp, Users, FileText, Calendar, Activity } from 'lucide-react';
import { useRealtimeDashboard } from '../hooks/useRealtimeDashboard';

interface RealtimeDashboardProps {
  userRole: string;
  ngoId?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading }) => {
  const getBorderClass = (color: string) => {
    switch (color) {
      case '#10B981': return 'border-l-green-500';
      case '#3B82F6': return 'border-l-blue-500';
      case '#8B5CF6': return 'border-l-purple-500';
      case '#F59E0B': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  const getBackgroundClass = (color: string) => {
    switch (color) {
      case '#10B981': return 'bg-green-100';
      case '#3B82F6': return 'bg-blue-100';
      case '#8B5CF6': return 'bg-purple-100';
      case '#F59E0B': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderClass(color)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-full ${getBackgroundClass(color)}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecentActivityProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type?: string;
  }>;
  isLoading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, items, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500 truncate">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({ userRole, ngoId }) => {
  const { stats, isLoading } = useRealtimeDashboard(userRole, ngoId);

  // Transform recent data for display
  const recentDonations = stats.recentDonations.map(donation => ({
    id: donation.donationId,
    title: `New donation: $${donation.amount}`,
    description: `From ${donation.donorName}`,
    timestamp: donation.timestamp
  }));

  const recentVolunteers = stats.recentVolunteers.map(volunteer => ({
    id: volunteer.volunteerId,
    title: `Volunteer activity: ${volunteer.activity}`,
    description: `${volunteer.volunteerName} - ${volunteer.status}`,
    timestamp: volunteer.timestamp
  }));

  const recentApplications = stats.recentApplications.map(application => ({
    id: application.applicationId,
    title: `Application ${application.status}`,
    description: `${application.serviceType} by ${application.applicantName}`,
    timestamp: application.timestamp
  }));

  const recentPrograms = stats.recentPrograms.map(program => ({
    id: program.programId,
    title: `New program: ${program.programName}`,
    description: `${program.type} program in ${program.location}`,
    timestamp: program.timestamp
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="#10B981"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Volunteers"
          value={stats.totalVolunteers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="#3B82F6"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          color="#8B5CF6"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Programs"
          value={stats.totalPrograms}
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          color="#F59E0B"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Donations"
          items={recentDonations}
          isLoading={isLoading}
        />
        <RecentActivity
          title="Recent Volunteer Activity"
          items={recentVolunteers}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Applications"
          items={recentApplications}
          isLoading={isLoading}
        />
        <RecentActivity
          title="Recent Programs"
          items={recentPrograms}
          isLoading={isLoading}
        />
      </div>

      {/* Real-time Status Indicator */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time updates active</span>
        </div>
      </div>
    </div>
  );
};
