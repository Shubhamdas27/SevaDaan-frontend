import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const commonDashboardItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Enhanced Dashboard', href: '/dashboard/enhanced', icon: EnhancedDashboardIcon },
      { name: 'Executive Dashboard', href: '/dashboard/executive', icon: ExecutiveDashboardIcon },
    ];

    switch (user.role) {
      case 'ngo':
        return [
          ...commonDashboardItems,
          { name: 'Volunteers', href: '/dashboard/volunteers', icon: VolunteersIcon },
          { name: 'AI Insights', href: '/dashboard/ai-insights', icon: AIInsightsIcon },
          { name: 'Grants', href: '/dashboard/grants', icon: GrantsIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      case 'ngo_admin':
        return [
          ...commonDashboardItems,
          { name: 'Manage NGO', href: '/dashboard/manage-ngo', icon: VolunteersIcon },
          { name: 'Volunteers', href: '/dashboard/volunteers', icon: VolunteersIcon },
          { name: 'AI Insights', href: '/dashboard/ai-insights', icon: AIInsightsIcon },
          { name: 'Reports', href: '/dashboard/reports', icon: ApplicationsIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      case 'ngo_manager':
        return [
          ...commonDashboardItems,
          { name: 'Volunteers', href: '/dashboard/volunteers', icon: VolunteersIcon },
          { name: 'AI Insights', href: '/dashboard/ai-insights', icon: AIInsightsIcon },
          { name: 'Tasks', href: '/dashboard/tasks', icon: ApplicationsIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      case 'volunteer':
        return [
          ...commonDashboardItems,
          { name: 'My Opportunities', href: '/dashboard/opportunities', icon: OpportunitiesIcon },
          { name: 'Hours Log', href: '/dashboard/hours-log', icon: HoursIcon },
          { name: 'Certificates', href: '/dashboard/certificates', icon: CertificatesIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      case 'donor':
        return [
          ...commonDashboardItems,
          { name: 'My Donations', href: '/dashboard/donations', icon: DonationsIcon },
          { name: 'Certificates', href: '/dashboard/certificates', icon: CertificatesIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      case 'citizen':
        return [
          ...commonDashboardItems,
          { name: 'My Applications', href: '/dashboard/applications', icon: ApplicationsIcon },
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
      default:
        return [
          ...commonDashboardItems,
          { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
        ];
    }
  };

  const navigation = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex flex-col w-full max-w-xs bg-primary-800 pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={toggleSidebar}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              title="Close sidebar"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
                <span className="text-accent-400">Seva</span>
                <span>Daan</span>
              </Link>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-primary-900 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      location.pathname === item.href
                        ? 'text-white'
                        : 'text-primary-300 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" onClick={() => setSidebarOpen(false)}>
          {/* Empty div to close sidebar when clicking outside */}
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-900">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
                <span className="text-accent-400">Seva</span>
                <span>Daan</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        location.pathname === item.href
                          ? 'text-white'
                          : 'text-primary-300 group-hover:text-white'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={toggleSidebar}
            title="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white"></span>
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Avatar
                      src={user?.avatar}
                      name={user?.name || ''}
                      size="sm"
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-4 p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Icon components
type SVGProps = React.SVGProps<SVGSVGElement>;

const HomeIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const ProgramsIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const VolunteersIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const GrantsIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const OpportunitiesIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const HoursIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DonationsIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CertificatesIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ApplicationsIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const SettingsIcon = (props: SVGProps) => (
  <Settings {...props} />
);

const AIInsightsIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const EnhancedDashboardIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const ExecutiveDashboardIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default DashboardLayout;