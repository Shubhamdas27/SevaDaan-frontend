import { api } from './api';

export interface ContentData {
  id?: string;
  title?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  homepageContent?: {
    heroTitle?: string;
    heroSubtitle?: string;
    featuredPrograms?: string[];
    testimonials?: string[];
    statistics?: {
      totalDonations?: number;
      volunteersHelped?: number;
      programsCompleted?: number;
    };
  };
}

export interface AnnouncementData {
  id?: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'donation' | 'program';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublic?: boolean;
  targetAudience?: ('volunteers' | 'donors' | 'beneficiaries' | 'public')[];
  scheduledFor?: string;
  expiresAt?: string;
  tags?: string[];
  attachments?: string[];
  author?: string;
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'donation' | 'program';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublic?: boolean;
  targetAudience?: ('volunteers' | 'donors' | 'beneficiaries' | 'public')[];
  scheduledFor?: string;
  expiresAt?: string;
  tags?: string[];
}

export class ContentService {
  // ==================== CONTENT MANAGEMENT ====================
  
  static async getContent(ngoId: string): Promise<ContentData> {
    const response = await api.get(`/content/${ngoId}`);
    return response.data.data;
  }

  static async updateContent(ngoId: string, content: Partial<ContentData>): Promise<ContentData> {
    const response = await api.put(`/content/${ngoId}`, content);
    return response.data.data;
  }

  static async uploadLogo(ngoId: string, file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post(`/content/${ngoId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  static async uploadBanner(ngoId: string, file: File): Promise<{ bannerUrl: string }> {
    const formData = new FormData();
    formData.append('banner', file);
    
    const response = await api.post(`/content/${ngoId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  static async updateHomepage(ngoId: string, homepageData: any): Promise<ContentData> {
    const response = await api.put(`/content/${ngoId}/homepage`, homepageData);
    return response.data.data;
  }

  static async getHomepage(ngoId: string): Promise<any> {
    const response = await api.get(`/content/${ngoId}/homepage`);
    return response.data.data;
  }

  // ==================== ANNOUNCEMENTS ====================

  static async getAnnouncements(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    priority?: string;
    isPublic?: boolean;
    isApproved?: boolean;
    includeExpired?: boolean;
  }): Promise<{
    announcements: AnnouncementData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/content/${ngoId}/announcements`, { params });
    return response.data.data;
  }

  static async getPublicAnnouncements(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{
    announcements: AnnouncementData[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/content/${ngoId}/announcements/public`, { params });
    return response.data.data;
  }

  static async getUrgentAnnouncements(ngoId: string): Promise<AnnouncementData[]> {
    const response = await api.get(`/content/${ngoId}/announcements/urgent`);
    return response.data.data;
  }

  static async getAnnouncementById(ngoId: string, announcementId: string): Promise<AnnouncementData> {
    const response = await api.get(`/content/${ngoId}/announcements/${announcementId}`);
    return response.data.data;
  }

  static async createAnnouncement(ngoId: string, announcement: CreateAnnouncementRequest): Promise<AnnouncementData> {
    const response = await api.post(`/content/${ngoId}/announcements`, announcement);
    return response.data.data;
  }

  static async updateAnnouncement(ngoId: string, announcementId: string, announcement: Partial<CreateAnnouncementRequest>): Promise<AnnouncementData> {
    const response = await api.put(`/content/${ngoId}/announcements/${announcementId}`, announcement);
    return response.data.data;
  }

  static async deleteAnnouncement(ngoId: string, announcementId: string): Promise<void> {
    await api.delete(`/content/${ngoId}/announcements/${announcementId}`);
  }

  static async approveAnnouncement(ngoId: string, announcementId: string, approved: boolean): Promise<AnnouncementData> {
    const response = await api.patch(`/content/${ngoId}/announcements/${announcementId}/approve`, { approved });
    return response.data.data;
  }

  static async archiveAnnouncement(ngoId: string, announcementId: string): Promise<AnnouncementData> {
    const response = await api.patch(`/content/${ngoId}/announcements/${announcementId}/archive`);
    return response.data.data;
  }

  static async restoreAnnouncement(ngoId: string, announcementId: string): Promise<AnnouncementData> {
    const response = await api.patch(`/content/${ngoId}/announcements/${announcementId}/restore`);
    return response.data.data;
  }

  static async createBulkAnnouncements(ngoId: string, announcements: CreateAnnouncementRequest[]): Promise<{
    created: AnnouncementData[];
    failed: Array<{ announcement: CreateAnnouncementRequest; error: string }>;
  }> {
    const response = await api.post(`/content/${ngoId}/announcements/bulk`, { announcements });
    return response.data.data;
  }

  static async getAnnouncementTemplates(ngoId: string): Promise<Array<{
    id: string;
    name: string;
    title: string;
    content: string;
    type: string;
    priority: string;
  }>> {
    const response = await api.get(`/content/${ngoId}/announcements/templates`);
    return response.data.data;
  }

  static async createAnnouncementFromTemplate(ngoId: string, templateId: string, customData?: any): Promise<AnnouncementData> {
    const response = await api.post(`/content/${ngoId}/announcements/from-template/${templateId}`, customData);
    return response.data.data;
  }

  // ==================== ANALYTICS ====================

  static async getContentAnalytics(ngoId: string, timeframe?: string): Promise<{
    views: { total: number; unique: number; byPage: Record<string, number> };
    announcements: { total: number; published: number; byType: Record<string, number> };
    engagement: { likes: number; shares: number; comments: number };
  }> {
    const response = await api.get(`/content/${ngoId}/analytics`, {
      params: { timeframe }
    });
    return response.data.data;
  }
}

export default ContentService;
