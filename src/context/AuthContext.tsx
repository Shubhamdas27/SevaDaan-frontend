import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import apiService from '../lib/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  updateUserInfo: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('AuthContext initializing...');
    
    // Check for saved user and token in localStorage
    const savedUser = localStorage.getItem('sevadaan_user');
    const token = localStorage.getItem('sevadaan_token');
    const isDemo = localStorage.getItem('sevadaan_demo_mode') === 'true';
    
    console.log('Saved user exists:', !!savedUser);
    console.log('Token exists:', !!token);
    console.log('Demo mode:', isDemo);
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        console.log('Successfully parsed saved user:', parsedUser.email);
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('sevadaan_user');
        localStorage.removeItem('sevadaan_token');
        localStorage.removeItem('sevadaan_refresh_token');
        localStorage.removeItem('sevadaan_demo_mode');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      console.log('No saved user or token found, setting unauthenticated state');
      setState(prevState => ({ ...prevState, isLoading: false }));
    }

    // Listen for token expiration events
    const handleTokenExpired = () => {
      console.log('Token expired event received, logging out...');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener('token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      console.log('Login attempt for:', email);
      
      // Demo mode - simulate login with predefined users
      const demoUsers: Record<string, User> = {
        'ngo@helpindia.org': {
          id: 'demo-ngo-1',
          name: 'Help India NGO',
          email: 'ngo@helpindia.org',
          role: 'ngo',
          avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
          city: 'Mumbai',
          createdAt: new Date().toISOString(),
        },
        'ngoadmin@helpindia.org': {
          id: 'demo-admin-1',
          name: 'Help India Admin',
          email: 'ngoadmin@helpindia.org',
          role: 'ngo_admin',
          avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
          city: 'Mumbai',
          createdAt: new Date().toISOString(),
        },
        'ngomanager@helpindia.org': {
          id: 'demo-manager-1',
          name: 'Help India Manager',
          email: 'ngomanager@helpindia.org',
          role: 'ngo_manager',
          avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
          city: 'Mumbai',
          createdAt: new Date().toISOString(),
        },
        'volunteer@helpindia.org': {
          id: 'demo-volunteer-1',
          name: 'Help India Volunteer',
          email: 'volunteer@helpindia.org',
          role: 'volunteer',
          avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
          city: 'Mumbai',
          createdAt: new Date().toISOString(),
        },
        'donor@example.com': {
          id: 'demo-donor-1',
          name: 'Demo Donor',
          email: 'donor@example.com',
          role: 'donor',
          avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          city: 'Delhi',
          createdAt: new Date().toISOString(),
        },
        'citizen@example.com': {
          id: 'demo-citizen-1',
          name: 'Demo Citizen',
          email: 'citizen@example.com',
          role: 'citizen',
          avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
          city: 'Delhi',
          createdAt: new Date().toISOString(),
        },
      };

      // Check if it's a demo user
      const demoUser = demoUsers[email];
      if (demoUser && password === 'password123') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Demo login successful for:', email);
        
        // Create a simple base64 encoded token for demo (not a real JWT but won't cause backend issues)
        const demoTokenData = {
          userId: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          iat: Date.now(),
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Create fake but properly formatted tokens
        const demoToken = 'demo-jwt.' + btoa(JSON.stringify(demoTokenData)) + '.demo-signature';
        const demoRefreshToken = 'demo-refresh.' + btoa(JSON.stringify({...demoTokenData, type: 'refresh'})) + '.demo-signature';
        
        localStorage.setItem('sevadaan_token', demoToken);
        localStorage.setItem('sevadaan_refresh_token', demoRefreshToken);
        localStorage.setItem('sevadaan_user', JSON.stringify(demoUser));
        localStorage.setItem('sevadaan_demo_mode', 'true'); // Flag to indicate demo mode
        
        setState({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('Demo user state set successfully');
        return demoUser;
      }
      
      // If not demo mode, try real API
      try {
        console.log('Attempting real API login...');
        const response = await apiService.login({ email, password });
        const { user, accessToken, refreshToken } = response;
        
        console.log('API login successful, storing tokens...');
        
        // Store tokens
        localStorage.setItem('sevadaan_token', accessToken);
        localStorage.setItem('sevadaan_refresh_token', refreshToken);
        localStorage.setItem('sevadaan_user', JSON.stringify(user));
        localStorage.removeItem('sevadaan_demo_mode'); // Ensure we're not in demo mode for real login
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('Real user state set successfully');
        return user;
      } catch (apiError) {
        console.error('API login failed:', apiError);
        // If API fails, show helpful error message
        throw new Error('Backend server is not available. Please use demo credentials or start the backend server.');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Login failed';
      setState(prevState => ({ ...prevState, isLoading: false }));
      throw new Error(errorMessage);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<User> => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      console.log('Registration attempt for:', email, 'with role:', role);
      
      const response = await apiService.register({ name, email, password, role });
      const { user, accessToken, refreshToken } = response;
      
      console.log('Registration successful, storing tokens...');
      
      // Store tokens
      localStorage.setItem('sevadaan_token', accessToken);
      localStorage.setItem('sevadaan_refresh_token', refreshToken);
      localStorage.setItem('sevadaan_user', JSON.stringify(user));
      localStorage.removeItem('sevadaan_demo_mode'); // Ensure we're not in demo mode for real registration
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log('Registration user state set successfully');
      return user;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
        : 'Registration failed';
      setState(prevState => ({ ...prevState, isLoading: false }));
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('sevadaan_token');
    localStorage.removeItem('sevadaan_refresh_token');
    localStorage.removeItem('sevadaan_user');
    localStorage.removeItem('sevadaan_demo_mode');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUserInfo = (userData: Partial<User>) => {
    if (!state.user) {
      return;
    }
    
    // Update the user object with the new data
    const updatedUser = { ...state.user, ...userData };
    
    // Save to local storage
    localStorage.setItem('sevadaan_user', JSON.stringify(updatedUser));
    
    // Update state
    setState({
      ...state,
      user: updatedUser,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};