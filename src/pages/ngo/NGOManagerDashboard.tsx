import React, { useState, useEffect } from 'react';
import apiService from '../../lib/apiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

// Types for the dashboard data structure from backend
interface NGOManagerDashboardData {
  ngo: {
    id: string;
    name: string;
    logo?: string;
  };
  statistics: {
    programs: {
      totalPrograms: number;
      activePrograms: number;
      completedPrograms: number;
      totalBudget: number;
      totalVolunteersNeeded: number;
      totalVolunteersRegistered: number;
    };
    volunteers: {
      totalApplications: number;
      approvedVolunteers: number;
      pendingApplications: number;
      activeVolunteers: number;
    };
  };
  recentActivities: {
    volunteers: any[];
    programs: any[];
  };
}

const NGOManagerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<NGOManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNGOManagerDashboard();
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No data available</h3>
      </div>
    );
  }

  const { ngo, statistics, recentActivities } = dashboardData;

  // Prepare chart data
  const programData = [
    { name: 'Total', value: statistics.programs.totalPrograms },
    { name: 'Active', value: statistics.programs.activePrograms },
    { name: 'Completed', value: statistics.programs.completedPrograms }
  ];

  const volunteerData = [
    { name: 'Total Applications', value: statistics.volunteers.totalApplications },
    { name: 'Approved', value: statistics.volunteers.approvedVolunteers },
    { name: 'Pending', value: statistics.volunteers.pendingApplications },
    { name: 'Active', value: statistics.volunteers.activeVolunteers }
  ];

  return (
    <div className="space-y-6">
      {/* NGO Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {ngo.logo && (
              <img src={ngo.logo} alt={ngo.name} className="w-16 h-16 rounded-full object-cover" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ngo.name}</h2>
              <p className="text-gray-600">Manager Dashboard</p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Programs</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-blue-600">{statistics.programs.totalPrograms}</p>
            <span className="ml-2 text-sm text-green-600">
              {statistics.programs.activePrograms} active
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Volunteer Applications</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-green-600">{statistics.volunteers.totalApplications}</p>
            <span className="ml-2 text-sm text-yellow-600">
              {statistics.volunteers.pendingApplications} pending
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Approved Volunteers</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-purple-600">{statistics.volunteers.approvedVolunteers}</p>
            <span className="ml-2 text-sm text-blue-600">
              {statistics.volunteers.activeVolunteers} active
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Budget</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-orange-600">₹{statistics.programs.totalBudget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volunteer Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Management</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volunteerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/programs/create"
            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Create Program
          </Link>
          <Link
            to="/dashboard/volunteers"
            className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors text-center"
          >
            Manage Volunteers
          </Link>
          <Link
            to="/dashboard/programs"
            className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors text-center"
          >
            View Programs
          </Link>
          <Link
            to="/dashboard/reports"
            className="bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 transition-colors text-center"
          >
            Generate Reports
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Volunteers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Volunteer Applications</h3>
            <Link to="/dashboard/volunteers" className="text-blue-600 hover:text-blue-800 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.volunteers.slice(0, 5).map((volunteer: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{volunteer.user?.name}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(volunteer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  volunteer.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : volunteer.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {volunteer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Programs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Programs</h3>
            <Link to="/dashboard/programs" className="text-blue-600 hover:text-blue-800 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.programs.slice(0, 5).map((program: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <p className="font-medium text-sm">{program.title}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {program.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                    program.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : program.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(program.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOManagerDashboard;
