import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Tag,
  Filter,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import apiService from '../../../lib/apiService';
import { ServiceApplication } from '../../../types';
import { useToast } from '../../ui/Toast';
import { formatDate } from '../../../lib/utils';

const ManagerServiceTracker: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ServiceApplication | null>(null);
  const [showCaseNoteForm, setShowCaseNoteForm] = useState(false);
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    urgencyLevel: '',
    serviceType: '',
    search: ''
  });

  const [caseNoteForm, setCaseNoteForm] = useState({
    noteType: 'update' as 'update' | 'milestone' | 'concern' | 'completion' | 'follow_up',
    title: '',
    content: '',
    hoursLogged: '',
    activitiesCompleted: [] as string[],
    nextSteps: [] as string[],
    isPrivate: false
  });

  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: '',
    assignedVolunteer: '',
    reviewNotes: '',
    estimatedCompletionDate: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getServiceApplications({
        ...filters,
        page: 1,
        limit: 50
      });
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string) => {
    try {
      await apiService.updateApplicationStatus(applicationId, statusUpdateForm);
      toast.success('Application status updated successfully');
      fetchApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddCaseNote = async (applicationId: string) => {
    try {
      const noteData = {
        ...caseNoteForm,
        hoursLogged: caseNoteForm.hoursLogged ? parseFloat(caseNoteForm.hoursLogged) : undefined
      };
      await apiService.addCaseNote(applicationId, noteData);
      toast.success('Case note added successfully');
      
      // Reset form
      setCaseNoteForm({
        noteType: 'update',
        title: '',
        content: '',
        hoursLogged: '',
        activitiesCompleted: [],
        nextSteps: [],
        isPrivate: false
      });
      
      setShowCaseNoteForm(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Error adding case note:', error);
      toast.error(error.response?.data?.message || 'Failed to add case note');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'under_review':
        return <Eye className="h-5 w-5 text-yellow-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleApplicationExpansion = (applicationId: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedApplications(newExpanded);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const urgencyOptions = [
    { value: '', label: 'All Urgencies' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const serviceTypeOptions = [
    { value: '', label: 'All Service Types' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Healthcare' },
    { value: 'food', label: 'Food Security' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'employment', label: 'Employment' },
    { value: 'legal', label: 'Legal Aid' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Application Management</h1>
          <p className="text-gray-600">Review and manage citizen service applications</p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => fetchApplications()}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              aria-label="Filter by status"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>            <select
              value={filters.urgencyLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, urgencyLevel: e.target.value }))}
              aria-label="Filter by urgency level"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>            <select
              value={filters.serviceType}
              onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
              aria-label="Filter by service type"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {serviceTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search applications..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600">No service applications match your current filters.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={() => toggleApplicationExpansion(application.id)}
                      className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {expandedApplications.has(application.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <span>{application.title}</span>
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(application.urgencyLevel)}`}>
                      {application.urgencyLevel.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {application.serviceType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{application.applicant?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location.city}, {application.location.state}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                  </div>

                  {application.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {application.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className="text-sm font-medium text-gray-900">
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <Button
                    onClick={() => setSelectedApplication(application)}
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedApplications.has(application.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm">{application.description}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Beneficiaries:</span>
                          <span className="ml-2 text-gray-700">{application.beneficiariesCount}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Priority:</span>
                          <span className="ml-2 text-gray-700">{application.priority}/10</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Assignment</h4>
                      <div className="space-y-2 text-sm">
                        {application.assignedManager && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Manager:</span>
                            <span className="text-gray-900">{application.assignedManager.name}</span>
                          </div>
                        )}
                        {application.assignedVolunteer && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Volunteer:</span>
                            <span className="text-gray-900">{application.assignedVolunteer.name}</span>
                          </div>
                        )}
                        {!application.assignedManager && !application.assignedVolunteer && (
                          <span className="text-gray-500 italic">Not assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Case Notes */}
                  {application.caseNotes && application.caseNotes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                      <div className="space-y-2">
                        {application.caseNotes.slice(-3).map((note, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{note.title}</span>
                              <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                            {note.hoursLogged && (
                              <div className="text-xs text-gray-600 mt-1">
                                Hours logged: {note.hoursLogged}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedApplication.title}</h2>
                  <p className="text-gray-600">Application Management</p>
                </div>
                <Button
                  onClick={() => setSelectedApplication(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Update */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>                      <select
                        value={statusUpdateForm.status || selectedApplication.status}
                        onChange={(e) => setStatusUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                        aria-label="Update application status"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
                      <textarea
                        value={statusUpdateForm.reviewNotes}
                        onChange={(e) => setStatusUpdateForm(prev => ({ ...prev, reviewNotes: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add notes about status change..."
                      />
                    </div>

                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Update Status
                    </Button>
                  </div>
                </Card>

                {/* Add Case Note */}
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Add Case Note</h3>
                    <Button
                      onClick={() => setShowCaseNoteForm(!showCaseNoteForm)}
                      variant="outline"
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {showCaseNoteForm ? 'Cancel' : 'Add Note'}
                    </Button>
                  </div>

                  {showCaseNoteForm && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>                        <select
                          value={caseNoteForm.noteType}
                          onChange={(e) => setCaseNoteForm(prev => ({ ...prev, noteType: e.target.value as any }))}
                          aria-label="Select note type"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="update">Update</option>
                          <option value="milestone">Milestone</option>
                          <option value="concern">Concern</option>
                          <option value="completion">Completion</option>
                          <option value="follow_up">Follow Up</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={caseNoteForm.title}
                          onChange={(e) => setCaseNoteForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Note title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          value={caseNoteForm.content}
                          onChange={(e) => setCaseNoteForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={3}
                          placeholder="Note details..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <Button
                        onClick={() => handleAddCaseNote(selectedApplication.id)}
                        disabled={!caseNoteForm.title || !caseNoteForm.content}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        Add Note
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerServiceTracker;
