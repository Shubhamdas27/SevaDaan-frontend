import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, ChevronDown, ChevronUp, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { getApplicationStatusBadge } from '../../../lib/status-utils';

interface TaxReceipt {
  id: string;
  financialYear: string;
  amount: number;
  dateGenerated: string;
  dateFiled?: string;
  receiptUrl: string;
  status: 'available' | 'pending' | 'filed';
}

const TaxReceipts: React.FC = () => {
  const [receipts, setReceipts] = useState<TaxReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchTaxReceipts = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockReceipts: TaxReceipt[] = [
            {
              id: 'tr-2024-25',
              financialYear: '2024-2025',
              amount: 15000,
              dateGenerated: '2025-04-15',
              receiptUrl: '/receipts/tax-2024-25.pdf',
              status: 'available'
            },
            {
              id: 'tr-2023-24',
              financialYear: '2023-2024',
              amount: 12500,
              dateGenerated: '2024-04-10',
              dateFiled: '2024-07-25',
              receiptUrl: '/receipts/tax-2023-24.pdf',
              status: 'filed'
            },
            {
              id: 'tr-2022-23',
              financialYear: '2022-2023',
              amount: 8000,
              dateGenerated: '2023-04-12',
              dateFiled: '2023-07-20',
              receiptUrl: '/receipts/tax-2022-23.pdf',
              status: 'filed'
            }
          ];

          setReceipts(mockReceipts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching tax receipts', error);
        setLoading(false);
      }
    };

    fetchTaxReceipts();
  }, []);  // Filter receipts based on selected year and search query
  const filteredReceipts = receipts.filter(receipt => {
    // Filter by year
    if (filterYear !== 'all' && receipt.financialYear !== filterYear) {
      return false;
    }
    
    // Apply search query (if any)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return receipt.financialYear.toLowerCase().includes(query) || 
             (receipt.status.toLowerCase().includes(query));
    }
    
    return true;
  });
  // Extract unique financial years for filter
  const availableYears = [...new Set(receipts.map(receipt => receipt.financialYear))];

  const getStatusBadge = (status: string) => {
    // Map tax receipt statuses to application statuses
    const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'processing'> = {
      'available': 'approved',
      'pending': 'pending', 
      'filed': 'processing'
    };
    
    return getApplicationStatusBadge(statusMap[status] || 'pending');
  };

  const handleDownload = (url: string) => {
    // In a real app, this would trigger a download
    console.log(`Downloading from ${url}`);
    // Simulating download
    alert(`Downloaded tax receipt successfully!`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Tax Receipts</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Download tax receipts for your donations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
            {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      {isFilterOpen && (
        <div className="px-6 py-3 border-t border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="financial-year-select" className="text-sm font-medium text-gray-700 mr-2">Financial Year:</label>
              <select
                id="financial-year-select"
                className="rounded-md border border-gray-300 text-sm py-1.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tax receipts found</h3>
                <p className="text-gray-500">
                  {searchQuery || filterYear !== 'all' 
                    ? 'Try changing your search or filter criteria'
                    : 'You don\'t have any tax receipts yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Financial Year</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date Generated</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date Filed</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReceipts.map(receipt => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {receipt.financialYear}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {formatCurrency(receipt.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {formatDate(receipt.dateGenerated)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(receipt.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {receipt.dateFiled ? formatDate(receipt.dateFiled) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
                            onClick={() => handleDownload(receipt.receiptUrl)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Need help with filing taxes?</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    These receipts can be used for tax deduction under Section 80G of the Income Tax Act. 
                    Consult a tax professional for guidance on how to include these donations in your tax filing.
                  </p>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      Learn more about tax benefits for donations
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxReceipts;
