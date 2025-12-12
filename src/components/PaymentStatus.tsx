import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';

interface PaymentStatusProps {
  paymentId: string;
  onStatusChange?: (status: string, payment: any) => void;
  showDetails?: boolean;
}

interface PaymentStatusData {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentType: string;
  gateway: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  customer: {
    name: string;
    email: string;
  };
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  paymentId, 
  onStatusChange, 
  showDetails = true 
}) => {
  const [payment, setPayment] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const socket = useSocket();

  useEffect(() => {
    // Load initial payment data
    loadPaymentData();

    // Subscribe to real-time payment updates
    if (socket) {
      socket.on('payment:completed', handlePaymentCompleted);
      socket.on('payment:failed', handlePaymentFailed);
      socket.on('payment:refunded', handlePaymentRefunded);
      socket.on('payment:status_updated', handlePaymentStatusUpdated);

      return () => {
        socket.off('payment:completed');
        socket.off('payment:failed');
        socket.off('payment:refunded');
        socket.off('payment:status_updated');
      };
    }
  }, [socket, paymentId]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setPayment(data.data);
        setLastUpdate(new Date());
      } else {
        setError(data.message || 'Failed to load payment data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompleted = (data: any) => {
    if (data.paymentId === paymentId) {
      setPayment(prev => prev ? { ...prev, status: 'completed', completedAt: new Date().toISOString() } : null);
      setLastUpdate(new Date());
      onStatusChange?.('completed', data);
    }
  };

  const handlePaymentFailed = (data: any) => {
    if (data.paymentId === paymentId) {
      setPayment(prev => prev ? { ...prev, status: 'failed', failureReason: data.reason } : null);
      setLastUpdate(new Date());
      onStatusChange?.('failed', data);
    }
  };

  const handlePaymentRefunded = (data: any) => {
    if (data.paymentId === paymentId) {
      setPayment(prev => prev ? { ...prev, status: 'refunded' } : null);
      setLastUpdate(new Date());
      onStatusChange?.('refunded', data);
    }
  };

  const handlePaymentStatusUpdated = (data: any) => {
    if (data.paymentId === paymentId) {
      setPayment(prev => prev ? { ...prev, status: data.status } : null);
      setLastUpdate(new Date());
      onStatusChange?.(data.status, data);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Pending',
          description: 'Waiting for payment confirmation'
        };
      case 'processing':
        return {
          icon: <RefreshCw className="w-6 h-6 animate-spin" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Processing Payment',
          description: 'Your payment is being processed'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payment Successful',
          description: 'Your payment has been completed successfully'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          description: payment?.failureReason || 'Payment could not be processed'
        };
      case 'refunded':
        return {
          icon: <RefreshCw className="w-6 h-6" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          title: 'Payment Refunded',
          description: 'Your payment has been refunded'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Payment Cancelled',
          description: 'Payment was cancelled'
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          description: 'Payment status is unknown'
        };
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <XCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadPaymentData}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <AlertCircle className="w-12 h-12 text-gray-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Not Found</h3>
            <p className="text-gray-600">Unable to find payment information</p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(payment.status);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={payment.status}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.borderColor} overflow-hidden`}
      >
        <div className={`${statusConfig.bgColor} p-6`}>
          <div className="flex items-center space-x-4">
            <div className={`${statusConfig.color} p-3 rounded-full bg-white`}>
              {statusConfig.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {statusConfig.title}
              </h3>
              <p className="text-gray-600 mt-1">
                {statusConfig.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(payment.amount, payment.currency)}
              </div>
              <div className="text-sm text-gray-500">
                {payment.paymentType.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{payment.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gateway:</span>
                    <span className="font-medium capitalize">{payment.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(payment.createdAt)}</span>
                  </div>
                  {payment.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{formatDate(payment.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{payment.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{payment.customer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Status Indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Last updated: {formatDate(lastUpdate.toISOString())}
                </span>
              </div>
              <button
                onClick={loadPaymentData}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentStatus;
