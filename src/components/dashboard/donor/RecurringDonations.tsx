import React, { useState, useEffect } from 'react';
import { Calendar, PauseCircle, PlayCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface RecurringDonation {
  id: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  ngoId: string;
  ngoName: string;
  programName?: string;
  startDate: string;
  nextDate: string;
  status: 'active' | 'paused' | 'cancelled';
  totalDonated: number;
  paymentMethod: string;
}

const RecurringDonations: React.FC = () => {
  const [donations, setDonations] = useState<RecurringDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [, setEditingDonation] = useState<RecurringDonation | null>(null);

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchRecurringDonations = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockDonations: RecurringDonation[] = [
            {
              id: 'rec-1',
              amount: 1000,
              frequency: 'monthly',
              ngoId: 'ngo-1',
              ngoName: 'Care Foundation',
              programName: 'Education for All',
              startDate: '2023-03-15',
              nextDate: '2023-08-15',
              status: 'active',
              totalDonated: 5000,
              paymentMethod: 'Credit Card'
            },
            {
              id: 'rec-2',
              amount: 5000,
              frequency: 'quarterly',
              ngoId: 'ngo-2',
              ngoName: 'Hope Initiative',
              startDate: '2023-01-01',
              nextDate: '2023-10-01',
              status: 'active',
              totalDonated: 15000,
              paymentMethod: 'Net Banking'
            },
            {
              id: 'rec-3',
              amount: 2500,
              frequency: 'monthly',
              ngoId: 'ngo-3',
              ngoName: 'Green Earth',
              programName: 'Tree Plantation Drive',
              startDate: '2022-11-10',
              nextDate: '2023-08-10',
              status: 'paused',
              totalDonated: 22500,
              paymentMethod: 'UPI'
            }
          ];

          setDonations(mockDonations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recurring donations', error);
        setLoading(false);
      }
    };

    fetchRecurringDonations();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = (donationId: string, currentStatus: 'active' | 'paused' | 'cancelled') => {
    // In a real app, this would call an API
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    setDonations(prev => 
      prev.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: newStatus as 'active' | 'paused' | 'cancelled' } 
          : donation
      )
    );
  };

  const handleEdit = (donation: RecurringDonation) => {
    setEditingDonation(donation);
    setIsEditModalOpen(true);
  };

  const handleCancelConfirmation = (donationId: string) => {
    setSelectedDonationId(donationId);
    setIsCancelModalOpen(true);
  };

  const handleCancelRecurring = () => {
    if (!selectedDonationId) return;
    
    // In a real app, this would call an API
    setDonations(prev => 
      prev.map(donation => 
        donation.id === selectedDonationId 
          ? { ...donation, status: 'cancelled' as 'active' | 'paused' | 'cancelled' } 
          : donation
      )
    );
    
    setIsCancelModalOpen(false);
    setSelectedDonationId(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recurring Donations</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Manage your recurring donations and payment schedules
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {donations.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring donations</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't set up any recurring donations yet.
                  </p>
                  <Button variant="primary">
                    Set up a recurring donation
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {donations.map(donation => (
                    <div 
                      key={donation.id}
                      className={`border rounded-lg p-4 ${donation.status === 'cancelled' ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {donation.ngoName}
                            </h3>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs ${getStatusColor(donation.status)}`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </div>
                          {donation.programName && (
                            <p className="text-sm text-gray-600 mb-1">
                              Program: {donation.programName}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-1">
                            Started on {formatDate(donation.startDate)}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span className="font-medium text-primary-600">{formatCurrency(donation.amount)}</span>
                            <span className="mx-1">•</span>
                            <span>{donation.frequency.charAt(0).toUpperCase() + donation.frequency.slice(1)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Total donated:</span>
                            <span className="font-medium ml-1">{formatCurrency(donation.totalDonated)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          {donation.status !== 'cancelled' && (
                            <div className="text-sm mb-3">
                              <span className="text-gray-500">Next donation:</span>
                              <span className="ml-1 font-medium">{formatDate(donation.nextDate)}</span>
                            </div>
                          )}
                          <div className="flex space-x-2 justify-start md:justify-end">
                            {donation.status !== 'cancelled' && (
                              <>
                                <button
                                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
                                  onClick={() => handleEdit(donation)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none"
                                  onClick={() => handleStatusToggle(donation.id, donation.status)}
                                >
                                  {donation.status === 'active' ? (
                                    <>
                                      <PauseCircle className="w-4 h-4 mr-1" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-1" />
                                      Resume
                                    </>
                                  )}
                                </button>
                                <button
                                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none"
                                  onClick={() => handleCancelConfirmation(donation.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Cancel
                                </button>
                              </>
                            )}
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
      
      {/* Edit Modal - In a real app, you'd implement the modal with an actual form */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Recurring Donation
            </h3>
            <p className="mb-6 text-gray-600">
              This would be a form to edit the recurring donation details
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
                onClick={() => setIsEditModalOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCancelModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Recurring Donation?
                </h3>
              </div>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this recurring donation? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setIsCancelModalOpen(false)}
              >
                No, Keep It
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleCancelRecurring}
              >
                Yes, Cancel Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecurringDonations;
