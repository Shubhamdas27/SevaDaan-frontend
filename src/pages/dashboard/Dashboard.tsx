import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHome from '../../components/dashboard/DashboardHome';
import NGODashboard from './NGODashboard';
import NGOAdminDashboard from './NGOAdminDashboard';
import NGOManagerDashboard from './NGOManagerDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import DonorDashboard from './DonorDashboard';
import CitizenDashboard from './CitizenDashboard';
import ProgramsPage from './ProgramsPage';
import ProgramDetailPage from './ProgramDetailPage';
import VolunteerManagement from './VolunteerManagement';
import ReportsAnalytics from './ReportsAnalytics';
import CertificatesPage from './CertificatesPage';
import DonationsPage from './DonationsPage';
import { AIDashboard } from '../../components/dashboard/ai/AIDashboard';
import EnhancedDashboard from '../EnhancedDashboard';
import ExecutiveDashboard from '../ExecutiveDashboard';
import ManageNGOTeam from '../ngo/ManageNGOTeam';
import ServiceApplication from '../../components/dashboard/citizen/ServiceApplication';
import ServiceApplicationForm from '../../components/dashboard/citizen/ServiceApplicationForm';
import ManagerServiceTracker from '../../components/dashboard/ngo/ManagerServiceTracker';
import VolunteerServiceLog from '../../components/dashboard/volunteer/VolunteerServiceLog';
import ComprehensiveSettings from './ComprehensiveSettings';
import OpportunitiesPage from './OpportunitiesPage';
import NotFound from '../NotFound';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('Dashboard render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', !!user);
  console.log('Current location:', location.pathname);
  console.log('User role:', user?.role);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not loading and not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    console.log('Dashboard redirecting to login - not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        {/* Role-based home routes */}
        {user?.role === 'ngo' && <Route path="/" element={<NGODashboard />} />}
        {user?.role === 'ngo_admin' && <Route path="/" element={<NGOAdminDashboard />} />}
        {user?.role === 'ngo_manager' && <Route path="/" element={<NGOManagerDashboard />} />}
        {user?.role === 'volunteer' && <Route path="/" element={<VolunteerDashboard />} />}
        {user?.role === 'donor' && <Route path="/" element={<DonorDashboard />} />}
        {user?.role === 'citizen' && <Route path="/" element={<CitizenDashboard />} />}
        
        {/* Default home route */}
        <Route path="/" element={<DashboardHome />} />
        
        {/* NGO specific routes */}
        {user?.role === 'ngo' && (
          <>
            <Route path="/volunteers" element={<VolunteerManagement />} />
            <Route path="/grants" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4">Grants Management</h1><p className="text-gray-600">Track and manage grant applications and funding. (Demo)</p></div>} />
          </>
        )}
        
        {/* NGO Admin specific routes */}
        {user?.role === 'ngo_admin' && (
          <>
            <Route path="/manage-ngo" element={<ManageNGOTeam />} />
            <Route path="/volunteers" element={<VolunteerManagement />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
          </>
        )}
        
        {/* NGO Manager specific routes */}
        {user?.role === 'ngo_manager' && (
          <>
            <Route path="/applications" element={<div className="p-6"><ManagerServiceTracker /></div>} />
            <Route path="/volunteers" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4">Volunteer Coordination</h1><p className="text-gray-600">Coordinate volunteer activities and schedules. (Demo)</p></div>} />
            <Route path="/tasks" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4">Task Management</h1><p className="text-gray-600">Assign and track team tasks. (Demo)</p></div>} />
          </>
        )}
        
        {/* Volunteer specific routes */}
        {user?.role === 'volunteer' && (
          <>
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/hours-log" element={<div className="p-6"><VolunteerServiceLog /></div>} />
          </>
        )}
        
        {/* Donor specific routes */}
        {user?.role === 'donor' && (
          <>
            <Route path="/donations" element={<DonationsPage />} />
          </>
        )}
        
        {/* Citizen specific routes */}
        {user?.role === 'citizen' && (
          <>
            <Route path="/applications" element={<ServiceApplication />} />
            <Route path="/apply" element={<div className="p-6"><ServiceApplicationForm onApplicationSubmitted={() => window.location.reload()} /></div>} />
          </>
        )}
        
        {/* Common routes */}
        <Route path="/enhanced" element={<EnhancedDashboard />} />
        <Route path="/executive" element={<ExecutiveDashboard />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
        <Route path="/ai-insights" element={<AIDashboard />} />
        <Route path="/test" element={<div className="p-6"><h1 className="text-2xl font-bold">Test Route Works!</h1><p>Current user role: {user?.role}</p></div>} />
        <Route path="/settings" element={<ComprehensiveSettings />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;