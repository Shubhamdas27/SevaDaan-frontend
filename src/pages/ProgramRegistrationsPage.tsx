import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Eye, CheckCircle, Clock, X, Star } from 'lucide-react';
import Layout from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../lib/api';

interface ProgramRegistration {
  _id: string;
  program: {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    programType: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  registrationType: 'volunteer' | 'beneficiary' | 'participant';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  applicationData: {
    motivation?: string;
    skills?: string[];
    availability?: {
      days: string[];
      timeSlots: string[];
    };
    experience?: string;
    specialRequirements?: string;
  };
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvedAt?: string;
  completedAt?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  attendanceRecord?: {
    sessionsAttended: number;
    totalSessions: number;
    lastAttendance: string;
  };
  certificateIssued?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationStats {
  overview: {
    totalRegistrations: number;
    pendingRegistrations: number;
    approvedRegistrations: number;
    completedRegistrations: number;
    cancelledRegistrations: number;
  };
  byType: Array<{
    _id: string;
    count: number;
  }>;
}

const ProgramRegistrationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<ProgramRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<ProgramRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchRegistrations();
    if (['ngo', 'ngo_admin', 'ngo_manager'].includes(user?.role || '')) {
      fetchStats();
    }
  }, [currentPage, searchQuery, statusFilter, typeFilter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (typeFilter && typeFilter !== 'all') {
        params.append('registrationType', typeFilter);
      }

      const response = await api.get(`/program-registrations?${params.toString()}`);
      setRegistrations(response.data.data.registrations);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch program registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/program-registrations/stats');
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch registration stats:', error);
    }
  };
  const handleUpdateStatus = async (registrationId: string, status: string) => {
    try {
      await api.put(`/program-registrations/${registrationId}`, { status });
      
      // Update the registration in the list
      setRegistrations(prev => 
        prev.map(reg => 
          reg._id === registrationId 
            ? { ...reg, status: status as any }
            : reg
        )
      );
      
      toast.success(`Registration ${status} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${status} registration`);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      await api.patch(`/program-registrations/${registrationId}/cancel`);
      
      // Update the registration in the list
      setRegistrations(prev => 
        prev.map(reg => 
          reg._id === registrationId 
            ? { ...reg, status: 'cancelled' }
            : reg
        )
      );
      
      toast.success('Registration cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRegistration) return;

    try {
      await api.post(`/program-registrations/${selectedRegistration._id}/feedback`, feedbackForm);
      
      // Update the registration with feedback
      setRegistrations(prev => 
        prev.map(reg => 
          reg._id === selectedRegistration._id 
            ? { ...reg, feedback: { ...feedbackForm, submittedAt: new Date().toISOString() } }
            : reg
        )
      );
      
      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 5, comment: '' });
      toast.success('Feedback submitted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const handleViewDetails = (registration: ProgramRegistration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const handleShowFeedback = (registration: ProgramRegistration) => {
    setSelectedRegistration(registration);
    setShowFeedbackModal(true);
  };

  const filteredRegistrations = registrations.filter(registration =>
    registration.program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer': return 'bg-blue-100 text-blue-800';
      case 'beneficiary': return 'bg-green-100 text-green-800';
      case 'participant': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && registrations.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Registrations</h1>
            <p className="text-gray-600 mt-2">Manage program registrations and applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalRegistrations}</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.overview.pendingRegistrations}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.overview.approvedRegistrations}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.overview.completedRegistrations}</p>
                  </div>
                  <Star className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search registrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by registration type"
                >
                  <option value="all">All Types</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="participant">Participant</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                <p className="text-gray-600">No registrations match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRegistrations.map((registration) => (
              <Card key={registration._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{registration.program.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                          {registration.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(registration.registrationType)}`}>
                          {registration.registrationType}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                        <span>Applicant: {registration.user.name}</span>
                        <span>Email: {registration.user.email}</span>
                        {registration.user.phone && <span>Phone: {registration.user.phone}</span>}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Applied: {new Date(registration.createdAt).toLocaleDateString()}</span>
                        {registration.approvedAt && (
                          <span>Approved: {new Date(registration.approvedAt).toLocaleDateString()}</span>
                        )}
                        {registration.completedAt && (
                          <span>Completed: {new Date(registration.completedAt).toLocaleDateString()}</span>
                        )}
                        {registration.certificateIssued && (
                          <span className="text-green-600 font-medium">Certificate Issued</span>
                        )}
                      </div>

                      {registration.attendanceRecord && (
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>
                            Attendance: {registration.attendanceRecord.sessionsAttended}/{registration.attendanceRecord.totalSessions} sessions
                          </span>
                          {registration.attendanceRecord.lastAttendance && (
                            <span>Last: {new Date(registration.attendanceRecord.lastAttendance).toLocaleDateString()}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(registration)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {/* Action buttons based on user role and status */}
                      {['ngo', 'ngo_admin', 'ngo_manager'].includes(user?.role || '') && registration.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(registration._id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(registration._id, 'rejected')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {registration.user._id === user?.id && registration.status === 'completed' && !registration.feedback && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowFeedback(registration)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Feedback
                        </Button>
                      )}

                      {registration.user._id === user?.id && ['pending', 'approved'].includes(registration.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelRegistration(registration._id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "primary" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Registration Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Registration Details"
        >
          {selectedRegistration && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedRegistration.program.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRegistration.status)}`}>
                    {selectedRegistration.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedRegistration.registrationType)}`}>
                    {selectedRegistration.registrationType}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant</label>
                <p className="text-sm text-gray-900">{selectedRegistration.user.name}</p>
                <p className="text-sm text-gray-600">{selectedRegistration.user.email}</p>
                {selectedRegistration.user.phone && (
                  <p className="text-sm text-gray-600">{selectedRegistration.user.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <p className="text-sm text-gray-900">{selectedRegistration.program.title}</p>
                <p className="text-sm text-gray-600">{selectedRegistration.program.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedRegistration.program.startDate).toLocaleDateString()} - {new Date(selectedRegistration.program.endDate).toLocaleDateString()}
                </p>
              </div>

              {selectedRegistration.applicationData.motivation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivation</label>
                  <p className="text-sm text-gray-900">{selectedRegistration.applicationData.motivation}</p>
                </div>
              )}

              {selectedRegistration.applicationData.skills && selectedRegistration.applicationData.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedRegistration.applicationData.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRegistration.applicationData.experience && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-sm text-gray-900">{selectedRegistration.applicationData.experience}</p>
                </div>
              )}

              {selectedRegistration.feedback && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < selectedRegistration.feedback!.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({selectedRegistration.feedback.rating}/5)</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedRegistration.feedback.comment}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Feedback Modal */}
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title="Submit Feedback"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                    className="p-1"
                  >
                    <Star 
                      className={`w-6 h-6 ${rating <= feedbackForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience with this program..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProgramRegistrationsPage;
