import React, { useState, useEffect } from 'react';
import { Search, Download, Award, Eye, CheckCircle } from 'lucide-react';
import Layout from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../lib/api';

interface Certificate {
  _id: string;
  certificateId: string;
  title: string;
  description: string;
  certificateType: 'volunteer' | 'donor' | 'participant' | 'completion' | 'appreciation' | 'achievement';
  status: 'active' | 'expired' | 'revoked';
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  issuedBy: {
    _id: string;
    name: string;
    email: string;
  };
  relatedTo: {
    type: 'program' | 'donation' | 'volunteer_work' | 'grant' | 'general';
    reference: any;
  };
  validFrom: string;
  validUntil?: string;
  certificateUrl?: string;
  qrCodeUrl?: string;
  verificationCode: string;
  downloadCount: number;
  verifiedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CertificateStats {
  overview: {
    totalCertificates: number;
    activeCertificates: number;
    expiredCertificates: number;
    revokedCertificates: number;
    totalDownloads: number;
    totalVerifications: number;
  };
  byType: Array<{
    _id: string;
    count: number;
  }>;
}

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCertificates();
    if (['ngo', 'ngo_admin', 'ngo_manager'].includes(user?.role || '')) {
      fetchStats();
    }
  }, [currentPage, searchQuery, statusFilter, typeFilter]);

  const fetchCertificates = async () => {
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
        params.append('certificateType', typeFilter);
      }

      const response = await api.get(`/certificates?${params.toString()}`);
      setCertificates(response.data.data.certificates);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/certificates/stats');
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch certificate stats:', error);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      const response = await api.get(`/certificates/${certificateId}/download`);
      
      if (response.data.data.downloadUrl) {
        // In a real app, this would trigger actual file download
        toast.success('Certificate download initiated');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download certificate');
    }
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
  };

  const filteredCertificates = certificates.filter(certificate =>
    certificate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.certificateId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer': return 'bg-blue-100 text-blue-800';
      case 'donor': return 'bg-purple-100 text-purple-800';
      case 'participant': return 'bg-green-100 text-green-800';
      case 'completion': return 'bg-indigo-100 text-indigo-800';
      case 'appreciation': return 'bg-pink-100 text-pink-800';
      case 'achievement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && certificates.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
            <p className="text-gray-600 mt-2">Manage and view your certificates</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalCertificates}</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.overview.activeCertificates}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.overview.totalDownloads}</p>
                  </div>
                  <Download className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verifications</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.overview.totalVerifications}</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-500" />
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
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by certificate type"
                >
                  <option value="all">All Types</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="donor">Donor</option>
                  <option value="participant">Participant</option>
                  <option value="completion">Completion</option>
                  <option value="appreciation">Appreciation</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates List */}
        <div className="space-y-4">
          {filteredCertificates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                <p className="text-gray-600">No certificates match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredCertificates.map((certificate) => (
              <Card key={certificate._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                          {certificate.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(certificate.certificateType)}`}>
                          {certificate.certificateType}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{certificate.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Certificate ID: {certificate.certificateId}</span>
                        <span>Recipient: {certificate.recipient.name}</span>
                        <span>Issued: {new Date(certificate.createdAt).toLocaleDateString()}</span>
                        {certificate.validUntil && (
                          <span>Valid Until: {new Date(certificate.validUntil).toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {certificate.downloadCount} downloads
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {certificate.verifiedCount} verifications
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(certificate)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(certificate._id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
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

        {/* Certificate Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Certificate Details"
        >
          {selectedCertificate && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedCertificate.title}</h3>
                <p className="text-gray-600">{selectedCertificate.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.certificateId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedCertificate.certificateType)}`}>
                    {selectedCertificate.certificateType}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCertificate.status)}`}>
                    {selectedCertificate.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedCertificate.verificationCode}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <p className="text-sm text-gray-900">{selectedCertificate.recipient.name}</p>
                <p className="text-sm text-gray-600">{selectedCertificate.recipient.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
                <p className="text-sm text-gray-900">{selectedCertificate.issuedBy.name}</p>
                <p className="text-sm text-gray-600">{selectedCertificate.issuedBy.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <p className="text-sm text-gray-900">{new Date(selectedCertificate.validFrom).toLocaleDateString()}</p>
                </div>
                {selectedCertificate.validUntil && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <p className="text-sm text-gray-900">{new Date(selectedCertificate.validUntil).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(selectedCertificate._id)}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default CertificatesPage;
