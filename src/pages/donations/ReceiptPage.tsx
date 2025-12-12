import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/common/Layout';
import DonationReceipt from '../../components/donations/DonationReceipt';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Printer, Download, AlertCircle } from 'lucide-react';

interface DonationDetails {
  id: string;
  ngo: {
    id: string;
    name: string;
    address?: string;
    regNumber?: string;
    taxId?: string;
  };
  amount: number;
  currency: string;
  date: string;
  status: string;
  paymentMethod?: string;
  paymentId?: string;
  transactionId?: string;
  orderId?: string;
  isAnonymous: boolean;
  program?: {
    id: string;
    name: string;
  };
  donor?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    pan?: string;
  };
}

const ReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!id) {
        setError('Donation ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/donations/${id}`);
        setDonation(response.data);
      } catch (err: any) {
        console.error('Failed to fetch donation details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load donation details');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [id]);

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(`/api/v1/donations/${id}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donation-receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download receipt:', err);
      alert('Failed to download the receipt. Please try again later.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !donation) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="p-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Error Loading Receipt</h2>
              <p className="text-gray-600 mb-4">{error || 'Unable to find the donation details.'}</p>
              <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Link to="/donations/history" className="btn btn-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Donations
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center print:hidden">
            <Link to="/donations/history" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Donation History
            </Link>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handlePrint}
                leftIcon={<Printer className="h-4 w-4" />}
              >
                Print
              </Button>
              <Button 
                variant="primary"
                onClick={handleDownloadPdf}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download PDF
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <DonationReceipt donation={donation} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReceiptPage;
