import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
// import { Textarea } from '../ui/Textarea';
// Update the import path below if Textarea exists elsewhere:
import { Textarea } from '../ui/Textarea';
// Or, if the correct path is different, update accordingly:
// import { Textarea } from '../../ui/Textarea';
// If you do not have a Textarea component, you can use a native textarea:
// const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />;
// import { Checkbox } from '../ui/Checkbox';
import { Checkbox } from '../ui/Checkbox';
import { Card } from '../ui/Card';
import { AlertCircle } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { loadRazorpayScript, initializeDonationPayment, RazorpayResponse } from '../../lib/razorpay';
import PaymentErrorHandler from '../payments/PaymentErrorHandler';

// Define types for props
interface DonationFormProps {
  ngoId: string;
  ngoName: string;
  programId?: string;
  programName?: string;
}

// We don't need to define RazorpayOptions here as it's already in razorpay.ts

const DonationForm: React.FC<DonationFormProps> = ({ 
  ngoId, 
  ngoName, 
  programId, 
  programName 
}) => {
  // State management
  const [amount, setAmount] = useState<string>('1000');
  const [currency, setCurrency] = useState<string>('INR');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  const [pendingDonationId, setPendingDonationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpay = async () => {
      const isLoaded = await loadRazorpayScript();
      setIsRazorpayReady(isLoaded);
      if (!isLoaded) {
        setError('Payment system could not be loaded. Please try again later.');
        setErrorCode('SCRIPT_LOAD_ERROR');
      }
    };

    loadRazorpay();
  }, []);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and leading zeros
    const value = e.target.value.replace(/^0+/, '').replace(/[^0-9]/g, '');
    setAmount(value);
  };

  // Create payment description
  const getPaymentDescription = () => {
    return programName 
      ? `Donation to ${programName} program by ${ngoName}`
      : `Donation to ${ngoName}`;
  };

  // Function to retry payment with existing donation ID
  const retryPayment = async () => {
    if (!pendingDonationId) {
      setError('Cannot retry payment. Please try again with a new donation.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setErrorCode(null);
      
      // Get the existing donation details from the server
      const response = await axios.get(`/api/v1/donations/${pendingDonationId}/retry`);
      const { orderId, razorpay, id } = response.data;
      
      if (!razorpay || !orderId) {
        throw new Error('Invalid payment data received from server');
      }
      
      // Initialize payment again with the same donation
      await initializePayment(id, orderId, razorpay);
      
    } catch (error: any) {
      console.error('Retry payment failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to retry payment';
      setError(errorMessage);
      setErrorCode('RETRY_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize payment with Razorpay
  const initializePayment = async (id: string, orderId: string, razorpay: any) => {
    // Handle successful payment verification
    const handlePaymentSuccess = async (response: RazorpayResponse) => {
      try {
        // Verify payment with backend
        await axios.post(`/api/v1/donations/${id}/complete`, {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
        
        toast.success('Thank you for your donation!');
        
        // Navigate to success page with donation ID
        navigate(`/donation-success?id=${id}`);
      } catch (error: any) {
        console.error('Payment verification failed:', error);
        const errorMessage = error.response?.data?.message || 'Payment verification failed';
        setError(errorMessage);
        setErrorCode('VERIFICATION_FAILED');
        setPendingDonationId(id);
        
        // Navigate to donation history as the payment might have been processed
        setTimeout(() => {
          navigate('/donations/history');
        }, 3000);
      }
    };
    
    // Handle payment error
    const handlePaymentError = (error: any) => {
      console.error('Payment failed:', error);
      let errorMessage = 'Payment process failed. Please try again.';
      let errorCode = 'PAYMENT_FAILED';
      
      // Extract more detailed error information if available
      if (typeof error === 'object') {
        if (error.error) {
          errorMessage = error.error.description || errorMessage;
          errorCode = error.error.code || errorCode;
        } else if (error.message) {
          errorMessage = error.message;
          if (error.message.includes('cancelled')) {
            errorCode = 'PAYMENT_CANCELED';
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      setErrorCode(errorCode);
      setPendingDonationId(id);
      setIsLoading(false);
    };
    
    // Initialize payment
    await initializeDonationPayment(
      {
        id,
        orderId,
        razorpay: {
          key: razorpay.key,
          amount: razorpay.amount,
          currency: razorpay.currency,
          orderId: razorpay.orderId,
          prefill: razorpay.prefill,
          notes: razorpay.notes
        }
      },
      getPaymentDescription(),
      handlePaymentSuccess,
      handlePaymentError
    );
  };

  // Handle donation submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous errors
    setError(null);
    setErrorCode(null);
    setPendingDonationId(null);
    
    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate minimum amount based on currency
    const minAmount = currency === 'INR' ? 10 : 1;
    if (parseFloat(amount) < minAmount) {
      setError(`Minimum donation amount is ${currency === 'INR' ? '₹' : '$'}${minAmount}`);
      toast.error(`Minimum donation amount is ${currency === 'INR' ? '₹' : '$'}${minAmount}`);
      return;
    }

    // Validate Razorpay loading
    if (!isRazorpayReady) {
      setError('Payment system is not ready. Please refresh the page.');
      setErrorCode('SYSTEM_NOT_READY');
      toast.error('Payment system is not ready');
      return;
    }

    setIsLoading(true);

    try {
      // Create donation on the server
      const response = await axios.post('/api/v1/donations', {
        ngoId,
        amount: parseFloat(amount),
        currency,
        message: message.trim() || undefined,
        isAnonymous,
        paymentMethod: 'razorpay',
        programId: programId || undefined,
      });

      const { orderId, razorpay, id } = response.data;
      
      if (!razorpay || !orderId) {
        throw new Error('Invalid payment data received from server');
      }
      
      // Save pending donation ID in case we need to retry
      setPendingDonationId(id);
      
      // Initialize payment with Razorpay
      await initializePayment(id, orderId, razorpay);
      
    } catch (error: any) {
      console.error('Donation failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process donation';
      setError(errorMessage);
      setErrorCode('SERVER_ERROR');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined donation amounts
  const predefinedAmounts = [500, 1000, 2000, 5000];

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
      <p className="mb-4">
        Your donation will support {programName ? `the ${programName} program by` : ''} {ngoName}.
      </p>

      {error && errorCode ? (
        <PaymentErrorHandler 
          error={error}
          errorCode={errorCode}
          retryPayment={pendingDonationId ? retryPayment : undefined}
          donationId={pendingDonationId || undefined}
        />
      ) : error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Predefined amounts */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {predefinedAmounts.map((preAmount) => (
            <Button
              key={preAmount}
              type="button"
              onClick={() => setAmount(preAmount.toString())}
              variant={amount === preAmount.toString() ? "primary" : "outline"}
              className="w-full"
            >
              {currency === 'INR' ? '₹' : '$'}{preAmount}
            </Button>
          ))}
        </div>

        {/* Custom amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount ({currency === 'INR' ? '₹' : '$'})
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="currency"
              aria-label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-16 rounded-md border border-gray-300 p-2"
            >
              <option value="INR">₹</option>
              <option value="USD">$</option>
            </select>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              required
              className="flex-1"
              aria-describedby="amount-error"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum donation: {currency === 'INR' ? '₹10' : '$1'}
          </p>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message (Optional)
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Your message to the NGO..."
            maxLength={200}
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-500 mt-1">
              {message.length}/200
            </span>
          </div>
        </div>

        {/* Anonymous donation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked: boolean | 'indeterminate') => setIsAnonymous(checked === true)}
          />
          <label htmlFor="anonymous" className="text-sm">
            Make this donation anonymous
          </label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading || !amount || !isRazorpayReady}
          className="w-full"
        >
          {isLoading ? 'Processing...' : `Donate ${currency === 'INR' ? '₹' : '$'}${amount || '0'}`}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        <span role="img" aria-label="secure">🔒</span> Secure payment powered by Razorpay
      </div>
    </Card>
  );
};

export default DonationForm;
