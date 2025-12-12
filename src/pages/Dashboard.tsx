import React from 'react';
import { DashboardContainer } from '../components/dashboard/DashboardContainer';
import { useAuth } from '../context/AuthContext';
import '../components/dashboard/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div>
          <div className="dashboard-error-icon">🔒</div>
          <p className="dashboard-error-message">Please log in to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <DashboardContainer />
      </div>
    </div>
  );
};

export default Dashboard;
