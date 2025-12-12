import api from './api';
import { createFormData } from '../utils/formUtils';
import { transformNGO, transformProgram, transformVolunteerOpportunity, transformTestimonial } from '../utils/dataTransform';
import { 
  User, 
  UserRole, 
  NGO, 
  Program, 
  Grant, 
  VolunteerOpportunity, 
  Testimonial, 
  MediaItem, 
  Notice, 
  Donation,
  DonationResponse
} from '../types';

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface NGORegistrationData {
  // Basic Details
  name: string;
  description: string;
  mission: string;
  vision: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  registrationNumber: string;
  registrationDate: string;
  type: 'trust' | 'society' | 'section8';
  legalStatus: string;
  operationalAreas: string[];
  targetBeneficiaries: string;
  impactMetrics: string;
  
  // Social Links
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  mediaLinks: string[];
  
  // Bank Details
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  
  // Representative Details
  repName: string;
  repDesignation: string;
  repPhone: string;
  repEmail: string;
  repIdType: 'aadhaar' | 'pan' | 'passport';
  repIdNumber: string;
  
  // Files
  logo?: File;
  registrationCertificate: File;
  panCard: File;
  taxExemptionCert?: File;
  fcraCertificate?: File;
  annualReport?: File;
  financialStatement?: File;
  cancelledCheque: File;
}

export interface ProgramCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  eligibilityCriteria?: string;
  capacity?: number;
  imageUrl?: string;
}

export interface GrantRequestData {
  title: string;
  description: string;
  amount: number;
  deadline: string;
  usagePlan: string;
  eligibilityCriteria: string;
  documents: File[];
}

export interface VolunteerApplicationData {
  message?: string;
  availableHours: number;
  experience?: string;
}

export interface DonationRequest {
  ngoId: string;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod: string;
}

