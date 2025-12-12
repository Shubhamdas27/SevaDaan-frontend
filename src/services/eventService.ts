import { api } from './api';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  type: 'workshop' | 'fundraiser' | 'community' | 'volunteer' | 'awareness' | 'training' | 'meeting' | 'other';
  category: 'education' | 'health' | 'environment' | 'social' | 'technology' | 'arts' | 'sports' | 'other';
  startDate: string;
  endDate: string;
  location: {
    type: 'online' | 'physical' | 'hybrid';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    onlineLink?: string;
    platform?: string;
  };
  maxParticipants?: number;
  registrationDeadline?: string;
  registrationFee?: number;
  requirements?: string[];
  agenda?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    bio?: string;
    image?: string;
    designation?: string;
    organization?: string;
  }>;
  tags?: string[];
  imageUrl?: string;
  attachments?: string[];
  isPublic?: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdBy?: string;
  ngoId?: string;
  registeredCount?: number;
  attendedCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRegistrationData {
  id?: string;
  eventId: string;
  userId: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  additionalInfo?: Record<string, any>;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled' | 'no-show';
  registeredAt?: string;
  attendedAt?: string;
  checkInTime?: string;
  checkOutTime?: string;
  feedback?: {
    rating: number;
    comments?: string;
    suggestions?: string;
    wouldRecommend?: boolean;
  };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  type: 'workshop' | 'fundraiser' | 'community' | 'volunteer' | 'awareness' | 'training' | 'meeting' | 'other';
  category: 'education' | 'health' | 'environment' | 'social' | 'technology' | 'arts' | 'sports' | 'other';
  startDate: string;
  endDate: string;
  location: {
    type: 'online' | 'physical' | 'hybrid';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    onlineLink?: string;
    platform?: string;
  };
  maxParticipants?: number;
  registrationDeadline?: string;
  registrationFee?: number;
  requirements?: string[];
  agenda?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    bio?: string;
    image?: string;
    designation?: string;
    organization?: string;
  }>;
  tags?: string[];
  isPublic?: boolean;
}

export interface RegisterForEventRequest {
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  additionalInfo?: Record<string, any>;
}

export class EventService {
  // ==================== EVENT MANAGEMENT ====================
  
