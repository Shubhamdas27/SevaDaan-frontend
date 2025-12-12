/**
 * Configuration constants for the application
 */

// API base URL
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// File upload URL
export const UPLOAD_URL: string = `${API_URL}/upload`;

// Maximum file upload size (in bytes)
export const MAX_FILE_SIZE: number = 5 * 1024 * 1024; // 5MB

// Allowed file types for image uploads
export const ALLOWED_IMAGE_TYPES: string[] = ['image/jpeg', 'image/png', 'image/gif'];

// Allowed file types for document uploads
export const ALLOWED_DOCUMENT_TYPES: string[] = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Default export for easier imports
const config = {
  apiBaseUrl: API_URL,
  uploadUrl: UPLOAD_URL,
  maxFileSize: MAX_FILE_SIZE,
  allowedImageTypes: ALLOWED_IMAGE_TYPES,
  allowedDocumentTypes: ALLOWED_DOCUMENT_TYPES
};

export default config;

// Pagination defaults
export const DEFAULT_PAGE_SIZE: number = 10;
