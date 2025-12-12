import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, DollarSign, Download, Calendar } from 'lucide-react';

const ReportsAnalytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last30');

  // Demo data for charts
  const volunteerActivityData = [
    { month: 'Jan', hours: 234, volunteers: 12 },
    { month: 'Feb', hours: 345, volunteers: 15 },
    { month: 'Mar', hours: 456, volunteers: 18 },
    { month: 'Apr', hours: 567, volunteers: 22 },
    { month: 'May', hours: 678, volunteers: 25 },
    { month: 'Jun', hours: 789, volunteers: 28 },
    { month: 'Jul', hours: 892, volunteers: 30 },
    { month: 'Aug', hours: 945, volunteers: 32 },
    { month: 'Sep', hours: 867, volunteers: 29 },
    { month: 'Oct', hours: 756, volunteers: 27 },
    { month: 'Nov', hours: 634, volunteers: 24 }
  ];

  const programImpactData = [
    { program: 'Education Support', beneficiaries: 156, completion: 89 },
    { program: 'Health Awareness', beneficiaries: 234, completion: 92 },
    { program: 'Digital Literacy', beneficiaries: 98, completion: 76 },
    { program: 'Women Empowerment', beneficiaries: 145, completion: 88 },
    { program: 'Youth Development', beneficiaries: 87, completion: 82 }
  ];

  const donationData = [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 18000 },
    { month: 'Mar', amount: 22000 },
    { month: 'Apr', amount: 19000 },
    { month: 'May', amount: 25000 },
    { month: 'Jun', amount: 28000 },
    { month: 'Jul', amount: 32000 },
    { month: 'Aug', amount: 29000 },
    { month: 'Sep', amount: 35000 },
    { month: 'Oct', amount: 31000 },
    { month: 'Nov', amount: 27000 }
  ];

  const skillDistributionData = [
    { name: 'Teaching', value: 35, color: '#3B82F6' },
    { name: 'Healthcare', value: 25, color: '#10B981' },
    { name: 'Technology', value: 20, color: '#F59E0B' },
    { name: 'Event Management', value: 12, color: '#EF4444' },
    { name: 'Others', value: 8, color: '#8B5CF6' }
  ];

  // Summary metrics
  const summaryMetrics = {
    totalVolunteers: 45,
    totalHours: 8567,
    totalDonations: 285000,
    activeProgrammes: 12,
    beneficiariesServed: 1456,
    averageRating: 4.7,
    completionRate: 87,
    retentionRate: 92
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Demo functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  useEffect(() => {
    // Component initialization - placeholder for future functionality
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Track your NGO's impact and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <select
              aria-label="Select time range"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="lastyear">Last year</option>
            </select>
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.totalVolunteers}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours Logged</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.totalHours.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">₹{summaryMetrics.totalDonations.toLocaleString()}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beneficiaries Served</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.beneficiariesServed.toLocaleString()}</p>
              <p className="text-sm text-green-600">+22% from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Volunteer Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Volunteer Activity Trends</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Last updated: Nov 16, 2024
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volunteerActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} name="Hours" />
              <Line type="monotone" dataKey="volunteers" stroke="#10B981" strokeWidth={2} name="Volunteers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donation Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Donation Trends</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Last updated: Nov 16, 2024
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              <Bar dataKey="amount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Program Impact Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Program Impact Analysis</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Last updated: Nov 16, 2024
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programImpactData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="program" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="beneficiaries" fill="#F59E0B" name="Beneficiaries" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Volunteer Skills Distribution</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Last updated: Nov 16, 2024
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summaryMetrics.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-xs text-green-600">+0.2 from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summaryMetrics.completionRate}%</div>
            <div className="text-sm text-gray-600">Program Completion</div>
            <div className="text-xs text-green-600">+3% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{summaryMetrics.retentionRate}%</div>
            <div className="text-sm text-gray-600">Volunteer Retention</div>
            <div className="text-xs text-green-600">+5% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{summaryMetrics.activeProgrammes}</div>
            <div className="text-sm text-gray-600">Active Programs</div>
            <div className="text-xs text-green-600">+2 from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
