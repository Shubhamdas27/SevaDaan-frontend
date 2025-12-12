import React, { useState, useEffect } from 'react';
import { Download, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

interface Donation {
  id: string;
  amount: number;
  date: string;
  ngoId: string;
  ngoName: string;
  programName?: string;
  status: 'completed' | 'processing' | 'failed';
  paymentMethod: string;
  receiptUrl?: string;
  certificateUrl?: string;
}

const DonationHistory: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const itemsPerPage = 10;
  
  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockDonations: Donation[] = [
            {
              id: 'don-1',
              amount: 5000,
              date: '2023-07-15',
              ngoId: 'ngo-1',
              ngoName: 'Care Foundation',
              programName: 'Education for All',
              status: 'completed',
              paymentMethod: 'Credit Card',
              receiptUrl: '/receipts/don-1.pdf',
              certificateUrl: '/certificates/don-1.pdf'
            },
            {
              id: 'don-2',
              amount: 2500,
              date: '2023-06-22',
              ngoId: 'ngo-2',
              ngoName: 'Hope Initiative',
              programName: 'Healthcare Outreach',
              status: 'completed',
              paymentMethod: 'UPI',
              receiptUrl: '/receipts/don-2.pdf'
            },
            {
              id: 'don-3',
              amount: 1000,
              date: '2023-05-10',
              ngoId: 'ngo-1',
              ngoName: 'Care Foundation',
              status: 'completed',
              paymentMethod: 'Net Banking',
              receiptUrl: '/receipts/don-3.pdf'
            },
            {
              id: 'don-4',
              amount: 3000,
              date: '2023-04-05',
              ngoId: 'ngo-3',
              ngoName: 'Green Earth',
              programName: 'Tree Plantation Drive',
              status: 'completed',
              paymentMethod: 'Credit Card',
              receiptUrl: '/receipts/don-4.pdf',
              certificateUrl: '/certificates/don-4.pdf'
            },
            {
              id: 'don-5',
              amount: 500,
              date: '2023-03-18',
              ngoId: 'ngo-2',
              ngoName: 'Hope Initiative',
              status: 'completed',
              paymentMethod: 'UPI',
              receiptUrl: '/receipts/don-5.pdf'
            },
            {
              id: 'don-6',
              amount: 1500,
              date: '2022-12-24',
              ngoId: 'ngo-1',
              ngoName: 'Care Foundation',
              programName: 'Winter Relief',
              status: 'completed',
              paymentMethod: 'Credit Card',
              receiptUrl: '/receipts/don-6.pdf'
            },
            {
              id: 'don-7',
              amount: 7500,
              date: '2022-11-30',
              ngoId: 'ngo-4',
              ngoName: 'Helping Hands',
              programName: 'Disaster Relief',
              status: 'completed',
              paymentMethod: 'Credit Card',
              receiptUrl: '/receipts/don-7.pdf',
              certificateUrl: '/certificates/don-7.pdf'
            }
          ];

          setDonations(mockDonations);
          setFilteredDonations(mockDonations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching donations', error);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Handle filtering and searching
  useEffect(() => {
    let result = [...donations];
    
    // Filter by year if selected
    if (selectedYear !== 'all') {
      result = result.filter(donation => {
        const donationYear = new Date(donation.date).getFullYear().toString();
        return donationYear === selectedYear;
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(donation => 
        donation.ngoName.toLowerCase().includes(query) ||
        (donation.programName && donation.programName.toLowerCase().includes(query))
      );
    }
    
    setFilteredDonations(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedYear, donations]);

  // Get available years for filter
  const availableYears = [...new Set(
    donations.map(donation => new Date(donation.date).getFullYear())
  )].sort((a, b) => b - a); // Sort in descending order
  
  // Pagination logic
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (url: string, type: 'receipt' | 'certificate') => {
    // In a real app, this would trigger a download
    console.log(`Downloading ${type} from ${url}`);
    // Simulating download
    alert(`Downloaded ${type} successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <CardTitle>Donation History</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            View and download your donation receipts and certificates
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <select
            className="rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Filter donations by year"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search NGO or program..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredDonations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No donations found matching your criteria.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Program</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment Method</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentDonations.map(donation => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{formatDate(donation.date)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{donation.ngoName}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{donation.programName || '-'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatCurrency(donation.amount)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(donation.status)}`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{donation.paymentMethod}</td>
                          <td className="px-4 py-3 text-sm text-right space-x-2">
                            {donation.receiptUrl && (
                              <button
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
                                onClick={() => handleDownload(donation.receiptUrl!, 'receipt')}
                                title="Download Receipt"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Receipt
                              </button>
                            )}
                            {donation.certificateUrl && (
                              <button
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-accent-700 bg-accent-50 hover:bg-accent-100 focus:outline-none"
                                onClick={() => handleDownload(donation.certificateUrl!, 'certificate')}
                                title="Download Certificate"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Certificate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDonations.length)} of {filteredDonations.length} donations
                    </div>
                    <div className="flex space-x-1">
                      <button
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage === page
                                  ? 'bg-primary-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page}>...</span>;
                        }
                        return null;
                      })}
                      <button
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationHistory;
