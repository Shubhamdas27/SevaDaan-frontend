import axios from 'axios';
import { API_URL } from '../config';

// Simple auth token retrieval function to avoid import issues
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response || {};
    
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login page or refresh token logic
      console.error('Authentication error:', error);
      // window.location.href = '/login';
    }
    
    // Handle server errors
    if (response.status >= 500) {
      console.error('Server error:', error);
    }
    
    return Promise.reject(error);
  }
);

export { api };
