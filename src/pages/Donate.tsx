import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, Heart, ArrowRight } from 'lucide-react';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNGOs, useDonations } from '../hooks/useApiHooks';
import { NGO } from '../types';
import { initializeDonationPayment, RazorpayResponse } from '../lib/razorpay';

const DonationAmounts = [100, 500, 1000, 5000, 10000];

const Donate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNGOById } = useNGOs();
  const { createDonation } = useDonations();
  
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNGO = async () => {
      if (!id) {
        setError('NGO ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ngoData = await getNGOById(id);
        setNgo(ngoData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load NGO details');
        setNgo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNGO();
  }, [id, getNGOById]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      setAmount(parseInt(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('NGO ID not provided');
      return;
    }
    
    // Reset previous errors and success messages
    setError(null);
    setSuccessMessage(null);
    
    try {
      setLoading(true);
      const donationData = {
        ngoId: id,
        amount: amount,
        currency: 'INR',
        isAnonymous: isAnonymous,
        message: message,
        paymentMethod: 'razorpay' // Using Razorpay as payment method
      };
      
      // Create donation and get Razorpay order details
      const result = await createDonation(donationData);
      
      if (result.orderId && result.razorpay && ngo) {
        const paymentDescription = `Donation to ${ngo.name}`;
        
        // Handle successful payment verification
        const handlePaymentSuccess = async (response: RazorpayResponse) => {
          try {
            // Verify payment with backend
            await fetch(`/api/v1/donations/${result.id}/complete`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            // Show success message
            setSuccessMessage('Donation successful! Thank you for your contribution.');
            
            // Redirect to success page
            navigate(`/donation-success?id=${result.id}`);
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed. Please contact support.');
          }
        };
        
        // Handle payment error
        const handlePaymentError = (error: any) => {
          console.error('Payment failed:', error);
          setError('Payment process failed. Please try again.');
          setLoading(false);
        };
        
        // Format the result to match the expected DonationPaymentData structure
        const paymentData = {
          id: result.id,
          orderId: result.orderId || '',
          razorpay: {
            key: result.razorpay.key,
            amount: result.razorpay.amount,
            currency: result.razorpay.currency,
            orderId: result.razorpay.orderId,
            prefill: result.razorpay.prefill,
            notes: result.razorpay.notes
          }
        };
        
        // Initialize payment using our utility function
        await initializeDonationPayment(
          paymentData,
          paymentDescription,
          handlePaymentSuccess,
          handlePaymentError
        );
      } else if (result.paymentUrl) {
        // Fallback to redirect if paymentUrl is provided
        window.location.href = result.paymentUrl;
      } else {
        // Show success message if no payment gateway integration
        setSuccessMessage('Donation successful! Thank you for your contribution.');
        
        // Redirect to a thank you page after a short delay
        setTimeout(() => {
          navigate(`/donation-success?id=${result.id}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!ngo) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold text-error-600 mb-4">NGO Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400">The NGO you're looking for doesn't exist.</p>
          <Link to="/ngos" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Browse NGOs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-accent-600 to-accent-700 py-16 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Support {ngo.name}</h1>
            <p className="text-white/90">
              Your donation will help us continue our mission to make a positive impact in communities.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {DonationAmounts.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={`py-3 px-4 rounded-lg text-center transition-colors ${
                              amount === amt
                                ? 'bg-accent-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => {
                              setAmount(amt);
                              setCustomAmount('');
                            }}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <input
                          type="text"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="input pl-8 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input pl-10 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Expiry Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input pl-10 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            CVV
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="123"
                              className="input pl-10 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a message of support..."
                          className="input w-full h-24 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="h-4 w-4 text-accent-600 border-slate-300 rounded"
                        />
                        <label htmlFor="anonymous" className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                          Make this donation anonymous
                        </label>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 mb-4 bg-error-50 border border-error-200 rounded-md text-error-700 dark:bg-error-900/30 dark:border-error-800 dark:text-error-400">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {successMessage && (
                      <div className="p-3 mb-4 bg-success-50 border border-success-200 rounded-md text-success-700 dark:bg-success-900/30 dark:border-success-800 dark:text-success-400">
                        <p className="text-sm">{successMessage}</p>
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full"
                      isLoading={loading}
                      rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
                    >
                      Donate ₹{amount.toLocaleString()}
                    </Button>

                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                      Your payment is secure and encrypted. By donating, you agree to our terms of service.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Donation Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">Amount</span>
                      <span className="text-xl font-semibold dark:text-white">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">Tax Deduction</span>
                      <Badge variant="success">80G Eligible</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Tax Benefit</span>
                      <span className="font-medium dark:text-white">₹{Math.round(amount * 0.3).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">About {ngo.name}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{ngo.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Badge variant="primary" className="mr-2">Mission</Badge>
                      <span className="text-slate-600 dark:text-slate-400">{ngo.mission}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Badge variant="accent" className="mr-2">Location</Badge>
                      <span className="text-slate-600 dark:text-slate-400">{ngo.city}, {ngo.state}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your donation will help us continue our work in the community. You'll receive a donation receipt
                  and tax certificate via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;