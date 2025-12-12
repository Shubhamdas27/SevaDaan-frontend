import React, { useState, useEffect } from 'react';
import { Award, Download, FileText, Share2, Eye, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  expiryDate?: string;
  issuerId: string;
  issuerName: string;
  description: string;
  type: 'participation' | 'achievement' | 'training' | 'recognition';
  hours?: number;
  imageUrl: string;
  pdfUrl: string;
  badgeId?: string;
  skills?: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  issuedOn: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchCertificatesAndBadges = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockCertificates: Certificate[] = [
            {
              id: 'cert-1',
              title: 'Environmental Conservation Volunteer',
              issueDate: '2025-05-25',
              issuerId: 'ngo-1',
              issuerName: 'Green Earth Foundation',
              description: 'Awarded for active participation in environmental conservation activities including beach cleanup, tree plantation, and awareness campaigns.',
              type: 'participation',
              hours: 20,
              imageUrl: '/images/certificates/environmental-cert.jpg',
              pdfUrl: '/certificates/environmental-cert.pdf',
              badgeId: 'badge-1',
              skills: ['Environmental Conservation', 'Community Service', 'Teamwork']
            },
            {
              id: 'cert-2',
              title: 'Elderly Care Support Training',
              issueDate: '2025-04-10',
              issuerId: 'ngo-4',
              issuerName: 'Care For Elderly',
              description: 'Successfully completed training in elderly care support including basic medical assistance, recreational therapy, and emotional support techniques.',
              type: 'training',
              hours: 15,
              imageUrl: '/images/certificates/elderly-care-cert.jpg',
              pdfUrl: '/certificates/elderly-care-cert.pdf',
              skills: ['Elderly Care', 'Patient Support', 'Medical Assistance', 'Compassion']
            },
            {
              id: 'cert-3',
              title: 'Outstanding Volunteer Award',
              issueDate: '2025-03-28',
              issuerId: 'platform',
              issuerName: 'Sevadaan Platform',
              description: 'Awarded for exceptional dedication to volunteer services and completing over 50 hours of community service across multiple NGOs.',
              type: 'recognition',
              imageUrl: '/images/certificates/outstanding-volunteer.jpg',
              pdfUrl: '/certificates/outstanding-volunteer.pdf',
              badgeId: 'badge-3'
            }
          ];

          const mockBadges: Badge[] = [
            {
              id: 'badge-1',
              name: 'Environmental Champion',
              description: 'Awarded for participation in environmental conservation activities.',
              imageUrl: '/images/badges/environmental-champion.png',
              issuedOn: '2025-05-25',
              level: 'silver'
            },
            {
              id: 'badge-2',
              name: 'Community Helper',
              description: 'Awarded for contributing to community welfare programs.',
              imageUrl: '/images/badges/community-helper.png',
              issuedOn: '2025-04-15',
              level: 'bronze'
            },
            {
              id: 'badge-3',
              name: 'Volunteer Star',
              description: 'Awarded for exceptional volunteer service across multiple programs.',
              imageUrl: '/images/badges/volunteer-star.png',
              issuedOn: '2025-03-28',
              level: 'gold'
            }
          ];

          setCertificates(mockCertificates);
          setBadges(mockBadges);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching certificates and badges', error);
        setLoading(false);
      }
    };

    fetchCertificatesAndBadges();
  }, []);

  // Filter certificates based on search query
  const filteredCertificates = certificates.filter(certificate => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return certificate.title.toLowerCase().includes(query) ||
           certificate.issuerName.toLowerCase().includes(query) ||
           certificate.description.toLowerCase().includes(query) ||
           (certificate.skills && certificate.skills.some(skill => skill.toLowerCase().includes(query)));
  });
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (pdfUrl: string, title: string) => {
    // In a real app, this would trigger a download
    console.log(`Downloading certificate from ${pdfUrl}`);
    // Simulating download
    alert(`Downloaded "${title}" certificate successfully!`);
  };

  const handleShare = (certificateId: string) => {
    // In a real app, this would open a sharing dialog
    alert(`Sharing certificate ID: ${certificateId}`);
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsViewModalOpen(true);
  };

  const getBadgeLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {badges.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No badges earned yet. Start volunteering to earn badges!</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-6 items-center">
                  {badges.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center w-24">
                      <div className="relative">
                        {/* Placeholder for badge image - in a real app, use the actual image */}
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                          <Award className="h-8 w-8 text-primary-600" />
                        </div>
                        {badge.level && (
                          <span 
                            className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeLevelColor(badge.level)}`}
                          >
                            {badge.level.charAt(0).toUpperCase() + badge.level.slice(1)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-center font-medium text-gray-900">{badge.name}</p>
                      <p className="text-xs text-center text-gray-500">{formatDate(badge.issuedOn)}</p>
                    </div>
                  ))}
                  <div className="flex flex-col items-center w-24">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="mt-2 text-xs text-center font-medium text-gray-500">Next Badge</p>
                    <p className="text-xs text-center text-gray-400">Keep going!</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Your Certificates</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              View and download your earned certificates
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search certificates..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {filteredCertificates.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? 'Try changing your search criteria'
                      : 'Complete volunteer programs to earn certificates'}
                  </p>
                  <Button variant="primary">
                    Browse Volunteer Opportunities <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCertificates.map(certificate => (
                    <div 
                      key={certificate.id} 
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                        {/* Placeholder for certificate image - in a real app, use the actual image */}
                        <FileText className="h-12 w-12 text-gray-400" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <h3 className="text-lg font-semibold text-white">{certificate.title}</h3>
                            <p className="text-sm text-white/90">{certificate.issuerName}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-4 flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Issued on:</span> {formatDate(certificate.issueDate)}
                            </p>
                            {certificate.hours && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Hours:</span> {certificate.hours}
                              </p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1)}
                          </span>
                        </div>
                        
                        {certificate.skills && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Skills Verified:</p>
                            <div className="flex flex-wrap gap-2">
                              {certificate.skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => handleViewCertificate(certificate)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShare(certificate.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleDownload(certificate.pdfUrl, certificate.title)}
                            >
                              <Download className="h-4 w-4 mr-1" /> PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Certificate Modal */}
      {isViewModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsViewModalOpen(false)}
            ></div>
            
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-2xl w-full">
              <div className="bg-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {selectedCertificate.title}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gray-100 p-1 mb-4 flex justify-center">
                  <div className="w-full h-64 bg-white flex items-center justify-center border">
                    {/* Certificate preview - in a real app, use an actual image or PDF embed */}
                    <FileText className="h-16 w-16 text-gray-300" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Certificate Details:</h4>
                    <p className="mt-1 text-sm text-gray-600">{selectedCertificate.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Issued By:</h4>
                      <p className="mt-1 text-sm text-gray-600">{selectedCertificate.issuerName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Issue Date:</h4>
                      <p className="mt-1 text-sm text-gray-600">{formatDate(selectedCertificate.issueDate)}</p>
                    </div>
                  </div>
                  
                  {selectedCertificate.skills && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Skills Verified:</h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mr-2"
                  onClick={() => handleShare(selectedCertificate.id)}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleDownload(selectedCertificate.pdfUrl, selectedCertificate.title)}
                >
                  <Download className="h-4 w-4 mr-1" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
