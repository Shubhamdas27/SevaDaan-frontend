import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  Users, 
  Heart, 
  Award, 
  HelpCircle,
  Settings,
  BarChart3,
  TrendingUp,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useTouchGestures } from './MobileComponents';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  // Touch gestures for navigation
  useTouchGestures(navRef, {
    onSwipeLeft: () => setIsOpen(false),
    onSwipeRight: () => setIsOpen(true),
    threshold: 100
  });

  const navigationItems = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      public: true 
    },
    { 
      name: 'NGOs', 
      href: '/ngos', 
      icon: Building2,
      public: true 
    },
    { 
      name: 'Programs', 
      href: '/programs', 
      icon: Users,
      public: true 
    },
    { 
      name: 'Volunteer', 
      href: '/volunteer', 
      icon: Heart,
      public: true 
    },
    { 
      name: 'Grants', 
      href: '/grants', 
      icon: Award,
      requiresAuth: true,
      roles: ['ngo'] 
    },
    { 
      name: 'Emergency', 
      href: '/emergency-help', 
      icon: HelpCircle,
      public: true 
    }
  ];

  const dashboardItems = user ? [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: BarChart3 
    },
    { 
      name: 'Enhanced Dashboard', 
      href: '/enhanced-dashboard', 
      icon: TrendingUp,
      roles: ['ngo', 'donor'] 
    },
    { 
      name: 'Executive Dashboard', 
      href: '/executive-dashboard', 
      icon: TrendingUp,
      roles: ['ngo', 'donor'] 
    },
    { 
      name: 'Settings', 
      href: '/account/settings', 
      icon: Settings 
    }
  ] : [];

  const closeNavigation = () => {
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  const shouldShowItem = (item: any) => {
    if (item.public) return true;
    if (!item.requiresAuth) return true;
    if (!user) return false;
    if (item.roles && !item.roles.includes(user.role)) return false;
    return true;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200',
          'transition-all duration-200 hover:bg-gray-50',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeNavigation}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Panel */}
      <div
        ref={navRef}
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SevaDaan</h1>
              <p className="text-xs text-blue-100">NGO Platform</p>
            </div>
          </div>
          <button
            onClick={closeNavigation}
            className="p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {user.role || 'Member'}
                </p>
              </div>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <nav className="space-y-1">
              {navigationItems.filter(shouldShowItem).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeNavigation}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Dashboard Section */}
          {user && dashboardItems.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Dashboard
              </h3>
              <nav className="space-y-1">
                {dashboardItems.filter(shouldShowItem).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeNavigation}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                <Heart className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Donate</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Volunteer</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                <Award className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Apply Grant</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
                <HelpCircle className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Help</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/account/settings"
                onClick={closeNavigation}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeNavigation();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeNavigation}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeNavigation}
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
