import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DonationHistory from '../../components/donations/DonationHistory';
import { Navigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

const DonationHistoryPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login?redirect=/donations/history" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Donations</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DonationHistory />
        </div>
        
        <div>
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-3">Donation Impact</h2>
            <p className="text-gray-700 mb-4">
              Your contributions make a real difference in the lives of those in need. Thank you for your generosity!
            </p>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Tax Benefits</h3>
              <p className="text-sm text-gray-600 mb-3">
                All donations to verified NGOs on our platform are eligible for tax benefits under Section 80G of the Income Tax Act.
              </p>
              
              <h3 className="font-semibold mb-2">Donation Receipts</h3>
              <p className="text-sm text-gray-600">
                You can download receipts for your donations from this page. These receipts can be used for tax deduction purposes.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryPage;
