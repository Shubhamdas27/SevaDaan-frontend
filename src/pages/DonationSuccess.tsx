import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, RefreshCw, Download, AlertTriangle, ArrowLeft, Printer } from 'lucide-react';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { useDonations } from '../hooks/useApiHooks';
import { Donation } from '../types';
import { formatCurrency, formatDate, calculateTaxBenefit } from '../utils/formatters';

interface DonationWithNGO extends Donation {
  ngo: {
    id: string;
    name: string;
    logo: string;
  }
}

const DonationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('id');
  // Get donation data to display appropriate UI
  const [donation, setDonation] = useState<DonationWithNGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Download receipt state removed as we're using direct link

  // Get the getDonationById function from the custom hook
  const { getDonationById } = useDonations();

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!donationId) {
        setError('Donation ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const donationData = await getDonationById(donationId);
        setDonation(donationData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch donation details');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [donationId, getDonationById]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // Function to print receipt
  const handlePrintReceipt = () => {
    window.print();
  };
  // Receipt is now handled by the ReceiptPage component

  if (loading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-lg mx-auto text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Fetching your donation details...</h2>
            <p className="text-slate-600 dark:text-slate-400">This will only take a moment.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !donation) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 text-error-600 mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {error || "We couldn't fetch your donation details."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="ghost" onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Try again
                </Button>
                <Link to="/" className="btn btn-primary inline-flex items-center">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Calculate tax benefit amount (50% of donation amount by default)
  const taxBenefit = calculateTaxBenefit(donation.amount);
  // Define status flags for conditional rendering
  const isSuccessful = donation.status === 'completed';
  const isPending = donation.status === 'pending';

  // Define the header based on payment status
  const getStatusHeader = () => {
    if (isSuccessful) {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You For Your Donation!</h1>
          <p className="text-white/90">
            Your contribution will make a real difference in the lives of those we serve.
          </p>
        </>
      );
    } else if (isPending) {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <Spinner className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Donation is Being Processed</h1>
          <p className="text-white/90">
            We're currently processing your payment. This usually takes just a moment.
          </p>
        </>
      );
    } else {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Issue Detected</h1>
          <p className="text-white/90">
            There was an issue processing your donation. Please check your payment details.
          </p>
        </>
      );
    }
  };

  // Get the appropriate background gradient based on status
  const getBgGradient = () => {
    if (isSuccessful) return "from-success-600 to-success-700";
    if (isPending) return "from-warning-600 to-warning-700";
    return "from-error-600 to-error-700";
  };

  return (
    <Layout>
      <div className={`bg-gradient-to-br ${getBgGradient()} py-16 text-white print:hidden`}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {getStatusHeader()}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="print:shadow-none">
            <CardContent className="p-6 md:p-8">
              <div className="print:hidden mb-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold dark:text-white">Donation Details</h2>
                  <Badge 
                    variant={
                      isSuccessful ? 'success' : 
                      isPending ? 'warning' : 'error'
                    }
                    className="text-sm"
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Print-only header */}
              <div className="hidden print:block mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold">SevaDaan NGO Platform</h1>
                    <p className="text-gray-600">Donation Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Date: {formatDate(donation.date)}</p>
                    <p className="text-gray-600">Reference ID: {donation.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Amount</span>
                  <span className="text-xl font-semibold dark:text-white">
                    {formatCurrency(donation.amount, donation.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Organization</span>
                  <Link 
                    to={`/ngo/${donation.ngoId}`}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 print:text-black print:no-underline"
                  >
                    {donation.ngo.logo && (
                      <img 
                        src={donation.ngo.logo} 
                        alt={donation.ngo.name} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span>{donation.ngo.name}</span>
                  </Link>
                </div>

                <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Date</span>
                  <span className="dark:text-white">
                    {formatDate(donation.date)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <Badge 
                    variant={
                      isSuccessful ? 'success' : 
                      isPending ? 'warning' : 'error'
                    }
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Reference ID</span>
                  <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded dark:text-white">
                    {donation.id}
                  </span>
                </div>

                {donation.paymentId && (
                  <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Payment ID</span>
                    <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded dark:text-white">
                      {donation.paymentId}
                    </span>
                  </div>
                )}

                {isSuccessful && (
                  <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Tax Benefit (80G)</span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(taxBenefit, donation.currency)}
                    </span>
                  </div>
                )}

                {donation.message && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Message</h3>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                      "{donation.message}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-6">
                {isSuccessful ? (
                  <>
                    <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-md">
                      <p className="text-sm text-success-700 dark:text-success-400">
                        You'll receive a confirmation email with the tax receipt shortly.
                        Thank you for your generous support!
                      </p>
                    </div>

                    <div className="flex justify-center mb-4 print:hidden">
                      <Link to={`/donations/${donation.id}/receipt`} className="btn btn-success w-full">
                        <Download className="w-4 h-4 mr-2" /> View & Download Receipt
                      </Link>
                    </div>
                  </>
                ) : isPending ? (
                  <div className="p-4 bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-md">
                    <p className="text-sm text-warning-700 dark:text-warning-400">
                      Your donation is being processed. We'll update you via email once confirmed.
                      This typically takes a few moments, but may take longer in some cases.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-md">
                    <p className="text-sm text-error-700 dark:text-error-400">
                      We encountered an issue processing your donation. This could be due to insufficient funds,
                      payment limits, or a technical error. Please try again or contact your bank for assistance.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                  <Link to="/donations/history" className="btn btn-outline flex-1 text-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Donation History
                  </Link>
                  {isSuccessful && (
                    <Button onClick={handlePrintReceipt} className="flex-1">
                      <Printer className="w-4 h-4 mr-2" /> Print Receipt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DonationSuccess;
