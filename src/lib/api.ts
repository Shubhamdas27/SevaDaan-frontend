import axios from 'axios';

// Import API_URL from config
import { API_URL } from '../config.ts';
import { getMockResponse } from './mockApiService';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout to 15s
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('sevadaan_token');
      const isDemo = localStorage.getItem('sevadaan_demo_mode') === 'true';
      
      // If in demo mode and this is a protected endpoint, return mock data
      if (isDemo && token && token.startsWith('demo-') && config.url) {
        console.log('Demo mode: returning mock response for:', config.url);
        const mockResponse = await getMockResponse(config.url);
        // Return a fake fulfilled request that axios will treat as completed
        return Promise.reject({
          config,
          response: mockResponse,
          isAxiosError: false,
          toJSON: () => ({}),
          __DEMO_RESPONSE__: true
        });
      }
      
      if (token && !token.startsWith('demo-')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config; // Continue with request even if interceptor fails
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Make sure we always have a properly formatted response
    if (response.data && !response.data.hasOwnProperty('success')) {
      response.data = {
        success: true,
        data: response.data
      };
    }
    return response;
  },
  async (error) => {
    // Handle demo mode responses
    if (error.__DEMO_RESPONSE__) {
      console.log('Demo mode: returning mock response');
      return Promise.resolve(error.response);
    }

    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: 'Network error. Please check your internet connection.'
          }
        }
      });
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't try to refresh token for auth endpoints
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }
      
      // Check if we're in demo mode
      const isDemo = localStorage.getItem('sevadaan_demo_mode') === 'true';
      if (isDemo) {
        console.log('Demo mode: 401 error, but not attempting refresh');
        // In demo mode, don't try to refresh tokens, just return mock data or handle gracefully
        return Promise.reject({
          response: {
            data: {
              success: false,
              message: 'Demo mode: Authentication required for this feature'
            }
          }
        });
      }
      
      try {
        const refreshToken = localStorage.getItem('sevadaan_refresh_token');
        if (refreshToken && !refreshToken.startsWith('demo-')) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('sevadaan_token', token);
          localStorage.setItem('sevadaan_refresh_token', newRefreshToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          // No refresh token available, just reject without redirect
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, clear tokens but don't redirect immediately
        localStorage.removeItem('sevadaan_token');
        localStorage.removeItem('sevadaan_refresh_token');
        localStorage.removeItem('sevadaan_user');
        localStorage.removeItem('sevadaan_demo_mode');
        
        // Dispatch a custom event to let AuthContext handle logout
        window.dispatchEvent(new CustomEvent('token-expired'));
        
        return Promise.reject(error);
      }
    }

    // Ensure we have a properly formatted error response
    if (!error.response.data || !error.response.data.hasOwnProperty('success')) {
      error.response.data = {
        success: false,
        message: error.response?.data?.message || 'An unexpected error occurred',
        error: error.response?.data || error.message
      };
    }

    return Promise.reject(error);
  }
);

export default api;
