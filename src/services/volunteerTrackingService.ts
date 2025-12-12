import { api } from './api';

export interface VolunteerTrackingData {
  id?: string;
  volunteerId: string;
  ngoId: string;
  activityType: 'check-in' | 'check-out' | 'activity' | 'task' | 'training' | 'event' | 'meeting';
  location?: {
    type: 'on-site' | 'remote' | 'field';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  timestamp: string;
  duration?: number; // in minutes
  description?: string;
  metadata?: Record<string, any>;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VolunteerSessionData {
  id?: string;
  volunteerId: string;
  ngoId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  activities: string[];
  location?: {
    type: 'on-site' | 'remote' | 'field';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  description?: string;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckInRequest {
  location?: {
    type: 'on-site' | 'remote' | 'field';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  description?: string;
  metadata?: Record<string, any>;
}

export interface ActivityLogRequest {
  activityType: 'activity' | 'task' | 'training' | 'event' | 'meeting';
  description: string;
  duration?: number;
  location?: {
    type: 'on-site' | 'remote' | 'field';
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  metadata?: Record<string, any>;
}

export class VolunteerTrackingService {
  // ==================== CHECK-IN/CHECK-OUT ====================
  
  static async checkIn(ngoId: string, data: CheckInRequest): Promise<VolunteerTrackingData> {
    const response = await api.post(`/volunteer-tracking/${ngoId}/check-in`, data);
    return response.data.data;
  }

  static async checkOut(ngoId: string, sessionId: string, description?: string): Promise<VolunteerTrackingData> {
    const response = await api.post(`/volunteer-tracking/${ngoId}/check-out`, {
      sessionId,
      description
    });
    return response.data.data;
  }

  static async getCurrentSession(ngoId: string): Promise<VolunteerSessionData | null> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/current-session`);
    return response.data.data;
  }

  // ==================== SESSION MANAGEMENT ====================

  static async getVolunteerSessions(ngoId: string, volunteerId?: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    verificationStatus?: string;
  }): Promise<{
    sessions: VolunteerSessionData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/sessions`, {
      params: { volunteerId, ...params }
    });
    return response.data.data;
  }

  static async getMySessions(ngoId: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }): Promise<{
    sessions: VolunteerSessionData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/my-sessions`, { params });
    return response.data.data;
  }

  static async getSessionById(ngoId: string, sessionId: string): Promise<VolunteerSessionData> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/sessions/${sessionId}`);
    return response.data.data;
  }

  static async updateSession(ngoId: string, sessionId: string, updates: Partial<VolunteerSessionData>): Promise<VolunteerSessionData> {
    const response = await api.put(`/volunteer-tracking/${ngoId}/sessions/${sessionId}`, updates);
    return response.data.data;
  }

  static async deleteSession(ngoId: string, sessionId: string): Promise<void> {
    await api.delete(`/volunteer-tracking/${ngoId}/sessions/${sessionId}`);
  }

  // ==================== ACTIVITY LOGGING ====================

  static async logActivity(ngoId: string, activity: ActivityLogRequest): Promise<VolunteerTrackingData> {
    const response = await api.post(`/volunteer-tracking/${ngoId}/log-activity`, activity);
    return response.data.data;
  }

  static async getActivities(ngoId: string, volunteerId?: string, params?: {
    page?: number;
    limit?: number;
    activityType?: string;
    startDate?: string;
    endDate?: string;
    verificationStatus?: string;
  }): Promise<{
    activities: VolunteerTrackingData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/activities`, {
      params: { volunteerId, ...params }
    });
    return response.data.data;
  }

  static async getMyActivities(ngoId: string, params?: {
    page?: number;
    limit?: number;
    activityType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    activities: VolunteerTrackingData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/my-activities`, { params });
    return response.data.data;
  }

  static async updateActivity(ngoId: string, activityId: string, updates: Partial<VolunteerTrackingData>): Promise<VolunteerTrackingData> {
    const response = await api.put(`/volunteer-tracking/${ngoId}/activities/${activityId}`, updates);
    return response.data.data;
  }

  static async deleteActivity(ngoId: string, activityId: string): Promise<void> {
    await api.delete(`/volunteer-tracking/${ngoId}/activities/${activityId}`);
  }

  // ==================== STATISTICS ====================

  static async getVolunteerStats(ngoId: string, volunteerId?: string, timeframe?: string): Promise<{
    totalHours: number;
    totalSessions: number;
    totalActivities: number;
    averageSessionDuration: number;
    mostActiveDay: string;
    activityBreakdown: Record<string, number>;
    monthlyHours: Array<{
      month: string;
      hours: number;
      sessions: number;
    }>;
    badges: Array<{
      name: string;
      description: string;
      earnedAt: string;
    }>;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/stats`, {
      params: { volunteerId, timeframe }
    });
    return response.data.data;
  }

  static async getMyStats(ngoId: string, timeframe?: string): Promise<{
    totalHours: number;
    totalSessions: number;
    totalActivities: number;
    averageSessionDuration: number;
    mostActiveDay: string;
    activityBreakdown: Record<string, number>;
    monthlyHours: Array<{
      month: string;
      hours: number;
      sessions: number;
    }>;
    badges: Array<{
      name: string;
      description: string;
      earnedAt: string;
    }>;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/my-stats`, {
      params: { timeframe }
    });
    return response.data.data;
  }

