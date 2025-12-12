/**
 * Utility functions for working with FormData and API requests
 */

/**
 * Creates FormData object from an object with mixed data types
 * @param data Object containing data to convert to FormData
 * @returns FormData instance with all data properly appended
 */
export function createFormData(data: any): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value[0] instanceof File) {
      // Handle array of files
      value.forEach((file) => {
        formData.append(`${key}`, file);
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  
  return formData;
}
