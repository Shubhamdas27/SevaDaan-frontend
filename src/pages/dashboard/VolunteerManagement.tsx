import React, { useState, useEffect } from 'react';
import apiService from '../../lib/apiService';
import { Users, UserPlus, Clock, Star, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import AddVolunteerModal from '../../components/modals/AddVolunteerModal';
import useLiveUpdates from '../../hooks/useLiveUpdates';
import liveUpdateService from '../../services/liveUpdateService';

interface Volunteer {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  programId: {
    _id: string;
    title: string;
  };
  skills: string[];
  status: 'pending' | 'approved' | 'active' | 'inactive' | 'removed';
  hoursLogged?: number;
  rating?: number;
  createdAt: string;
  reviewedAt?: string;
}

const VolunteerManagement: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  useLiveUpdates(); // Use the live updates hook

  // Fetch volunteers from API
  const fetchVolunteers = React.useCallback(async () => {
    try {
      const response = await apiService.getNGOVolunteers();
      setVolunteers(response);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      toast.error('Failed to load volunteers');
    }
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // Set up real-time event listeners
  useEffect(() => {
    const handleVolunteerUpdate = (data: any) => {
      console.log('Volunteer update received:', data);
      fetchVolunteers();
      
      if (data.activity === 'application_submitted') {
        toast.info(`New volunteer application from ${data.volunteerName}`);
      } else if (data.activity === 'status_changed') {
        toast.info(`Volunteer ${data.volunteerName} status updated to ${data.status}`);
      }
    };

    const handleNGODataUpdate = (data: any) => {
      if (data.type === 'volunteers') {
        fetchVolunteers();
      }
    };

    liveUpdateService.on('volunteer_update', handleVolunteerUpdate);
    liveUpdateService.on('ngo_data_update', handleNGODataUpdate);

    return () => {
      liveUpdateService.off('volunteer_update', handleVolunteerUpdate);
      liveUpdateService.off('ngo_data_update', handleNGODataUpdate);
    };
  }, []); // Empty dependency array to prevent re-subscribing

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchVolunteers();
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchVolunteers]);

  const handleStatusUpdate = async (volunteerId: string, newStatus: string) => {
    try {
      await apiService.updateVolunteerStatus(volunteerId, { status: newStatus });
      toast.success('Volunteer status updated successfully');
      fetchVolunteers();
    } catch (err) {
      console.error('Error updating volunteer status:', err);
      toast.error('Failed to update volunteer status');
    }
  };

  const handleDeleteVolunteer = async (volunteerId: string) => {
    if (!window.confirm('Are you sure you want to remove this volunteer?')) {
      return;
    }

    try {
      await apiService.deleteVolunteer(volunteerId);
      toast.success('Volunteer removed successfully');
      fetchVolunteers();
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      toast.error('Failed to remove volunteer');
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    
    const matchesSkill = skillFilter === 'all' || volunteer.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );
    
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'removed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleApproveVolunteer = (volunteerId: string) => {
    handleStatusUpdate(volunteerId, 'approved');
  };

  const handleRejectVolunteer = (volunteerId: string) => {
    handleDeleteVolunteer(volunteerId);
  };

  const totalHours = volunteers.reduce((sum, v) => sum + (v.hoursLogged || 0), 0);
  const activeVolunteers = volunteers.filter(v => v.status === 'active' || v.status === 'approved').length;
  const pendingApplications = volunteers.filter(v => v.status === 'pending').length;
  const averageRating = volunteers.filter(v => (v.rating || 0) > 0).reduce((sum, v, _, arr) => sum + (v.rating || 0) / arr.length, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Management</h1>
          <p className="text-gray-600">Manage your volunteer community and track their contributions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{activeVolunteers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours Logged</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search volunteers by name, email, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
            <select
            aria-label="Filter by status"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>          <select
            aria-label="Filter by skill"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="all">All Skills</option>
            <option value="teaching">Teaching</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology</option>
            <option value="counseling">Counseling</option>
            <option value="event">Event Management</option>
          </select>          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Add Volunteer
          </button>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={volunteer.userId.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(volunteer.userId.name)}&background=random`}
                        alt={volunteer.userId.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{volunteer.userId.name}</div>
                        <div className="text-sm text-gray-500">Joined {new Date(volunteer.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{volunteer.userId.email}</div>
                    <div className="text-sm text-gray-500">{volunteer.userId.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {volunteer.skills.length > 2 && (
                        <span className="text-xs text-gray-500">+{volunteer.skills.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {volunteer.hoursLogged || 0}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(volunteer.rating || 0) > 0 ? (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{volunteer.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No rating</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {volunteer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveVolunteer(volunteer._id)}
                            className="text-green-600 hover:text-green-900 text-sm px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectVolunteer(volunteer._id)}
                            className="text-red-600 hover:text-red-900 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {volunteer.status !== 'pending' && (
                        <button
                          onClick={() => handleDeleteVolunteer(volunteer._id)}
                          className="text-red-600 hover:text-red-900 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Volunteer Modal */}
      <AddVolunteerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onVolunteerAdded={() => {
          fetchVolunteers();
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default VolunteerManagement;
