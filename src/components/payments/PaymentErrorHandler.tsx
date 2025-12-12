import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PaymentErrorHandlerProps {
  error: string;
  errorCode?: string;
  retryPayment?: () => void;
  donationId?: string;
}

/**
 * Payment Error Handler Component
 * Displays user-friendly error messages based on Razorpay error codes
 * and provides appropriate actions for users to take
 */
const PaymentErrorHandler: React.FC<PaymentErrorHandlerProps> = ({ 
  error, 
  errorCode, 
  retryPayment,
  donationId
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  // Handle retry payment
  const handleRetry = async () => {
    if (!retryPayment) return;
    
    setIsRetrying(true);
    try {
      await retryPayment();
    } catch (error) {
      console.error('Failed to retry payment:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Get user-friendly error message based on error code
  const getUserFriendlyMessage = () => {
    if (!errorCode) return null;

    switch (errorCode) {
      case 'BAD_REQUEST_ERROR':
        return 'There was a problem with your request. Please check your information and try again.';
      case 'GATEWAY_ERROR':
        return 'We encountered an issue connecting to the payment gateway. Please try again later.';
      case 'SERVER_ERROR':
        return 'Our server encountered an error while processing your payment. Please try again.';
      case 'PAYMENT_CANCELED':
        return 'Your payment was canceled. You can try again when you\'re ready.';
      case 'PAYMENT_FAILED':
        return 'Your payment could not be processed. This might be due to insufficient funds or bank restrictions.';
      default:
        return null;
    }
  };

  const friendlyMessage = getUserFriendlyMessage();

  return (
    <Card className="p-6 my-4">
      <div className="flex items-start gap-4">
        <div className="bg-error-100 p-2 rounded-full">
          <AlertTriangle className="w-6 h-6 text-error-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Payment Failed</h3>
          <p className="text-gray-700 mb-2">{error}</p>
          {friendlyMessage && (
            <p className="text-sm text-gray-600 mb-4">{friendlyMessage}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {retryPayment && (
              <Button 
                onClick={handleRetry} 
                isLoading={isRetrying}
                leftIcon={!isRetrying ? <RefreshCw className="w-4 h-4" /> : undefined}
              >
                Try Again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/donations/history')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Donation History
            </Button>
            {donationId && (
              <Link to={`/donation-success?id=${donationId}`} className="btn btn-secondary">
                View Donation
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentErrorHandler;