  static async getOrganizationStats(ngoId: string, timeframe?: string): Promise<{
    totalVolunteers: number;
    activeVolunteers: number;
    totalHours: number;
    totalSessions: number;
    averageHoursPerVolunteer: number;
    topVolunteers: Array<{
      volunteerId: string;
      volunteerName: string;
      totalHours: number;
      totalSessions: number;
    }>;
    activityTrends: Array<{
      date: string;
      hours: number;
      sessions: number;
      volunteers: number;
    }>;
    locationBreakdown: Record<string, number>;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/organization-stats`, {
      params: { timeframe }
    });
    return response.data.data;
  }

  // ==================== REPORTING ====================

  static async generateReport(ngoId: string, params: {
    type: 'volunteer' | 'activity' | 'summary';
    startDate: string;
    endDate: string;
    volunteerId?: string;
    format?: 'json' | 'csv' | 'pdf';
    includeVerificationStatus?: boolean;
  }): Promise<any> {
    const response = await api.post(`/volunteer-tracking/${ngoId}/reports`, params);
    return response.data.data;
  }

  static async exportReport(ngoId: string, reportId: string, format: 'csv' | 'xlsx' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  static async getReports(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    reports: Array<{
      id: string;
      type: string;
      startDate: string;
      endDate: string;
      status: string;
      createdAt: string;
      createdBy: string;
    }>;
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/reports`, { params });
    return response.data.data;
  }

  // ==================== VERIFICATION ====================

  static async verifyActivity(ngoId: string, activityId: string, verification: {
    status: 'verified' | 'rejected';
    notes?: string;
  }): Promise<VolunteerTrackingData> {
    const response = await api.patch(`/volunteer-tracking/${ngoId}/activities/${activityId}/verify`, verification);
    return response.data.data;
  }

  static async verifySession(ngoId: string, sessionId: string, verification: {
    status: 'verified' | 'rejected';
    notes?: string;
  }): Promise<VolunteerSessionData> {
    const response = await api.patch(`/volunteer-tracking/${ngoId}/sessions/${sessionId}/verify`, verification);
    return response.data.data;
  }

  static async bulkVerify(ngoId: string, verifications: Array<{
    type: 'activity' | 'session';
    id: string;
    status: 'verified' | 'rejected';
    notes?: string;
  }>): Promise<{
    verified: Array<{ id: string; type: string; status: string }>;
    failed: Array<{ id: string; type: string; error: string }>;
  }> {
    const response = await api.post(`/volunteer-tracking/${ngoId}/bulk-verify`, { verifications });
    return response.data.data;
  }

  static async getPendingVerifications(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: 'activity' | 'session';
    volunteerId?: string;
  }): Promise<{
    items: Array<VolunteerTrackingData | VolunteerSessionData>;
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/pending-verifications`, { params });
    return response.data.data;
  }

  // ==================== LEADERBOARD ====================

  static async getLeaderboard(ngoId: string, params?: {
    timeframe?: string;
    metric?: 'hours' | 'sessions' | 'activities';
    limit?: number;
  }): Promise<Array<{
    rank: number;
    volunteerId: string;
    volunteerName: string;
    totalHours: number;
    totalSessions: number;
    totalActivities: number;
    badgeCount: number;
  }>> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/leaderboard`, { params });
    return response.data.data;
  }

  // ==================== BADGES AND ACHIEVEMENTS ====================

  static async getAvailableBadges(ngoId: string): Promise<Array<{
    id: string;
    name: string;
    description: string;
    criteria: {
      type: 'hours' | 'sessions' | 'activities' | 'streak';
      value: number;
      timeframe?: string;
    };
    icon: string;
    color: string;
  }>> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/badges`);
    return response.data.data;
  }

  static async getVolunteerBadges(ngoId: string, volunteerId?: string): Promise<Array<{
    badgeId: string;
    name: string;
    description: string;
    earnedAt: string;
    icon: string;
    color: string;
  }>> {
    const response = await api.get(`/volunteer-tracking/${ngoId}/volunteer-badges`, {
      params: { volunteerId }
    });
    return response.data.data;
  }
}

export default VolunteerTrackingService;