export interface EmergencyHelpRequest {
  name: string;
  phone: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  helpType: 'medical' | 'food' | 'shelter' | 'financial' | 'other';
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TestimonialRequest {
  ngoId: string;
  content: string;
  rating?: number;
}

export interface FileUploadRequest {
  file: File;
  type: 'image' | 'document' | 'video';
  category: 'ngo_logo' | 'certificate' | 'report' | 'media';
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  search?: string;
  city?: string;
  state?: string;
}

// API Service Class
class ApiService {
  // Authentication Endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    // Backend returns { success: true, data: { user, token, refreshToken } }
    const { user, token, refreshToken } = response.data.data;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt || new Date().toISOString()
      },
      accessToken: token,
      refreshToken: refreshToken
    };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    // Backend returns { success: true, data: { user, token, refreshToken } }
    const { user, token, refreshToken } = response.data.data;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt || new Date().toISOString()
      },
      accessToken: token,
      refreshToken: refreshToken
    };
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post('/auth/refresh-token', data);
    // Backend returns { success: true, data: { token, refreshToken, user } }
    return {
      accessToken: response.data.data.token
    };
  }
  
  // NGO Management Endpoints
  async getNGOs(params?: PaginationParams & SearchParams): Promise<{
    data: NGO[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const response = await api.get('/ngos', { params });
    // Backend returns { success: true, data: [...], pagination: {...} }
    const backendData = response.data.data || [];
    return {
      data: backendData.map(transformNGO),
      total: response.data.pagination?.totalItems || backendData.length,
      limit: response.data.pagination?.itemsPerPage || 10,
      offset: (response.data.pagination?.currentPage - 1) * response.data.pagination?.itemsPerPage || 0
    };
  }

  async getNGOById(id: string): Promise<NGO> {
    const response = await api.get(`/ngos/${id}`);
    return response.data;
  }
  
  async createNGO(data: NGORegistrationData): Promise<{ id: string; status: string; message: string }> {
    const formData = createFormData(data);
    
    const response = await api.post('/ngos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateNGO(id: string, data: Partial<NGORegistrationData>): Promise<{ id: string; message: string }> {
    const formData = createFormData(data);

    const response = await api.put(`/ngos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  
  // Program Management Endpoints
  async getPrograms(params?: {
    ngoId?: string;
    status?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Program[]; total: number }> {
    try {
      console.log('Fetching programs with params:', params);
      const response = await api.get('/programs', { 
        params,
        timeout: 30000 // Increase timeout to 30 seconds
      });
      
      // Backend returns { success: true, data: [...], pagination: {...} }
      const backendData = response.data?.data || [];
      console.log('Programs data received:', backendData.length, 'items');
      
      return {
        data: Array.isArray(backendData) ? backendData.map(transformProgram) : [],
        total: response.data?.pagination?.totalItems || backendData.length || 0
      };
    } catch (error) {
      console.error('Error fetching programs in apiService:', error);
      // Return empty data instead of throwing to prevent UI crashes
      return {
        data: [],
        total: 0
      };
    }
  }

  async getProgramById(id: string): Promise<Program & { ngo: { id: string; name: string; logo: string } }> {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  }

  async createProgram(data: ProgramCreateRequest): Promise<{ id: string; message: string }> {
    const response = await api.post('/programs', data);
    return response.data;
  }

  async updateProgram(id: string, data: Partial<ProgramCreateRequest>): Promise<{ id: string; message: string }> {
    const response = await api.put(`/programs/${id}`, data);
    return response.data;
  }

  async deleteProgram(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  }

  // Grant Management Endpoints
  async getGrants(params?: {
    status?: string;
    provider?: string;
    minAmount?: number;
    maxAmount?: number;
  }): Promise<{ data: Grant[] }> {
    const response = await api.get('/grants', { params });
    return response.data;
  }

  async getGrantById(id: string): Promise<Grant> {
    const response = await api.get(`/grants/${id}`);
    return response.data;
  }
  
  async submitGrantRequest(data: GrantRequestData): Promise<{ id: string; status: string; message: string }> {
    const formData = createFormData(data);

    const response = await api.post('/grants/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  
  // Volunteer Opportunities Endpoints
  async getVolunteerOpportunities(params?: {
    ngoId?: string;
    location?: string;
    skills?: string;
    status?: string;
  }): Promise<{ data: (VolunteerOpportunity & { ngo: { id: string; name: string; logo: string } })[] }> {
    const response = await api.get('/volunteer-opportunities', { params });
    // Backend returns { success: true, data: [...] }
    const backendData = response.data.data || response.data || [];
    
    return {
      data: backendData.map((item: unknown) => ({
        ...transformVolunteerOpportunity(item),
        ngo: (item as { ngo?: { _id?: string; id?: string; name?: string; logo?: string } }).ngo ? {
          id: (item as { ngo: { _id?: string; id?: string; name: string; logo: string } }).ngo._id || (item as { ngo: { id: string; name: string; logo: string } }).ngo.id,
          name: (item as { ngo: { name: string } }).ngo.name,
          logo: (item as { ngo: { logo: string } }).ngo.logo
        } : { id: '', name: '', logo: '' }
      }))
    };
  }

  async getVolunteerOpportunityById(id: string): Promise<VolunteerOpportunity & { ngo: { id: string; name: string; logo: string } }> {
    const response = await api.get(`/volunteer-opportunities/${id}`);
    // Backend returns { success: true, data: {...} }
    const data = response.data.data || response.data;
    return {
      ...transformVolunteerOpportunity(data),
      ngo: data.ngo ? {
        id: data.ngo._id || data.ngo.id,
        name: data.ngo.name,
        logo: data.ngo.logo
      } : { id: '', name: '', logo: '' }
    };
  }

  async applyForVolunteerOpportunity(id: string, data: VolunteerApplicationData): Promise<{ id: string; status: string; message: string }> {
    const response = await api.post(`/volunteer-opportunities/${id}/apply`, data);
    return response.data;
  }

  async createVolunteerOpportunity(data: Omit<VolunteerOpportunity, 'id' | 'ngoId' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; message: string }> {
    const response = await api.post('/volunteer-opportunities', data);
    return response.data;
  }
  
  // Donation Endpoints
  async createDonation(data: DonationRequest): Promise<DonationResponse> {
    const response = await api.post('/donations', data);
    return response.data;
  }
  
  async completeDonation(donationId: string, data: { paymentId?: string; signature?: string; status?: string }): Promise<{ id: string; status: string; message: string }> {
    const response = await api.post(`/donations/${donationId}/complete`, data);
    return response.data;
  }

  async getDonationHistory(): Promise<{ data: (Donation & { ngo: { id: string; name: string; logo: string } })[] }> {
    const response = await api.get('/donations/history');
    return response.data;
  }

  async getDonationById(id: string): Promise<Donation & { ngo: { id: string; name: string; logo: string } }> {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  }

  // Emergency Help Endpoints
  async submitEmergencyHelp(data: EmergencyHelpRequest): Promise<{
    id: string;
    nearbyHelp: Array<{
      id: string;
      name: string;
      type: 'NGO' | 'Volunteer';
      distance: string;
      phone: string;
      services: string[];
    }>;
    message: string;
  }> {
    const response = await api.post('/emergency-help', data);
    return response.data;
  }

  // Contact & Communication Endpoints
  async submitContact(data: ContactRequest): Promise<{ id: string; status: string; message: string }> {
    const response = await api.post('/contact', data);
    return response.data;
  }
  
  // Testimonials Endpoints
  async getTestimonials(params?: { ngoId?: string }): Promise<{ data: Testimonial[] }> {
    const response = await api.get('/testimonials', { params });
    // Backend returns { success: true, data: [...] }
    const backendData = response.data.data || response.data || [];
    return {
      data: backendData.map(transformTestimonial)
    };
  }

  async submitTestimonial(data: TestimonialRequest): Promise<{ id: string; message: string }> {
    const response = await api.post('/testimonials', data);
    return response.data;
  }

  // Notice Board Endpoints
  async getNotices(params?: {
    ngoId?: string;
    type?: string;
    highlighted?: boolean;
  }): Promise<{ data: Notice[] }> {
    const response = await api.get('/notices', { params });
    return response.data;
  }

  async createNotice(data: Omit<Notice, 'id' | 'createdAt'>): Promise<{ id: string; message: string }> {
    const response = await api.post('/notices', data);
    return response.data;
  }

  // Media Endpoints
  async getMedia(params?: {
    ngoId?: string;
    type?: string;
  }): Promise<{ data: MediaItem[] }> {
    const response = await api.get('/media', { params });
    return response.data;
  }
  
  async uploadMedia(data: { file: File; ngoId: string; title?: string; description?: string }): Promise<{ id: string; url: string; message: string }> {
    const formData = createFormData(data);
    
    const response = await api.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // File Upload Endpoints
  async uploadFile(data: FileUploadRequest): Promise<{
    url: string;
    filename: string;
    size: number;
    type: string;
  }> {
    const formData = createFormData(data);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // User Profile Endpoints
  async getUserProfile(): Promise<User> {
    const response = await api.get('/profile');
    return response.data;
  }

  async updateUserProfile(data: Partial<User>): Promise<{ message: string }> {
    const response = await api.put('/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put('/profile/password', data);
    return response.data;
  }
  
  // Search Endpoints
  async searchAll(query: string): Promise<{
    ngos: NGO[];
    programs: Program[];
    grants: Grant[];
    volunteers: VolunteerOpportunity[];
  }> {
    const response = await api.get('/search', { params: { query } });
    return response.data.results;
  }
  
  // Analytics Endpoints (for NGOs)
  async getNGOAnalytics(ngoId: string): Promise<{
    totalDonations: number;
    totalVolunteers: number;
    activePrograms: number;
    totalBeneficiaries: number;
    monthlyDonations: Array<{ month: string; amount: number }>;
    volunteerApplications: Array<{ month: string; count: number }>;
  }> {
    const response = await api.get(`/ngos/${ngoId}/analytics`);
    return response.data;
  }
  
  // Dashboard Endpoints
  async getDashboard(role: string): Promise<any> {
    const response = await api.get(`/dashboard/${role.replace('_', '-')}`);
    return response.data;
  }

  async getNGOAdminDashboard(): Promise<any> {
    const response = await api.get('/dashboard/ngo-admin');
    return response.data;
  }

  async getNGOManagerDashboard(): Promise<any> {
    const response = await api.get('/dashboard/ngo-manager');
    return response.data;
  }

  async getCitizenDashboard(): Promise<any> {
    const response = await api.get('/dashboard/citizen');
    return response.data;
  }

  async getDonorDashboard(): Promise<any> {
    const response = await api.get('/dashboard/donor');
    return response.data;
  }

  async getVolunteerDashboard(): Promise<any> {
    const response = await api.get('/dashboard/volunteer');
    return response.data;
  }

  async getSuperAdminDashboard(): Promise<any> {
    const response = await api.get('/dashboard/super-admin');    return response.data;
  }

  // Service Application endpoints
  async createServiceApplication(data: {
    ngoId: string;
    programId?: string;
    applicationType: 'program' | 'service' | 'assistance';
    serviceType: 'education' | 'health' | 'food' | 'shelter' | 'employment' | 'legal' | 'other';
    title: string;
    description: string;
    urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
    documents?: { url: string; type: string; name: string; }[];
    beneficiariesCount?: number;
    location: {
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    tags?: string[];
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post('/applications', data);
    return response.data;
  }

  async getServiceApplications(params?: {
    status?: string;
    serviceType?: string;
    urgencyLevel?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ success: boolean; data: { applications: any[]; pagination: any } }> {
    const response = await api.get('/applications', { params });
    return response.data;
  }

  async getServiceApplication(id: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  }

  async updateApplicationStatus(id: string, data: {
    status?: string;
    assignedManager?: string;
    assignedVolunteer?: string;
    reviewNotes?: string;
    completionNotes?: string;
    rejectionReason?: string;
    estimatedCompletionDate?: string;
    actualCompletionDate?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(`/applications/${id}/status`, data);
    return response.data;
  }

  async addCaseNote(id: string, data: {
    noteType: 'update' | 'milestone' | 'concern' | 'completion' | 'follow_up';
    title: string;
    content: string;
    attachments?: string[];
    isPrivate?: boolean;
    hoursLogged?: number;
    activitiesCompleted?: string[];
    nextSteps?: string[];
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post(`/applications/${id}/notes`, data);
    return response.data;
  }

  async getApplicationStats(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/applications/stats');
    return response.data;
  }

  // Volunteer Activity endpoints
  async createVolunteerActivity(data: {
    applicationId?: string;
    programId?: string;
    ngoId: string;
    activityType: 'field_work' | 'training' | 'event' | 'administration' | 'outreach' | 'other';
    title: string;
    description: string;
    hoursLogged: number;
    location?: string;
    date?: string;
    notes?: string;
    attachments?: string[];
    skillsUsed?: string[];
    impactDescription?: string;
    beneficiariesServed?: number;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post('/volunteer-activities', data);
    return response.data;
  }

  async getVolunteerActivities(params?: {
    volunteerId?: string;
    ngoId?: string;
    applicationId?: string;
    status?: string;
    activityType?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ success: boolean; data: { activities: any[]; pagination: any } }> {
    const response = await api.get('/volunteer-activities', { params });
    return response.data;
  }

  async updateVolunteerActivity(id: string, data: {
    activityType?: string;
    title?: string;
    description?: string;
    hoursLogged?: number;
    location?: string;
    date?: string;
    status?: string;
    notes?: string;
    attachments?: string[];
    skillsUsed?: string[];
    impactDescription?: string;
    beneficiariesServed?: number;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(`/volunteer-activities/${id}`, data);
    return response.data;
  }

  async deleteVolunteerActivity(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/volunteer-activities/${id}`);
    return response.data;
  }

  async verifyVolunteerActivity(id: string, notes?: string): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(`/volunteer-activities/${id}/verify`, { notes });
    return response.data;
  }

  async getVolunteerStats(volunteerId?: string): Promise<{ success: boolean; data: any }> {
    const params = volunteerId ? { volunteerId } : {};
    const response = await api.get('/volunteer-activities/stats', { params });
    return response.data;
  }

  // Referral endpoints
  async createReferral(data: {
    toNGO: string;
    citizenId: string;
    serviceType: string;
    reason: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    referralNotes: string;
    documents?: string[];
    followUpRequired?: boolean;
    followUpDate?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post('/referrals', data);
    return response.data;
  }

  async getReferrals(params?: {
    status?: string;
    urgencyLevel?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { referrals: any[]; pagination: any } }> {
    const response = await api.get('/referrals', { params });
    return response.data;
  }

  async updateReferralStatus(id: string, data: {
    status: string;
    completionNotes?: string;
    rejectionReason?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(`/referrals/${id}`, data);
    return response.data;
  }

  // Error Logging Endpoints
  async logClientError(data: {
    componentName: string;
    errorMessage: string;
    stackTrace: string;
    componentStack: string;
    timestamp: string;
  }): Promise<{ message: string }> {
    try {
      const response = await api.post('/client-errors', data);
      return response.data;
    } catch (error) {
      // If error logging fails, don't throw - just log to console
      console.error('Failed to log client error:', error);
      return { message: 'Error logging failed' };
    }
  }

  // Manager Management Endpoints
  async getManagers(): Promise<any[]> {
    try {
      const response = await api.get('/ngo/managers');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  }

  async addManager(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    permissions: string[];
    role?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/ngo/managers', data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding manager:', error);
      throw error;
    }
  }

  async updateManagerPermissions(managerId: string, data: {
    permissions: string[];
    isActive?: boolean;
  }): Promise<any> {
    try {
      const response = await api.put(`/ngo/managers/${managerId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  }

  async deleteManager(managerId: string): Promise<any> {
    try {
      const response = await api.delete(`/ngo/managers/${managerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw error;
    }
  }

  // Volunteer Management Endpoints
  async getNGOVolunteers(): Promise<any[]> {
    try {
      const response = await api.get('/volunteer-opportunities/ngo');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching NGO volunteers:', error);
      throw error;
    }
  }

  async updateVolunteerStatus(volunteerId: string, data: {
    status: string;
    message?: string;
  }): Promise<any> {
    try {
      const response = await api.put(`/volunteer-opportunities/${volunteerId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      throw error;
    }
  }

  async deleteVolunteer(volunteerId: string): Promise<any> {
    try {
      const response = await api.delete(`/volunteer-opportunities/${volunteerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw error;
    }
  }

  async addVolunteer(volunteerData: any): Promise<any> {
    try {
      const response = await api.post('/volunteer-opportunities/add', volunteerData);
      return response.data;
    } catch (error) {
      console.error('Error adding volunteer:', error);
      throw error;
    }
  }

  // Google Form Integration Methods
  async getVolunteerFormUrl(programId: string): Promise<{ formUrl: string; programTitle: string; ngoName: string; instructions: string }> {
    try {
      const response = await api.get(`/google-forms/volunteer-form/${programId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting volunteer form URL:', error);
      throw error;
    }
  }

  async recordVolunteerInterest(volunteerData: {
    volunteerName: string;
    volunteerEmail: string;
    volunteerPhone?: string;
    programId: string;
    ngoId: string;
    motivation: string;
    experience?: string;
    availability: string;
    skills: string[];
    formResponseId?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/google-forms/volunteer-interest', volunteerData);
      return response.data;
    } catch (error) {
      console.error('Error recording volunteer interest:', error);
      throw error;
    }
  }

  async getVolunteerInterests(): Promise<any> {
    try {
      const response = await api.get('/google-forms/volunteer-interests');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching volunteer interests:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
