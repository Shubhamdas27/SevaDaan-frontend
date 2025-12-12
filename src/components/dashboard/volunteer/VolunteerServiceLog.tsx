import React, { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, MapPin, Save, Filter } from 'lucide-react';
import apiService from '../../../lib/apiService';
import { VolunteerActivity, Program } from '../../../types';
import { useToast } from '../../ui/Toast';

const VolunteerServiceLog: React.FC = () => {
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    programId: '',
    activityType: '',
    hoursLogged: '',
    description: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [activitiesResponse, programsResponse] = await Promise.all([
        apiService.getVolunteerActivities(),
        apiService.getPrograms()
      ]);
      setActivities(activitiesResponse.data.activities || []);
      setPrograms(programsResponse.data.filter((p: Program) => p.status === 'ongoing' || p.status === 'upcoming'));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load volunteer data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        ...formData,
        ngoId: '6767e8b6cbaef61d2ad0e123', // This should be set from user context
        title: `${formData.activityType} Activity`,
        activityType: formData.activityType as 'field_work' | 'training' | 'event' | 'administration' | 'outreach' | 'other',
        hoursLogged: parseFloat(formData.hoursLogged),
        date: new Date().toISOString(),
        beneficiariesServed: 1
      };

      await apiService.createVolunteerActivity(activityData);
      toast.success('Activity logged successfully!');
      setShowForm(false);
      setFormData({
        programId: '',
        activityType: '',
        hoursLogged: '',
        description: '',
        location: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('Failed to log activity');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      planned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredActivities = activities.filter(activity => 
    filterStatus === 'all' || activity.status === filterStatus
  );

  const totalHours = activities
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.hoursLogged, 0);

  const pendingHours = activities
    .filter(a => a.status === 'in_progress')
    .reduce((sum, a) => sum + a.hoursLogged, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Total Hours</p>
              <p className="text-2xl font-bold text-green-900">{totalHours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending Hours</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingHours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Activities</p>
              <p className="text-2xl font-bold text-blue-900">{activities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Log Activity
          </button>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              aria-label="Filter activities by status"
            >
              <option value="all">All Activities</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Log Volunteer Activity</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-1">
                  Program
                </label>
                <select
                  id="programId"
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select a program</option>                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  id="activityType"
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >                  <option value="">Select activity type</option>
                  <option value="field_work">Field Work</option>
                  <option value="administration">Administrative</option>
                  <option value="training">Training</option>
                  <option value="event">Event Support</option>
                  <option value="outreach">Community Outreach</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="hoursLogged" className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Logged
                </label>
                <input
                  type="number"
                  id="hoursLogged"
                  value={formData.hoursLogged}
                  onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })}
                  min="0.5"
                  max="24"
                  step="0.5"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Activity location"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Describe the activity performed"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Any additional notes or observations"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Log Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Your Volunteer Activities</h3>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activities logged yet</p>
            <p className="text-sm">Start by logging your first volunteer activity!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{activity.activityType}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.hoursLogged} hours
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {activity.location}
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{activity.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerServiceLog;
