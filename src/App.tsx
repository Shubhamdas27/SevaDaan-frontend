import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NGOs from './pages/NGOs';
import NGODetail from './pages/NGODetail';
import NGOPublicPage from './pages/NGOPublicPage';
import Grants from './pages/Grants';
import GrantRequest from './pages/GrantRequest';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import SearchResults from './pages/SearchResults';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import DonationSuccess from './pages/DonationSuccess';
import DonationHistory from './pages/DonationHistory';
import NgoDonatePage from './pages/donations/NgoDonatePage';
import ReceiptPage from './pages/donations/ReceiptPage';
import EmergencyHelp from './pages/EmergencyHelp';
import WhoWeAre from './pages/WhoWeAre';
import ReferralsPage from './pages/ReferralsPage';
import CertificatesPage from './pages/CertificatesPage';
import InvoicesPage from './pages/InvoicesPage';
import ProgramRegistrationsPage from './pages/ProgramRegistrationsPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import MobileExecutiveDashboard from './components/mobile/MobileExecutiveDashboard';
import BusinessIntelligenceTest from './pages/BusinessIntelligenceTest';
import Settings from './pages/account/Settings';
import ModernSettings from './pages/account/ModernSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';
import APITest from './pages/APITest';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/ui/Toast';
import SystemCheckPanel from './components/dev/SystemCheckPanel';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ngos" element={<NGOs />} />
              <Route path="/ngos/:id" element={<NGODetail />} />
              <Route path="/ngo/:slug" element={<NGOPublicPage />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/detail/:id" element={<ProgramDetails />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/grants" element={<Grants />} />
              <Route path="/grants/request" element={<GrantRequest />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/volunteer/opportunities/:id" element={<Volunteer />} />
              <Route path="/donate/:id" element={<Donate />} />
              <Route path="/donation-success" element={<DonationSuccess />} />
              <Route path="/donations/history" element={<DonationHistory />} />
              <Route path="/donations/:id/receipt" element={<ReceiptPage />} />
              <Route path="/ngos/:ngoId/donate" element={<NgoDonatePage />} />
              <Route path="/emergency-help" element={<EmergencyHelp />} />
              <Route path="/referrals" element={<ReferralsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/program-registrations" element={<ProgramRegistrationsPage />} />
              <Route path="/who-we-are" element={<WhoWeAre />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account/settings" element={<Settings />} />
              <Route path="/settings" element={<ModernSettings />} />
              {/* Unified dashboard route - all dashboard routes handled inside Dashboard component */}
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/bi-test" element={<BusinessIntelligenceTest />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/api-test" element={<APITest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SystemCheckPanel />
          </Router>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;