  static async getEvents(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    isPublic?: boolean;
  }): Promise<{
    events: EventData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/events/${ngoId}`, { params });
    return response.data.data;
  }

  static async getPublicEvents(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    upcoming?: boolean;
  }): Promise<{
    events: EventData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/events/${ngoId}/public`, { params });
    return response.data.data;
  }

  static async getUpcomingEvents(ngoId: string, limit?: number): Promise<EventData[]> {
    const response = await api.get(`/events/${ngoId}/upcoming`, {
      params: { limit }
    });
    return response.data.data;
  }

  static async getEventById(ngoId: string, eventId: string): Promise<EventData> {
    const response = await api.get(`/events/${ngoId}/${eventId}`);
    return response.data.data;
  }

  static async createEvent(ngoId: string, event: CreateEventRequest): Promise<EventData> {
    const response = await api.post(`/events/${ngoId}`, event);
    return response.data.data;
  }

  static async updateEvent(ngoId: string, eventId: string, event: Partial<CreateEventRequest>): Promise<EventData> {
    const response = await api.put(`/events/${ngoId}/${eventId}`, event);
    return response.data.data;
  }

  static async deleteEvent(ngoId: string, eventId: string): Promise<void> {
    await api.delete(`/events/${ngoId}/${eventId}`);
  }

  static async publishEvent(ngoId: string, eventId: string): Promise<EventData> {
    const response = await api.patch(`/events/${ngoId}/${eventId}/publish`);
    return response.data.data;
  }

  static async cancelEvent(ngoId: string, eventId: string, reason?: string): Promise<EventData> {
    const response = await api.patch(`/events/${ngoId}/${eventId}/cancel`, { reason });
    return response.data.data;
  }

  static async completeEvent(ngoId: string, eventId: string): Promise<EventData> {
    const response = await api.patch(`/events/${ngoId}/${eventId}/complete`);
    return response.data.data;
  }

  static async uploadEventImage(ngoId: string, eventId: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(`/events/${ngoId}/${eventId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // ==================== EVENT REGISTRATION ====================

  static async registerForEvent(ngoId: string, eventId: string, registration: RegisterForEventRequest): Promise<EventRegistrationData> {
    const response = await api.post(`/events/${ngoId}/${eventId}/register`, registration);
    return response.data.data;
  }

  static async cancelRegistration(ngoId: string, eventId: string, registrationId: string): Promise<void> {
    await api.delete(`/events/${ngoId}/${eventId}/registrations/${registrationId}`);
  }

  static async getEventRegistrations(ngoId: string, eventId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    registrations: EventRegistrationData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/events/${ngoId}/${eventId}/registrations`, { params });
    return response.data.data;
  }

  static async getMyRegistrations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    upcoming?: boolean;
  }): Promise<{
    registrations: (EventRegistrationData & { event: EventData })[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get('/events/my-registrations', { params });
    return response.data.data;
  }

  static async updateRegistrationStatus(ngoId: string, eventId: string, registrationId: string, status: string): Promise<EventRegistrationData> {
    const response = await api.patch(`/events/${ngoId}/${eventId}/registrations/${registrationId}/status`, { status });
    return response.data.data;
  }

  // ==================== ATTENDANCE MANAGEMENT ====================

  static async markAttendance(ngoId: string, eventId: string, registrationId: string, attended: boolean): Promise<EventRegistrationData> {
    const response = await api.patch(`/events/${ngoId}/${eventId}/registrations/${registrationId}/attendance`, { attended });
    return response.data.data;
  }

  static async bulkMarkAttendance(ngoId: string, eventId: string, attendanceData: Array<{
    registrationId: string;
    attended: boolean;
  }>): Promise<{
    updated: EventRegistrationData[];
    failed: Array<{ registrationId: string; error: string }>;
  }> {
    const response = await api.post(`/events/${ngoId}/${eventId}/attendance/bulk`, { attendanceData });
    return response.data.data;
  }

  static async getAttendanceReport(ngoId: string, eventId: string): Promise<{
    totalRegistrations: number;
    totalAttended: number;
    attendanceRate: number;
    attendees: EventRegistrationData[];
    noShows: EventRegistrationData[];
  }> {
    const response = await api.get(`/events/${ngoId}/${eventId}/attendance/report`);
    return response.data.data;
  }

  // ==================== FEEDBACK ====================

  static async submitFeedback(ngoId: string, eventId: string, registrationId: string, feedback: {
    rating: number;
    comments?: string;
    suggestions?: string;
    wouldRecommend?: boolean;
  }): Promise<EventRegistrationData> {
    const response = await api.post(`/events/${ngoId}/${eventId}/registrations/${registrationId}/feedback`, feedback);
    return response.data.data;
  }

  static async getEventFeedback(ngoId: string, eventId: string): Promise<{
    averageRating: number;
    totalFeedback: number;
    feedbackSummary: {
      rating: number;
      count: number;
    }[];
    feedback: Array<{
      rating: number;
      comments?: string;
      suggestions?: string;
      wouldRecommend?: boolean;
      participantName: string;
      submittedAt: string;
    }>;
  }> {
    const response = await api.get(`/events/${ngoId}/${eventId}/feedback`);
    return response.data.data;
  }

  // ==================== EVENT ANALYTICS ====================

  static async getEventAnalytics(ngoId: string, params?: {
    startDate?: string;
    endDate?: string;
    eventId?: string;
  }): Promise<{
    totalEvents: number;
    totalRegistrations: number;
    totalAttendees: number;
    averageAttendanceRate: number;
    averageRating: number;
    eventsByType: Record<string, number>;
    eventsByCategory: Record<string, number>;
    registrationTrends: Array<{
      date: string;
      registrations: number;
      events: number;
    }>;
    topEvents: Array<{
      eventId: string;
      title: string;
      registrations: number;
      attendanceRate: number;
      rating: number;
    }>;
  }> {
    const response = await api.get(`/events/${ngoId}/analytics`, { params });
    return response.data.data;
  }

  // ==================== EXPORT FUNCTIONS ====================

  static async exportEventData(ngoId: string, eventId: string, format: 'csv' | 'xlsx' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get(`/events/${ngoId}/${eventId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  static async exportRegistrations(ngoId: string, eventId: string, format: 'csv' | 'xlsx' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get(`/events/${ngoId}/${eventId}/registrations/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
}

export default EventService;
