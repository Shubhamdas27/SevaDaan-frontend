import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Define types
interface Donation {
  id: string;
  ngo: {
    id: string;
    name: string;
    logo?: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod?: string;
  paymentId?: string;
  transactionId?: string;
  orderId?: string;
  program?: {
    id: string;
    name: string;
  };
}

const DonationHistory: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedDonation, setExpandedDonation] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get('/api/v1/donations/user');
        setDonations(response.data.data);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
        toast.error('Failed to load donation history');
      } finally {
        setIsLoading(false);
      }
    };    fetchDonations();
  }, [user, toast]);

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await axios.get(`/api/v1/donations/receipt/${donationId}`, {
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donation-receipt-${donationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const toggleDetails = (donationId: string) => {
    if (expandedDonation === donationId) {
      setExpandedDonation(null);
    } else {
      setExpandedDonation(donationId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No donations yet</h3>
          <p className="text-gray-500 mb-4">You haven't made any donations yet</p>
          <Button onClick={() => window.location.href = '/ngos'}>
            Explore NGOs
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Donation History</h2>
      
      {donations.map((donation) => (
        <Card key={donation.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {donation.ngo.logo && (
                <img 
                  src={donation.ngo.logo} 
                  alt={donation.ngo.name} 
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{donation.ngo.name}</h3>
                {donation.program && (
                  <p className="text-sm text-gray-600">Program: {donation.program.name}</p>
                )}
                <p className="text-sm text-gray-500">{formatDate(donation.date)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-lg ${donation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {formatCurrency(donation.amount, donation.currency)}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                donation.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
              </div>
            </div>
          </div>
          
          {donation.message && (
            <div className="mt-2 text-sm text-gray-600 italic">
              "{donation.message}"
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toggleDetails(donation.id)}
              className="text-gray-500 hover:text-gray-700"
              rightIcon={expandedDonation === donation.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              {expandedDonation === donation.id ? 'Hide Details' : 'View Details'}
            </Button>
                {donation.status === 'completed' && (
              <div className="flex gap-2">
                <Link 
                  to={`/donations/${donation.id}/receipt`} 
                  className="btn btn-sm btn-outline"
                >
                  View Receipt
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadReceipt(donation.id)}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
          
          {expandedDonation === donation.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
              <h4 className="font-medium mb-2">Payment Details</h4>
              <div className="space-y-1">
                {donation.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{donation.paymentMethod}</span>
                  </div>
                )}
                {donation.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">{donation.transactionId}</span>
                  </div>
                )}
                {donation.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono">{donation.paymentId}</span>
                  </div>
                )}
                {donation.orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono">{donation.orderId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation ID:</span>
                  <span className="font-mono">{donation.id}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default DonationHistory;
