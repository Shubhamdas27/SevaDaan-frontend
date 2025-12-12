import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Programs', href: '/programs' },
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Grants', href: '/grants', ngoOnly: true },
    { name: 'Emergency Help', href: '/emergency-help' },
    { name: 'Who We Are', href: '/who-we-are' },
  ];

  const userNavigation = user?.role === 'ngo'
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Enhanced Dashboard', href: '/enhanced-dashboard' },
        { name: 'Executive Dashboard', href: '/executive-dashboard' },
        { name: 'Programs', href: '/dashboard/programs' },
        { name: 'Volunteers', href: '/dashboard/volunteers' },
        { name: 'Grants', href: '/dashboard/grants' },
        { name: 'Settings', href: '/dashboard/settings' },
      ]
    : user?.role === 'citizen'
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Applications', href: '/dashboard/applications' },
        { name: 'Settings', href: '/dashboard/settings' },
      ]
    : user?.role === 'volunteer'
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Opportunities', href: '/dashboard/opportunities' },
        { name: 'Hours Log', href: '/dashboard/hours-log' },
        { name: 'Settings', href: '/dashboard/settings' },
      ]
    : user?.role === 'donor'
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Enhanced Dashboard', href: '/enhanced-dashboard' },
        { name: 'Executive Dashboard', href: '/executive-dashboard' },
        { name: 'My Donations', href: '/dashboard/donations' },
        { name: 'Certificates', href: '/dashboard/certificates' },
        { name: 'Settings', href: '/dashboard/settings' },
      ]
    : [];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm">SD</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SevaDaan
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full px-6 py-2 shadow-sm">
              {navigation.map((item) => {
                if (item.ngoOnly && user?.role !== 'ngo') return null;
                
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105',
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button 
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  aria-label="View notifications"
                  title="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200"
                    aria-label="Open user menu"
                    title="Open user menu"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                    />
                    <ChevronDown className={cn(
                      "w-4 h-4 text-gray-500 transition-transform duration-300",
                      isUserMenuOpen && "rotate-180"
                    )} />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={closeMenus} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{user.email}</p>
                        </div>
                        
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={closeMenus}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 font-medium"
                          >
                            {item.name}
                          </Link>
                        ))}
                        
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
              aria-label="Toggle navigation menu"
              title="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
            <div className="py-4 space-y-1">
              {/* Mobile Navigation */}
              {navigation.map((item) => {
                if (item.ngoOnly && user?.role !== 'ngo') return null;
                
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMenus}
                    className={cn(
                      'block px-4 py-3 text-base font-medium mx-2 rounded-xl transition-all duration-200',
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              {!user && (
                <div className="px-4 pt-4 space-y-3 border-t border-gray-100 mt-2">
                  <Link to="/login" onClick={closeMenus} className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenus} className="block">
                    <Button
                      className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;