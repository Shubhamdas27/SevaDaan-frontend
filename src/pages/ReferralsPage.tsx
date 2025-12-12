import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle, Users, Clock, CheckCircle, X } from 'lucide-react';
import Layout from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../lib/api';

interface Referral {
  _id: string;
  referralType: 'ngo' | 'program' | 'volunteer_opportunity' | 'grant';
  beneficiary: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    needDescription: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  description: string;
  referredBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  followUpNotes: Array<{
    note: string;
    addedBy: {
      _id: string;
      name: string;
    };
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ReferralStats {
  overview: {
    total: number;
    pending: number;
    completed: number;
    critical: number;
  };
  statusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  urgencyDistribution: Array<{
    _id: string;
    count: number;
  }>;
}

const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form state for creating new referral
  const [formData, setFormData] = useState({
    referralType: 'ngo',
    beneficiaryName: '',
    beneficiaryPhone: '',
    beneficiaryEmail: '',
    beneficiaryAddress: '',
    needDescription: '',
    urgencyLevel: 'medium',
    category: 'healthcare',
    description: '',
    priority: 'medium',
    referredTo: ''
  });

  const categories = [
    'education', 'healthcare', 'emergency', 'food', 'shelter', 
    'employment', 'legal-aid', 'counseling', 'financial-assistance', 
    'skill-development', 'other'
  ];

  useEffect(() => {
    fetchReferrals();
    if (user?.role === 'ngo' || user?.role === 'ngo_admin' || user?.role === 'ngo_manager') {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    filterReferrals();
  }, [referrals, searchQuery, statusFilter, urgencyFilter, categoryFilter]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/referrals');
      setReferrals(response.data.data.referrals || response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch referrals');
      toast.error('Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/referrals/stats');
      setStats(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const filterReferrals = () => {
    let result = referrals;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(referral =>
        referral.beneficiary.name.toLowerCase().includes(query) ||
        referral.description.toLowerCase().includes(query) ||
        referral.category.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(referral => referral.status === statusFilter);
    }

    if (urgencyFilter !== 'all') {
      result = result.filter(referral => referral.beneficiary.urgencyLevel === urgencyFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(referral => referral.category === categoryFilter);
    }

    setFilteredReferrals(result);
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const referralData = {
        referralType: formData.referralType,
        referredTo: formData.referredTo || undefined,
        beneficiary: {
          name: formData.beneficiaryName,
          phone: formData.beneficiaryPhone,
          email: formData.beneficiaryEmail,
          address: formData.beneficiaryAddress,
          needDescription: formData.needDescription,
          urgencyLevel: formData.urgencyLevel
        },
        category: formData.category,
        description: formData.description,
        priority: formData.priority
      };

      await api.post('/referrals', referralData);
      toast.success('Referral created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchReferrals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create referral');
    }
  };

  const resetForm = () => {
    setFormData({
      referralType: 'ngo',
      beneficiaryName: '',
      beneficiaryPhone: '',
      beneficiaryEmail: '',
      beneficiaryAddress: '',
      needDescription: '',
      urgencyLevel: 'medium',
      category: 'healthcare',
      description: '',
      priority: 'medium',
      referredTo: ''
    });
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'accepted': return 'text-purple-600 bg-purple-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
              <p className="mt-2 text-gray-600">
                Connect people in need with appropriate NGOs and programs
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Referral
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.critical}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search referrals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>                <select
                  title="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>                <select
                  title="Filter by urgency"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Urgency Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>                <select
                  title="Filter by category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setUrgencyFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referrals List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredReferrals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
                <p className="text-gray-600 mb-4">
                  {referrals.length === 0 
                    ? "No referrals have been created yet." 
                    : "No referrals match your current filters."
                  }
                </p>
                {referrals.length === 0 && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create Your First Referral
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredReferrals.map((referral) => (
              <Card key={referral._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {referral.beneficiary.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(referral.beneficiary.urgencyLevel)}`}>
                          {referral.beneficiary.urgencyLevel.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                          {getStatusIcon(referral.status)}
                          <span className="ml-1">{referral.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Category:</strong> {referral.category.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Phone:</strong> {referral.beneficiary.phone}
                          </p>
                          {referral.beneficiary.email && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Email:</strong> {referral.beneficiary.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Referred by:</strong> {referral.referredBy.name}
                          </p>
                          {referral.assignedTo && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Assigned to:</strong> {referral.assignedTo.name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <strong>Created:</strong> {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Need:</strong> {referral.beneficiary.needDescription}
                      </p>
                      
                      <p className="text-sm text-gray-700">
                        <strong>Description:</strong> {referral.description}
                      </p>
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReferral(referral);
                          setShowDetailsModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Referral Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Referral"
          size="lg"
        >
          <form onSubmit={handleCreateReferral} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficiary Name *
                </label>                <input
                  type="text"
                  required
                  placeholder="Enter beneficiary name"
                  value={formData.beneficiaryName}
                  onChange={(e) => setFormData({...formData, beneficiaryName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.beneficiaryPhone}
                  onChange={(e) => setFormData({...formData, beneficiaryPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10-digit phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>                <input
                  type="email"
                  placeholder="Enter email address (optional)"
                  value={formData.beneficiaryEmail}
                  onChange={(e) => setFormData({...formData, beneficiaryEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>                <select
                  title="Select category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>              <textarea
                required
                placeholder="Enter complete address"
                value={formData.beneficiaryAddress}
                onChange={(e) => setFormData({...formData, beneficiaryAddress: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Need Description *
              </label>
              <textarea
                required
                value={formData.needDescription}
                onChange={(e) => setFormData({...formData, needDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the specific need or situation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Additional context, background, or recommendations..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>                <select
                  title="Select urgency level"
                  required
                  value={formData.urgencyLevel}
                  onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>                <select
                  title="Select priority"
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Referral
              </Button>
            </div>
          </form>
        </Modal>

        {/* Referral Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Referral Details"
          size="lg"
        >
          {selectedReferral && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Beneficiary Information</h4>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedReferral.beneficiary.name}</p>
                    <p><strong>Phone:</strong> {selectedReferral.beneficiary.phone}</p>
                    {selectedReferral.beneficiary.email && (
                      <p><strong>Email:</strong> {selectedReferral.beneficiary.email}</p>
                    )}
                    <p><strong>Address:</strong> {selectedReferral.beneficiary.address}</p>
                    <p><strong>Urgency:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getUrgencyColor(selectedReferral.beneficiary.urgencyLevel)}`}>
                        {selectedReferral.beneficiary.urgencyLevel.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Referral Information</h4>
                  <div className="space-y-2">
                    <p><strong>Category:</strong> {selectedReferral.category.replace('-', ' ')}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedReferral.status)}`}>
                        {selectedReferral.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p><strong>Priority:</strong> {selectedReferral.priority}</p>
                    <p><strong>Referred by:</strong> {selectedReferral.referredBy.name}</p>
                    {selectedReferral.assignedTo && (
                      <p><strong>Assigned to:</strong> {selectedReferral.assignedTo.name}</p>
                    )}
                    <p><strong>Created:</strong> {new Date(selectedReferral.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Need Description</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedReferral.beneficiary.needDescription}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedReferral.description}
                </p>
              </div>

              {selectedReferral.followUpNotes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Follow-up Notes</h4>
                  <div className="space-y-3">
                    {selectedReferral.followUpNotes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 mb-2">{note.note}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>By: {note.addedBy.name}</span>
                          <span>{new Date(note.addedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default ReferralsPage;
