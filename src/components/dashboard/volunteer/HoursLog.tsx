import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Plus, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../lib/utils';
import { getApplicationStatusBadge } from '../../../lib/status-utils';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface HoursEntry {
  id: string;
  eventId?: string;
  eventName: string;
  ngoId: string;
  ngoName: string;
  date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  supervisor?: string;
}

interface MonthlyHours {
  month: string;
  hours: number;
}

const HoursLog: React.FC = () => {
  const [entries, setEntries] = useState<HoursEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<HoursEntry[]>([]);
  const [monthlyHours, setMonthlyHours] = useState<MonthlyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [approvedHours, setApprovedHours] = useState(0);

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchHoursLog = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockEntries: HoursEntry[] = [
            {
              id: 'hr-1',
              eventId: 'evt-5',
              eventName: 'Beach Cleanup Drive',
              ngoId: 'ngo-1',
              ngoName: 'Green Earth Foundation',
              date: '2025-05-25',
              hours: 3,
              description: 'Participated in beach cleanup, collected plastic waste and organized recycling.',
              status: 'approved',
              category: 'Environment'
            },
            {
              id: 'hr-2',
              eventId: 'evt-old-1',
              eventName: 'Elderly Care Visit',
              ngoId: 'ngo-4',
              ngoName: 'Care For Elderly',
              date: '2025-05-15',
              hours: 4,
              description: 'Spent time with elderly residents, helped with recreational activities and meal assistance.',
              status: 'approved',
              category: 'Healthcare',
              supervisor: 'Priya Shah'
            },
            {
              id: 'hr-3',
              eventId: 'evt-old-2',
              eventName: 'Food Distribution',
              ngoId: 'ngo-3',
              ngoName: 'Helping Hands',
              date: '2025-05-10',
              hours: 2.5,
              description: 'Helped pack and distribute food packages to homeless individuals.',
              status: 'approved',
              category: 'Hunger Relief',
              supervisor: 'Rahul Sharma'
            },
            {
              id: 'hr-4',
              eventId: 'evt-old-3',
              eventName: 'Tree Plantation',
              ngoId: 'ngo-1',
              ngoName: 'Green Earth Foundation',
              date: '2025-04-22',
              hours: 3,
              description: 'Planted trees in community park for Earth Day event.',
              status: 'approved',
              category: 'Environment'
            },
            {
              id: 'hr-5',
              eventId: 'evt-3',
              eventName: 'Food Distribution Camp',
              ngoId: 'ngo-3',
              ngoName: 'Helping Hands',
              date: '2025-06-10',
              hours: 2,
              description: 'Upcoming volunteer event - distributing food packages to those in need.',
              status: 'pending',
              category: 'Hunger Relief'
            }
          ];

          // Monthly hours data for chart
          const mockMonthlyHours: MonthlyHours[] = [
            { month: 'Jan', hours: 6 },
            { month: 'Feb', hours: 4 },
            { month: 'Mar', hours: 8 },
            { month: 'Apr', hours: 12.5 },
            { month: 'May', hours: 9.5 },
            { month: 'Jun', hours: 2 },
            { month: 'Jul', hours: 0 },
            { month: 'Aug', hours: 0 },
            { month: 'Sep', hours: 0 },
            { month: 'Oct', hours: 0 },
            { month: 'Nov', hours: 0 },
            { month: 'Dec', hours: 0 }
          ];

          // Calculate statistics
          const total = mockEntries.reduce((sum, entry) => sum + entry.hours, 0);
          const approved = mockEntries
            .filter(entry => entry.status === 'approved')
            .reduce((sum, entry) => sum + entry.hours, 0);

          setEntries(mockEntries);
          setFilteredEntries(mockEntries);
          setMonthlyHours(mockMonthlyHours);
          setTotalHours(total);
          setApprovedHours(approved);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching hours log', error);
        setLoading(false);
      }
    };

    fetchHoursLog();
  }, []);

  // Filter entries based on search query and filters
  useEffect(() => {
    let result = [...entries];
    
    // Apply status filter if not 'all'
    if (filterStatus !== 'all') {
      result = result.filter(entry => entry.status === filterStatus);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.eventName.toLowerCase().includes(query) ||
        entry.ngoName.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredEntries(result);  }, [searchQuery, filterStatus, entries]);
  
  const getStatusBadge = (status: string) => {
    return getApplicationStatusBadge(status as 'pending' | 'approved' | 'rejected');
  };

  const handleAddHours = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to add hours
    setIsAddModalOpen(false);
    alert('Hours submission form would be processed here');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase">Total Hours</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{totalHours}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase">Approved Hours</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{approvedHours}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase">Pending Hours</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{totalHours - approvedHours}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hours Trend Chart */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Monthly Volunteer Hours</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> 
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={monthlyHours}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} hours`, 'Hours Logged']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  name="Volunteer Hours" 
                  stroke="#4f46e5" 
                  activeDot={{ r: 8 }} 
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hours Log Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Hours Log</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your volunteer hours
            </p>
          </div>
          <Button 
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Log Hours
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search hours entries..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                className="rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          {/* Extended Filters */}
          {isFilterOpen && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <label htmlFor="date-range-filter" className="sr-only">
                    Date Range
                  </label>
                  <select
                    id="date-range-filter"
                    className="w-full rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Date Range"
                  >
                    <option value="all">All Time</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <label htmlFor="category-filter" className="sr-only">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    className="w-full rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Category"
                  >
                    <option value="all">All Categories</option>
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="hunger">Hunger Relief</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {filteredEntries.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hours logged</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filterStatus !== 'all'
                      ? 'Try changing your search or filter criteria'
                      : 'You haven\'t logged any volunteer hours yet'}
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Log Your First Hours
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Event/Activity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Organization</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Hours</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEntries.map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.eventName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.ngoName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.category}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {entry.hours}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getStatusBadge(entry.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right space-x-2">
                            {entry.status === 'pending' && (
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Hours Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsAddModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddHours}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Log Volunteer Hours</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event/Activity
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter event or activity name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        aria-label="Organization"
                        title="Organization"
                      >
                        <option value="">Select organization</option>
                        <option value="ngo-1">Green Earth Foundation</option>
                        <option value="ngo-3">Helping Hands</option>
                        <option value="ngo-4">Care For Elderly</option>
                        <option value="other">Other (specify)</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date-input">
                          Date
                        </label>
                        <input
                          id="date-input"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                          aria-label="Date"
                          title="Date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hours-input">
                          Hours Spent
                        </label>
                        <input
                          id="hours-input"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="24"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Hours"
                          required
                          aria-label="Hours Spent"
                          title="Hours Spent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category-select">
                        Category
                      </label>
                      <select
                        id="category-select"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        aria-label="Category"
                        title="Category"
                      >
                        <option value="">Select category</option>
                        <option value="Environment">Environment</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Hunger Relief">Hunger Relief</option>
                        <option value="Community Development">Community Development</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description of Activities
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe what you did during your volunteer work"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supervisor's Name (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Name of person who supervised your work"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit Hours
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursLog;
