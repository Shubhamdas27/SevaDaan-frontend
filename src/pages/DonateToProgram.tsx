import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Progress } from '../components/ui/Progress';
import { Spinner } from '../components/ui/Spinner';
import { Icons } from '../components/icons';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Program {
  _id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  ngo: {
    _id: string;
    name: string;
    logo?: string;
  };
}

const DonateToProgram: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/programs/${id}`);
      setProgram(response.data.data);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      setAmount(parseInt(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!program || amount < 10) {
      alert('Minimum donation amount is ₹10');
      return;
    }

    if (!user) {
      alert('Please login to donate');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);

      // Create donation with Razorpay integration
      const donationData = {
        programId: program._id,
        ngoId: program.ngo._id,
        amount: amount,
        currency: 'INR',
        message: message,
        isAnonymous: isAnonymous,
        donorName: user.name,
        donorEmail: user.email,
        donorPhone: user.phone || ''
      };

      // Call donation API
      const response = await api.post('/donations', donationData);
      const { orderId, razorpayKeyId } = response.data.data;

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId || 'rzp_test_yourkeyhere', // Test key
        amount: amount * 100, // Amount in paisa
        currency: 'INR',
        name: program.ngo.name,
        description: `Donation to ${program.title}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.post(`/donations/${response.razorpay_order_id}/verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            // Redirect to success page
            navigate('/donation-success', {
              state: {
                amount: amount,
                programTitle: program.title,
                ngoName: program.ngo.name,
                transactionId: response.razorpay_payment_id
              }
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#4F46E5'
        }
      };

      // Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Error processing donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    if (!program) return 0;
    return Math.min((program.raisedAmount / program.targetAmount) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.error className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
          <Button onClick={() => navigate('/programs')}>Browse Programs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <Icons.arrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {program.ngo.logo ? (
                  <img 
                    src={program.ngo.logo} 
                    alt={`${program.ngo.name} logo`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icons.favorite className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h1>
                <p className="text-gray-600 mb-4">{program.ngo.name}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-semibold">
                      {formatCurrency(program.raisedAmount)} of {formatCurrency(program.targetAmount)}
                    </span>
                  </div>
                  <Progress 
                    value={program.raisedAmount} 
                    max={program.targetAmount} 
                    color="success"
                    className="mb-2"
                  />
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {getProgressPercentage().toFixed(1)}% completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.favorite className="w-5 h-5 text-red-500" />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {predefinedAmounts.map((presetAmount) => (
                        <button
                          key={presetAmount}
                          type="button"
                          onClick={() => handleAmountSelect(presetAmount)}
                          className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                            amount === presetAmount && !customAmount
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          ₹{presetAmount}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Leave a message of support..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Anonymous Donation */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={submitting || amount < 10}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {submitting ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : (
                        <Icons.favorite className="w-5 h-5 mr-2" />
                      )}
                      {submitting ? 'Processing...' : `Donate ${formatCurrency(amount)}`}
                    </Button>
                    
                    <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                      <Icons.shield className="w-4 h-4 mr-1" />
                      Secured by Razorpay
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Program Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About this Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {program.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Amount</span>
                    <span className="font-semibold">{formatCurrency(program.targetAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Raised</span>
                    <span className="font-semibold text-green-600">{formatCurrency(program.raisedAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(program.targetAmount - program.raisedAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.success className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Tax Benefits</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    This donation is eligible for tax deduction under Section 80G of the Income Tax Act.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateToProgram;
