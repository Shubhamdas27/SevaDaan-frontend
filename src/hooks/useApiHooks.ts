import { useState, useEffect, useCallback } from 'react';
import apiService, { NGORegistrationData, ProgramCreateRequest, GrantRequestData as ApiGrantRequestData, VolunteerApplicationData } from '../lib/apiService';
import { NGO, Program, Grant, VolunteerOpportunity, Testimonial, Notice, MediaItem, Donation } from '../types';

// Type for API error responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Specific interface types for API requests that are not imported
interface EmergencyHelpData {
  name: string;
  phone: string;
  location: string;
  helpType: 'medical' | 'food' | 'shelter' | 'financial' | 'other';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
}

interface FileUploadData {
  file: File;
  type: 'image' | 'document' | 'video';
  category: 'ngo_logo' | 'certificate' | 'report' | 'media';
}

// Additional interface types for missing functions
interface VolunteerOpportunityCreateData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  skills: string[];
  requiredHours: number;
  imageUrl?: string;
  status: 'open' | 'filled' | 'completed';
}

interface DonationCreateData {
  ngoId: string;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod: string;
}

interface TestimonialSubmissionData {
  ngoId: string;
  content: string;
  rating?: number;
}

interface NoticeCreateData {
  ngoId: string;
  title: string;
  content: string;
  type: 'event' | 'scheme' | 'announcement';
  url?: string;
  startDate?: string;
  endDate?: string;
  isHighlighted: boolean;
}

interface MediaUploadData {
  file: File;
  ngoId: string;
  title?: string;
  description?: string;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message || apiError.message || defaultMessage;
};

// Custom hook for NGO operations
export const useNGOs = () => {
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  const fetchNGOs = useCallback(async (params?: {
    limit?: number;
    offset?: number;
    search?: string;
    city?: string;
    state?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getNGOs(params);
      // Ensure we're getting proper data format
      if (response && response.data) {
        setNGOs(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('NGOs API returned unexpected data format:', response);
        setNGOs([]);
      }
    } catch (err: unknown) {
      console.error('Error fetching NGOs:', err);
      setError(getErrorMessage(err, 'Failed to fetch NGOs'));
      setNGOs([]); // Set empty array on error to avoid undefined issues
    } finally {
      setLoading(false);
    }
  }, []);

  const getNGOById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const ngo = await apiService.getNGOById(id);
      return ngo;    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch NGO'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNGO = async (data: NGORegistrationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.createNGO(data);    return result;    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as ApiError).response?.data?.message || 'Failed to create NGO'
        : 'Failed to create NGO';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ngos,
    loading,
    error,
    fetchNGOs,
    getNGOById,
    createNGO,
  };
};

// Custom hook for Programs
export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  const fetchPrograms = useCallback(async (params?: {
    ngoId?: string;
    status?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching programs with params:', params);
      const response = await apiService.getPrograms(params);
      // Ensure we're getting proper data format and handle empty responses
      if (response && response.data) {
        setPrograms(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('Programs API returned unexpected data format:', response);
        setPrograms([]);
      }
    } catch (err: unknown) {
      console.error('Error fetching programs:', err);
      setError(getErrorMessage(err, 'Failed to fetch programs'));
      setPrograms([]); // Set empty array on error to avoid undefined issues
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Automatically fetch programs when the hook is initialized
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);
  const getProgramById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const program = await apiService.getProgramById(id);
      return program;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch program'));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const createProgram = async (data: ProgramCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.createProgram(data);
      await fetchPrograms(); // Refresh the list
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create program'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    getProgramById,
    createProgram,
  };
};

// Custom hook for Grants
export const useGrants = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchGrants = async (params?: {
    status?: string;
    provider?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getGrants(params);
      setGrants(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch grants'));
    } finally {
      setLoading(false);
    }
  };
  const submitGrantRequest = async (data: ApiGrantRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.submitGrantRequest(data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to submit grant request'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    grants,
    loading,
    error,
    fetchGrants,
    submitGrantRequest,
  };
};

// Custom hook for Volunteer Opportunities
export const useVolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchOpportunities = useCallback(async (params?: {
    ngoId?: string;
    location?: string;
    skills?: string;
    status?: string;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getVolunteerOpportunities(params);
      setOpportunities(response.data);    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch volunteer opportunities'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getOpportunityById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const opportunity = await apiService.getVolunteerOpportunityById(id);
      return opportunity;    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch volunteer opportunity'));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const applyForOpportunity = async (id: string, data: VolunteerApplicationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.applyForVolunteerOpportunity(id, data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to apply for opportunity'));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const createOpportunity = async (data: VolunteerOpportunityCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.createVolunteerOpportunity(data);
      await fetchOpportunities(); // Refresh the list
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create volunteer opportunity'));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    opportunities,
    loading,
    error,
    fetchOpportunities,
    fetchVolunteerOpportunities: fetchOpportunities, // Alias for consistency
    getOpportunityById,
    applyForOpportunity,
    createOpportunity,
  };
};

// Custom hook for Donations
export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonationHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getDonationHistory();
      setDonations(response.data);    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch donation history'));
    } finally {
      setLoading(false);
    }
  };
  const createDonation = async (data: DonationCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.createDonation(data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to process donation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDonationById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const donation = await apiService.getDonationById(id);
      return donation;    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch donation details'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    donations,
    loading,
    error,
    fetchDonationHistory,
    createDonation,
    getDonationById
  };
};

// Custom hook for Testimonials
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchTestimonials = useCallback(async (params?: { limit?: number; ngoId?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTestimonials(params?.ngoId ? { ngoId: params.ngoId } : undefined);
      setTestimonials(response.data);    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch testimonials'));
    } finally {
      setLoading(false);
    }
  }, []);
  const submitTestimonial = async (data: TestimonialSubmissionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.submitTestimonial(data);
      await fetchTestimonials(); // Refresh the list
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to submit testimonial'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    submitTestimonial,
  };
};

// Custom hook for Notices
export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async (params?: {
    ngoId?: string;
    type?: string;
    highlighted?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getNotices(params);
      setNotices(response.data);    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch notices'));
    } finally {
      setLoading(false);
    }
  };
  const createNotice = async (data: NoticeCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.createNotice(data);
      await fetchNotices(); // Refresh the list
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create notice'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    notices,
    loading,
    error,
    fetchNotices,
    createNotice,
  };
};

// Custom hook for Media
export const useMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async (params?: {
    ngoId?: string;
    type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getMedia(params);
      setMedia(response.data);    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch media'));
    } finally {
      setLoading(false);
    }
  };
  const uploadMedia = async (data: MediaUploadData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.uploadMedia(data);
      await fetchMedia(); // Refresh the list
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to upload media'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    media,
    loading,
    error,
    fetchMedia,
    uploadMedia,
  };
};

// Custom hook for Emergency Help
export const useEmergencyHelp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitEmergencyRequest = async (data: EmergencyHelpData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.submitEmergencyHelp(data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to submit emergency request'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitEmergencyRequest,
  };
};

// Custom hook for Contact
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (data: ContactSubmissionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.submitContact(data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to submit contact form'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitContact,
  };
};

// Custom hook for File Upload
export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (data: FileUploadData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.uploadFile(data);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to upload file'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadFile,
  };
};

interface SearchResults {
  ngos?: NGO[];
  programs?: Program[];
  volunteerOpportunities?: VolunteerOpportunity[];
  grants?: Grant[];
}

// Custom hook for Search
export const useSearch = () => {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAll = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.searchAll(query);
      setResults(result);
      return result;    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to search'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchAll,
  };
};
