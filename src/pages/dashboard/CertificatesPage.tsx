import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../components/icons';
import { getDemoCertificates, downloadCertificate } from '../../data/demoData';

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'donation' | 'volunteer' | 'completion'>('all');

  const allCertificates = getDemoCertificates(user?.role || 'citizen');
  const filteredCertificates = filter === 'all' 
    ? allCertificates 
    : allCertificates.filter(cert => cert.type === filter);

  const handleDownloadCertificate = async (certificateId: string) => {
    setDownloadingCertificate(certificateId);
    try {
      await downloadCertificate(certificateId);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setDownloadingCertificate(null);
    }
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'donation': return Icons.donation;
      case 'volunteer': return Icons.users;
      case 'completion': return Icons.success;
      default: return Icons.award;
    }
  };

  const getCertificateColor = (type: string) => {
    switch (type) {
      case 'donation': return 'text-green-600 bg-green-50';
      case 'volunteer': return 'text-blue-600 bg-blue-50';
      case 'completion': return 'text-purple-600 bg-purple-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Certificates & Documents
        </h1>
        <p className="text-gray-600">
          Download and manage all your certificates, receipts, and official documents.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.filter className="w-5 h-5 text-blue-600" />
            Filter Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({allCertificates.length})
            </Button>
            <Button
              variant={filter === 'donation' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('donation')}
            >
              Donation ({allCertificates.filter(c => c.type === 'donation').length})
            </Button>
            <Button
              variant={filter === 'volunteer' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('volunteer')}
            >
              Volunteer ({allCertificates.filter(c => c.type === 'volunteer').length})
            </Button>
            <Button
              variant={filter === 'completion' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completion')}
            >
              Completion ({allCertificates.filter(c => c.type === 'completion').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.award className="w-5 h-5 text-yellow-600" />
            Available Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate) => {
                const IconComponent = getCertificateIcon(certificate.type);
                return (
                  <div key={certificate.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{certificate.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{certificate.description}</p>
                        <p className="text-sm font-medium text-gray-800">Recipient: {certificate.recipientName}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${getCertificateColor(certificate.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    
                    {certificate.amount && (
                      <div className="mb-4">
                        <span className="text-lg font-bold text-green-600">
                          ₹{certificate.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">Tax Deductible</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <div>Issued: {certificate.issueDate}</div>
                        <div className="capitalize mt-1">
                          Type: <span className="font-medium">{certificate.type}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadCertificate(certificate.id)}
                        disabled={downloadingCertificate === certificate.id}
                        className="flex items-center gap-2"
                      >
                        {downloadingCertificate === certificate.id ? (
                          <Icons.refresh className="w-4 h-4" />
                        ) : (
                          <Icons.download className="w-4 h-4" />
                        )}
                        Download PDF
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icons.award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "You don't have any certificates yet. Complete programs or make donations to earn certificates." 
                  : `No ${filter} certificates found. Try a different filter.`}
              </p>
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Certificates
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.info className="w-5 h-5 text-blue-600" />
            Certificate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-green-50 rounded-lg w-fit mx-auto mb-3">
                <Icons.donation className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Donation Certificates</h4>
              <p className="text-sm text-gray-600">
                Tax deduction certificates for your donations under Section 80G of Income Tax Act.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-3">
                <Icons.users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Volunteer Certificates</h4>
              <p className="text-sm text-gray-600">
                Recognition certificates for your volunteer service hours and community contributions.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-50 rounded-lg w-fit mx-auto mb-3">
                <Icons.success className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Completion Certificates</h4>
              <p className="text-sm text-gray-600">
                Program completion certificates for training courses and skill development programs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2 p-4 h-auto">
              <Icons.phone className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-gray-600">Get help with certificate issues</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 p-4 h-auto">
              <Icons.email className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Request Certificate</div>
                <div className="text-sm text-gray-600">Request missing certificates</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesPage;
