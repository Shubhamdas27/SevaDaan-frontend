import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import PaymentHistory from './PaymentHistory';
import { CreditCard, History, Settings, Plus } from 'lucide-react';

interface PaymentDemoProps {
  userRole?: 'user' | 'admin';
}

const PaymentDemo: React.FC<PaymentDemoProps> = ({ userRole = 'user' }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'status' | 'history'>('new');
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const tabs = [
    {
      id: 'new',
      label: 'New Payment',
      icon: <Plus className="w-5 h-5" />,
      description: 'Create a new payment'
    },
    {
      id: 'status',
      label: 'Payment Status',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Check payment status'
    },
    {
      id: 'history',
      label: 'Payment History',
      icon: <History className="w-5 h-5" />,
      description: 'View payment history'
    }
  ];

  const handlePaymentSuccess = (payment: any) => {
    setCurrentPayment(payment);
    setActiveTab('status');
    setShowPaymentForm(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'new':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create New Payment
              </h2>
              <p className="text-gray-600 mb-8">
                Test the payment system with different scenarios
              </p>
            </div>

            {!showPaymentForm ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Scenarios */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Scenarios
                  </h3>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900">Donation Payment</h4>
                        <p className="text-sm text-blue-700">Make a donation to support our cause</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">₹500</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-900">Program Fee</h4>
                        <p className="text-sm text-green-700">Pay for program registration</p>
                      </div>
                      <div className="text-2xl font-bold text-green-900">₹1,000</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-purple-900">Certification Fee</h4>
                        <p className="text-sm text-purple-700">Pay for certification course</p>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">₹2,500</div>
                    </div>
                  </motion.button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Features
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                        <p className="text-sm text-gray-600">Get instant payment status updates</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Multiple Gateways</h4>
                        <p className="text-sm text-gray-600">Support for Razorpay, Stripe, and PayPal</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Secure Processing</h4>
                        <p className="text-sm text-gray-600">Bank-level security with SSL encryption</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Payment History</h4>
                        <p className="text-sm text-gray-600">Complete transaction records and receipts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <PaymentForm
                amount={500}
                currency="INR"
                paymentType="donation"
                description="Test donation payment"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={() => setShowPaymentForm(false)}
              />
            )}
          </div>
        );

      case 'status':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Status
              </h2>
              <p className="text-gray-600 mb-8">
                Real-time payment status monitoring
              </p>
            </div>

            {currentPayment ? (
              <PaymentStatus
                paymentId={currentPayment.paymentId}
                onStatusChange={(status, payment) => {
                  console.log('Status changed:', status, payment);
                }}
                showDetails={true}
              />
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Payment Selected
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a payment first to see real-time status updates
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Payment
                </button>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment History
              </h2>
              <p className="text-gray-600 mb-8">
                Complete transaction history and management
              </p>
            </div>

            <PaymentHistory 
              showAllPayments={userRole === 'admin'}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SevaDaan Payment System
          </h1>
          <p className="text-xl text-gray-600">
            Secure, Real-time Payment Processing for NGO Operations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 p-6 text-center transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 border-b-2 border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      activeTab === tab.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {tab.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {renderTabContent()}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>
            Phase 2: Payment Gateway Integration - Complete with Real-time Updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDemo;
