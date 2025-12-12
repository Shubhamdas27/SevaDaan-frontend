import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../components/icons';
import { getDemoDonations, downloadDonationReceipt } from '../../data/demoData';

const DonationsPage: React.FC = () => {
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const allDonations = getDemoDonations();
  const filteredDonations = filter === 'all' 
    ? allDonations 
    : allDonations.filter(donation => donation.status === filter);

  const handleDownloadReceipt = async (donationId: string) => {
    setDownloadingReceipt(donationId);
    try {
      await downloadDonationReceipt(donationId);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalDonated = allDonations
    .filter(d => d.status === 'completed')
    .reduce((sum, donation) => sum + donation.amount, 0);

  const stats = [
    {
      title: 'Total Donated',
      value: `₹${totalDonated.toLocaleString()}`,
      icon: Icons.donation,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Donations',
      value: allDonations.length,
      icon: Icons.favorite,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: allDonations.filter(d => d.status === 'completed').length,
      icon: Icons.success,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tax Savings',
      value: `₹${Math.round(totalDonated * 0.5).toLocaleString()}`,
      icon: Icons.award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Donations
        </h1>
        <p className="text-gray-600">
          Track your donation history, download receipts, and see your impact.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.filter className="w-5 h-5 text-blue-600" />
            Filter Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({allDonations.length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({allDonations.filter(d => d.status === 'completed').length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({allDonations.filter(d => d.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'failed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              Failed ({allDonations.filter(d => d.status === 'failed').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.donation className="w-5 h-5 text-green-600" />
            Donation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDonations.length > 0 ? (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{donation.purpose}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">To: {donation.ngoName}</p>
                      <p className="text-sm text-gray-500">Receipt: #{donation.receiptNumber}</p>
                      {donation.isAnonymous && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-2">
                          <Icons.view className="w-3 h-3" />
                          Anonymous Donation
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₹{donation.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">{donation.date}</div>
                      {donation.status === 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownloadReceipt(donation.id)}
                          disabled={downloadingReceipt === donation.id}
                          className="flex items-center gap-2"
                        >
                          {downloadingReceipt === donation.id ? (
                            <Icons.refresh className="w-4 h-4" />
                          ) : (
                            <Icons.download className="w-4 h-4" />
                          )}
                          Download Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {donation.status === 'completed' && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tax Deduction (50%):</span>
                        <span className="font-medium text-purple-600">₹{Math.round(donation.amount * 0.5).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icons.donation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "You haven't made any donations yet. Start making a difference today!" 
                  : `No ${filter} donations found. Try a different filter.`}
              </p>
              <Button variant="primary">
                Make a Donation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Benefits Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.info className="w-5 h-5 text-blue-600" />
            Tax Benefits Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Section 80G Benefits</h4>
              <p className="text-blue-800 text-sm mb-3">
                Your donations are eligible for tax deduction under Section 80G of the Income Tax Act.
              </p>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• 50% tax deduction on donation amount</li>
                <li>• Valid for registered NGOs only</li>
                <li>• Keep receipts for tax filing</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Annual Tax Summary</h4>
              <p className="text-green-800 text-sm mb-3">
                Download consolidated tax summary at year-end for easy filing.
              </p>
              <div className="space-y-2 text-green-700 text-sm">
                <div className="flex justify-between">
                  <span>Total Donations:</span>
                  <span className="font-medium">₹{totalDonated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Savings:</span>
                  <span className="font-medium">₹{Math.round(totalDonated * 0.5).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 p-4 h-auto">
              <Icons.donation className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Make New Donation</div>
                <div className="text-sm text-gray-600">Support a cause you care about</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 p-4 h-auto">
              <Icons.document className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Annual Tax Summary</div>
                <div className="text-sm text-gray-600">Download yearly donation summary</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 p-4 h-auto">
              <Icons.phone className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Support</div>
                <div className="text-sm text-gray-600">Get help with donations</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsPage;
