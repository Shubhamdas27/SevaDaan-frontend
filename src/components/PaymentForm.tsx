import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, IndianRupee, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  currency: string;
  paymentType: string;
  description?: string;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface PaymentGatewayConfig {
  razorpay: {
    keyId: string;
    enabled: boolean;
  };
  stripe: {
    publishableKey: string;
    enabled: boolean;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  gateway: string;
  enabled: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  paymentType,
  description,
  onSuccess,
  onError,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      country: 'India',
      postal_code: ''
    }
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [config, setConfig] = useState<PaymentGatewayConfig | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: <IndianRupee className="w-5 h-5" />,
      gateway: 'razorpay',
      enabled: config?.razorpay?.enabled || false
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <CreditCard className="w-5 h-5" />,
      gateway: 'stripe',
      enabled: config?.stripe?.enabled || false
    }
  ];

  useEffect(() => {
    // Load payment gateway configuration
    loadPaymentConfig();
  }, []);

  const loadPaymentConfig = async () => {
    try {
      const response = await fetch('/api/payments/config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        // Set default payment method
        const enabledMethods = paymentMethods.filter(method => data.data[method.gateway]?.enabled);
        if (enabledMethods.length > 0) {
          setSelectedMethod(enabledMethods[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load payment config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      onError('Please select a payment method');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Create payment order
      const orderResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentType,
          description,
          customer: customerInfo,
          gateway: selectedMethod
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Process payment based on selected gateway
      await processPayment(orderData.data, selectedMethod);

    } catch (error: any) {
      setPaymentStatus('failed');
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (orderData: any, gateway: string) => {
    switch (gateway) {
      case 'razorpay':
        await processRazorpayPayment(orderData);
        break;
      case 'stripe':
        await processStripePayment(orderData);
        break;
      default:
        throw new Error('Unsupported payment gateway');
    }
  };

  const processRazorpayPayment = async (orderData: any) => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: config?.razorpay?.keyId,
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency,
        name: 'SevaDaan',
        description: description || `Payment for ${paymentType}`,
        order_id: orderData.gatewayOrderId,
        handler: async (response: any) => {
          await verifyPayment(orderData.paymentId, response);
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('idle');
            setLoading(false);
            onCancel?.();
          }
        }
      };

      const paymentWindow = new (window as any).Razorpay(options);
      paymentWindow.open();
    };
    script.onerror = () => {
      throw new Error('Failed to load Razorpay SDK');
    };
    document.head.appendChild(script);
  };

  const processStripePayment = async (orderData: any) => {
    // Implementation for Stripe payment
    // This would require Stripe SDK integration
    throw new Error('Stripe payment not implemented yet');
  };

  const verifyPayment = async (paymentId: string, gatewayData: any) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentId,
          gatewayData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus('success');
        onSuccess(data.data);
      } else {
        setPaymentStatus('failed');
        onError(data.message || 'Payment verification failed');
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      onError(error.message || 'Payment verification failed');
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return currency;
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Clock className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <CreditCard className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing your payment...';
      case 'success':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return 'Complete your payment';
    }
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto"
      >
        <div className="text-center">
          {getStatusIcon()}
          <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-6">
            Your payment of {getCurrencySymbol(currency)}{amount} has been processed successfully.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuccess({})}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        {getStatusIcon()}
        <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {getStatusMessage()}
        </h3>
        <p className="text-gray-600">
          Amount: {getCurrencySymbol(currency)}{amount}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
          
          <div className="grid gap-3">
            {paymentMethods.filter(method => method.enabled).map((method) => (
              <motion.label
                key={method.id}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Payment Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || paymentStatus === 'processing'}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            loading || paymentStatus === 'processing'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Pay ${getCurrencySymbol(currency)}${amount}`
          )}
        </motion.button>

        {/* Cancel Button */}
        {onCancel && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-6 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </motion.button>
        )}
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            Your payment is secured with 256-bit SSL encryption
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentForm;
