import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Spinner } from '../components/ui/Spinner';
import { Icons } from '../components/icons';
import { useDonations } from '../hooks/useApiHooks';
import { Donation } from '../types';
import { formatDate } from '../utils/formatters';

interface DonationWithNgo extends Donation {
  ngo: {
    id: string;
    name: string;
    logo: string;
  };
}

const DonationHistory: React.FC = () => {
  const { donations, loading, error, fetchDonationHistory } = useDonations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchDonationHistory();
  }, [fetchDonationHistory]);

  const handleRetry = () => {
    fetchDonationHistory();
  };
  // Filter donations based on search query and status filter
  const filteredDonations = donations.filter((donation: Donation) => {
    const donationWithNgo = donation as DonationWithNgo;
    const matchesSearch = searchQuery
      ? donationWithNgo.ngo?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter ? donation.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  const downloadCSV = () => {
    // Create CSV content
    const headers = ['Date', 'NGO', 'Amount', 'Status', 'Reference ID'];
    const rows = filteredDonations.map((donation: Donation) => {
      const donationWithNgo = donation as DonationWithNgo;
      return [
        new Date(donation.date).toLocaleDateString('en-IN'),
        donationWithNgo.ngo?.name || 'Unknown NGO',
        `${donation.currency === 'INR' ? '₹' : '$'}${donation.amount.toLocaleString()}`,
        donation.status,
        donation.id
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `donation_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-lg mx-auto text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading your donation history...</h2>
            <p className="text-slate-600 dark:text-slate-400">This will only take a moment.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 py-12 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Donation History</h1>
            <p className="text-white/90">
              Track all your contributions and download tax receipts
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          {error ? (
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-error-600 mb-2">Failed to load donations</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                <Button onClick={handleRetry}>Retry</Button>
              </CardContent>
            </Card>
          ) : (            <>
              <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div className="relative flex-grow max-w-md">
                  <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative inline-block">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('statusDropdown')?.classList.toggle('hidden')}
                    >
                      <Icons.filter className="w-4 h-4" />
                      Status
                      <Icons.chevronDown className="w-4 h-4" />
                    </Button>
                    <div
                      id="statusDropdown"
                      className="hidden absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-slate-800 z-10 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="py-1">
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${!statusFilter ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => {
                            setStatusFilter(null);
                            document.getElementById('statusDropdown')?.classList.add('hidden');
                          }}
                        >
                          All
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'completed' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => {
                            setStatusFilter('completed');
                            document.getElementById('statusDropdown')?.classList.add('hidden');
                          }}
                        >
                          Completed
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'pending' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => {
                            setStatusFilter('pending');
                            document.getElementById('statusDropdown')?.classList.add('hidden');
                          }}
                        >
                          Pending
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'failed' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => {
                            setStatusFilter('failed');
                            document.getElementById('statusDropdown')?.classList.add('hidden');
                          }}
                        >
                          Failed
                        </button>
                      </div>
                    </div>
                  </div>
                    <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={downloadCSV}
                  >
                    <Icons.download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              {filteredDonations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No donations found</h3>
                    {searchQuery || statusFilter ? (
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Try changing your search or filter criteria
                      </p>                    ) : (
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        You haven't made any donations yet. Find an NGO to support!
                      </p>
                    )}
                    <Link to="/ngos">
                      <Button>
                        Browse NGOs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Organization
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>                      </thead>
                      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredDonations.map((donation: Donation) => {
                          const donationWithNgo = donation as DonationWithNgo;
                          return (
                            <tr key={donation.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(donation.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {donationWithNgo.ngo?.logo && (
                                    <img
                                      src={donationWithNgo.ngo.logo}
                                      alt={donationWithNgo.ngo.name}
                                      className="h-8 w-8 rounded-full mr-3 object-cover"
                                    />
                                  )}
                                  <div>
                                    <Link 
                                      to={`/ngos/${donation.ngoId}`}
                                      className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                      {donationWithNgo.ngo?.name || 'Unknown NGO'}
                                    </Link>
                                    {donation.isAnonymous && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                        Anonymous
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {donation.currency === 'INR' ? '₹' : '$'}{donation.amount.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge 
                                  status={donation.status === 'refunded' ? 'cancelled' : donation.status as 'pending' | 'completed' | 'failed' | 'success' | 'approved' | 'rejected' | 'ongoing' | 'upcoming' | 'cancelled' | 'active' | 'inactive' | 'verified' | 'unverified'} 
                                  variant="solid" 
                                  size="sm" 
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <Link
                                  to={`/donation-success?id=${donation.id}`}
                                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DonationHistory;
