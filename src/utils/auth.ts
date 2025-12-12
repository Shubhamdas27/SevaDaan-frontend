/**
 * Auth utility functions
 */

// Key for storing auth token in localStorage
const AUTH_TOKEN_KEY = 'auth_token';

// Key for storing refresh token in localStorage
const REFRESH_TOKEN_KEY = 'refresh_token';

// Key for storing user info in localStorage
const USER_KEY = 'user_info';

/**
 * Get the authentication token from localStorage
 * @returns The authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Store authentication token in localStorage
 * @param token The authentication token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Get the refresh token from localStorage
 * @returns The refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store refresh token in localStorage
 * @param token The refresh token
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Remove refresh token from localStorage
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Get the user info from localStorage
 * @returns The user info as an object
 */
export const getUserInfo = (): any => {
  const userInfo = localStorage.getItem(USER_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Store user info in localStorage
 * @param user The user info
 */
export const setUserInfo = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Remove user info from localStorage
 */
export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if the user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Logout the user by removing all auth related data
 */
export const logout = (): void => {
  removeAuthToken();
  removeRefreshToken();
  removeUserInfo();
};

// Default export with all auth utilities
export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  isAuthenticated,
  logout
};
