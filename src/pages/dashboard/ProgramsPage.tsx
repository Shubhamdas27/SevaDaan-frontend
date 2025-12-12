import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Icons } from '../../components/icons';
import useLiveUpdates from '../../hooks/useLiveUpdates';
import liveUpdateService from '../../services/liveUpdateService';
import api from '../../lib/api';

interface Program {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  location: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  budget: number;
  createdAt: string;
  updatedAt: string;
}

const ProgramsPage: React.FC = () => {
  console.log('ProgramsPage component rendered');
  
  const { connectionStatus } = useLiveUpdates();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPrograms = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    
    try {
      const response = await api.get('/programs/ngo');
      
      if (response.data.success) {
        setPrograms(response.data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      // Fallback to mock data
      setPrograms([
        {
          _id: '1',
          title: 'Education Support Program',
          description: 'Providing educational resources to underprivileged children',
          status: 'active',
          startDate: '2024-01-15',
          endDate: '2024-06-15',
          location: 'Delhi',
          volunteersNeeded: 10,
          volunteersRegistered: 7,
          budget: 50000,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Healthcare Initiative',
          description: 'Mobile health clinics for rural areas',
          status: 'upcoming',
          startDate: '2024-02-01',
          endDate: '2024-08-01',
          location: 'Mumbai',
          volunteersNeeded: 15,
          volunteersRegistered: 3,
          budget: 100000,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-20'
        }
      ]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Set up real-time event listeners
  useEffect(() => {
    const handleProgramUpdate = (data: any) => {
      console.log('Program update received:', data);
      
      if (data.activity === 'program_created') {
        setPrograms(prev => [data.program, ...prev]);
      } else if (data.activity === 'program_updated') {
        setPrograms(prev => prev.map(p => 
          p._id === data.program._id ? { ...p, ...data.program } : p
        ));
      } else if (data.activity === 'program_deleted') {
        setPrograms(prev => prev.filter(p => p._id !== data.programId));
      } else {
        // Fallback: refresh all data
        fetchPrograms(true);
      }
      
      setLastUpdated(new Date());
    };

    const handleNGODataUpdate = (data: any) => {
      if (data.type === 'programs') {
        fetchPrograms(true);
      }
    };

    liveUpdateService.on('program_update', handleProgramUpdate);
    liveUpdateService.on('ngo_data_update', handleNGODataUpdate);

    return () => {
      liveUpdateService.off('program_update', handleProgramUpdate);
      liveUpdateService.off('ngo_data_update', handleNGODataUpdate);
    };
  }, []); // Empty dependency array to prevent re-subscribing

  const handleRefresh = () => {
    fetchPrograms();
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Programs Management</h1>
            <p className="text-green-100 mt-2">Manage your NGO's programs and track their progress.</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isRefreshing ? <Icons.activity className="h-4 w-4 animate-spin mr-2" /> : <Icons.refresh className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <div className="flex items-center space-x-2 text-xs text-green-200">
              <div className={`w-2 h-2 rounded-full ${connectionStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{connectionStatus.isConnected ? 'Live' : 'Offline'}</span>
            </div>
            <p className="text-xs text-green-200">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          aria-label="Filter programs by status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{program.title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(program.status)}`}>
                  {program.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Icons.mapPin className="h-4 w-4 mr-2" />
                  {program.location}
                </div>
                <div className="flex items-center">
                  <Icons.calendar className="h-4 w-4 mr-2" />
                  {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Icons.users className="h-4 w-4 mr-2" />
                  {program.volunteersRegistered}/{program.volunteersNeeded} volunteers
                </div>
                <div className="flex items-center">
                  <Icons.dollarSign className="h-4 w-4 mr-2" />
                  Budget: ₹{program.budget?.toLocaleString()}
                </div>
              </div>

              {/* Progress Bar for volunteer recruitment */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Volunteer Progress</span>
                  <span>{Math.round((program.volunteersRegistered / program.volunteersNeeded) * 100)}%</span>
                </div>
                <ProgressBar 
                  value={program.volunteersRegistered} 
                  max={program.volunteersNeeded} 
                  color="green"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icons.edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icons.eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <Icons.search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Create your first program to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
