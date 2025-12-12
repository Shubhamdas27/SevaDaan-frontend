import { api } from './api';

export interface AnalyticsData {
  timeframe: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
}

export interface DashboardAnalytics extends AnalyticsData {
  overview: {
    totalUsers: number;
    totalDonations: number;
    totalVolunteers: number;
    totalPrograms: number;
    totalBeneficiaries: number;
  };
  donations: {
    totalAmount: number;
    totalTransactions: number;
    averageDonation: number;
    monthlyTrend: Array<{
      month: string;
      amount: number;
      transactions: number;
    }>;
    topDonors: Array<{
      donorId: string;
      donorName: string;
      totalAmount: number;
      totalDonations: number;
    }>;
    donationsByCategory: Record<string, number>;
  };
  programs: {
    totalActive: number;
    totalCompleted: number;
    totalBeneficiaries: number;
    registrationTrend: Array<{
      month: string;
      registrations: number;
      completions: number;
    }>;
    topPrograms: Array<{
      programId: string;
      programName: string;
      registrations: number;
      completionRate: number;
    }>;
  };
  volunteers: {
    totalActive: number;
    totalHours: number;
    averageHoursPerVolunteer: number;
    activitiesTrend: Array<{
      month: string;
      volunteers: number;
      hours: number;
      activities: number;
    }>;
    topVolunteers: Array<{
      volunteerId: string;
      volunteerName: string;
      totalHours: number;
      totalActivities: number;
    }>;
  };
  engagement: {
    websiteViews: number;
    pageViews: Record<string, number>;
    userSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
}

export interface KPIData {
  name: string;
  value: number;
  target?: number;
  change: {
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  unit: string;
  category: 'financial' | 'operational' | 'engagement' | 'impact';
  description?: string;
}

export interface ExportRequest {
  type: 'dashboard' | 'donations' | 'programs' | 'volunteers' | 'events' | 'custom';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  timeframe?: string;
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
  includeCharts?: boolean;
  includeRawData?: boolean;
}

export class AnalyticsService {
  // ==================== DASHBOARD ANALYTICS ====================
  
  static async getDashboardAnalytics(ngoId: string, timeframe?: string): Promise<DashboardAnalytics> {
    const response = await api.get(`/analytics/${ngoId}/dashboard`, {
      params: { timeframe }
    });
    return response.data.data;
  }

  static async getOverviewStats(ngoId: string): Promise<{
    totalUsers: number;
    totalDonations: number;
    totalVolunteers: number;
    totalPrograms: number;
    totalBeneficiaries: number;
    totalEvents: number;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
      userId?: string;
      userName?: string;
    }>;
  }> {
    const response = await api.get(`/analytics/${ngoId}/overview`);
    return response.data.data;
  }

  // ==================== DONATION ANALYTICS ====================

  static async getDonationAnalytics(ngoId: string, params?: {
    timeframe?: string;
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Promise<{
    totalAmount: number;
    totalTransactions: number;
    averageDonation: number;
    trends: Array<{
      period: string;
      amount: number;
      transactions: number;
      averageAmount: number;
    }>;
    topDonors: Array<{
      donorId: string;
      donorName: string;
      totalAmount: number;
      totalDonations: number;
      lastDonation: string;
    }>;
    donationsByCategory: Record<string, number>;
    donationsByAmount: {
      small: number; // < 100
      medium: number; // 100-1000
      large: number; // 1000-10000
      major: number; // > 10000
    };
    recurringDonations: {
      total: number;
      active: number;
      totalAmount: number;
    };
  }> {
    const response = await api.get(`/analytics/${ngoId}/donations`, { params });
    return response.data.data;
  }

  // ==================== PROGRAM ANALYTICS ====================

  static async getProgramAnalytics(ngoId: string, params?: {
    timeframe?: string;
    startDate?: string;
    endDate?: string;
    programId?: string;
  }): Promise<{
    totalPrograms: number;
    activePrograms: number;
    completedPrograms: number;
    totalBeneficiaries: number;
    averageCompletionRate: number;
    programPerformance: Array<{
      programId: string;
      programName: string;
      registrations: number;
      completions: number;
      completionRate: number;
      averageRating: number;
      beneficiaries: number;
    }>;
    registrationTrends: Array<{
      period: string;
      registrations: number;
      completions: number;
      dropouts: number;
    }>;
    beneficiaryDemographics: {
      ageGroups: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
  }> {
    const response = await api.get(`/analytics/${ngoId}/programs`, { params });
    return response.data.data;
  }

  // ==================== VOLUNTEER ANALYTICS ====================

  static async getVolunteerAnalytics(ngoId: string, params?: {
    timeframe?: string;
    startDate?: string;
    endDate?: string;
    volunteerId?: string;
  }): Promise<{
    totalVolunteers: number;
    activeVolunteers: number;
    totalHours: number;
    totalActivities: number;
    averageHoursPerVolunteer: number;
    retentionRate: number;
    volunteerTrends: Array<{
      period: string;
      newVolunteers: number;
      activeVolunteers: number;
      totalHours: number;
      activities: number;
    }>;
    topVolunteers: Array<{
      volunteerId: string;
      volunteerName: string;
      totalHours: number;
      totalActivities: number;
      joinDate: string;
      lastActivity: string;
    }>;
    skillsDistribution: Record<string, number>;
    locationDistribution: Record<string, number>;
  }> {
    const response = await api.get(`/analytics/${ngoId}/volunteers`, { params });
    return response.data.data;
  }

  // ==================== EVENT ANALYTICS ====================

  static async getEventAnalytics(ngoId: string, params?: {
    timeframe?: string;
    startDate?: string;
    endDate?: string;
    eventId?: string;
  }): Promise<{
    totalEvents: number;
    totalRegistrations: number;
    totalAttendees: number;
    averageAttendanceRate: number;
    averageEventRating: number;
    eventTrends: Array<{
      period: string;
      events: number;
      registrations: number;
      attendees: number;
      attendanceRate: number;
    }>;
    topEvents: Array<{
      eventId: string;
      eventTitle: string;
      registrations: number;
      attendees: number;
      attendanceRate: number;
      averageRating: number;
    }>;
    eventsByType: Record<string, number>;
    eventsByCategory: Record<string, number>;
  }> {
    const response = await api.get(`/analytics/${ngoId}/events`, { params });
    return response.data.data;
  }

  // ==================== KPI MANAGEMENT ====================

  static async getKPIs(ngoId: string, category?: string): Promise<KPIData[]> {
    const response = await api.get(`/analytics/${ngoId}/kpis`, {
      params: { category }
    });
    return response.data.data;
  }

  static async updateKPITarget(ngoId: string, kpiName: string, target: number): Promise<KPIData> {
    const response = await api.put(`/analytics/${ngoId}/kpis/${kpiName}/target`, { target });
    return response.data.data;
  }

  static async getKPIHistory(ngoId: string, kpiName: string, timeframe?: string): Promise<Array<{
    date: string;
    value: number;
    target?: number;
  }>> {
    const response = await api.get(`/analytics/${ngoId}/kpis/${kpiName}/history`, {
      params: { timeframe }
    });
    return response.data.data;
  }

  // ==================== CUSTOM ANALYTICS ====================

  static async createCustomQuery(ngoId: string, query: {
    name: string;
    description?: string;
    dataSource: string;
    filters: Record<string, any>;
    groupBy?: string[];
    metrics: string[];
    timeframe?: string;
  }): Promise<{
    queryId: string;
    results: any[];
    totalRecords: number;
    executionTime: number;
  }> {
    const response = await api.post(`/analytics/${ngoId}/custom-query`, query);
    return response.data.data;
  }

  static async runSavedQuery(ngoId: string, queryId: string, params?: Record<string, any>): Promise<{
    results: any[];
    totalRecords: number;
    executionTime: number;
  }> {
    const response = await api.post(`/analytics/${ngoId}/queries/${queryId}/run`, params);
    return response.data.data;
  }

  static async getSavedQueries(ngoId: string): Promise<Array<{
    id: string;
    name: string;
    description?: string;
    dataSource: string;
    createdAt: string;
    lastRun?: string;
  }>> {
    const response = await api.get(`/analytics/${ngoId}/queries`);
    return response.data.data;
  }

  static async deleteQuery(ngoId: string, queryId: string): Promise<void> {
    await api.delete(`/analytics/${ngoId}/queries/${queryId}`);
  }

  // ==================== VISUALIZATION ====================

  static async generateChart(ngoId: string, config: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
    dataSource: string;
    xAxis: string;
    yAxis: string | string[];
    filters?: Record<string, any>;
    groupBy?: string;
    timeframe?: string;
    title?: string;
  }): Promise<{
    chartId: string;
    data: any[];
    config: any;
    chartUrl?: string;
  }> {
    const response = await api.post(`/analytics/${ngoId}/charts`, config);
    return response.data.data;
  }

  static async getChart(ngoId: string, chartId: string): Promise<{
    data: any[];
    config: any;
    chartUrl?: string;
  }> {
    const response = await api.get(`/analytics/${ngoId}/charts/${chartId}`);
    return response.data.data;
  }

  static async getSavedCharts(ngoId: string): Promise<Array<{
    id: string;
    title: string;
    type: string;
    dataSource: string;
    createdAt: string;
    lastUpdated: string;
  }>> {
    const response = await api.get(`/analytics/${ngoId}/charts`);
    return response.data.data;
  }

  // ==================== REPORTING ====================

  static async generateReport(ngoId: string, config: {
    name: string;
    type: 'dashboard' | 'donations' | 'programs' | 'volunteers' | 'events' | 'custom';
    timeframe?: string;
    startDate?: string;
    endDate?: string;
    includeCharts?: boolean;
    sections?: string[];
    filters?: Record<string, any>;
  }): Promise<{
    reportId: string;
    status: 'generating' | 'completed' | 'failed';
    downloadUrl?: string;
  }> {
    const response = await api.post(`/analytics/${ngoId}/reports`, config);
    return response.data.data;
  }

  static async getReportStatus(ngoId: string, reportId: string): Promise<{
    status: 'generating' | 'completed' | 'failed';
    progress?: number;
    downloadUrl?: string;
    error?: string;
  }> {
    const response = await api.get(`/analytics/${ngoId}/reports/${reportId}/status`);
    return response.data.data;
  }

  static async downloadReport(ngoId: string, reportId: string): Promise<Blob> {
    const response = await api.get(`/analytics/${ngoId}/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  static async getReports(ngoId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<{
    reports: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      createdAt: string;
      downloadUrl?: string;
    }>;
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/analytics/${ngoId}/reports`, { params });
    return response.data.data;
  }

  // ==================== EXPORT FUNCTIONS ====================

  static async exportData(ngoId: string, request: ExportRequest): Promise<{
    exportId: string;
    status: 'processing' | 'completed' | 'failed';
    downloadUrl?: string;
  }> {
    const response = await api.post(`/analytics/${ngoId}/export`, request);
    return response.data.data;
  }

  static async getExportStatus(ngoId: string, exportId: string): Promise<{
    status: 'processing' | 'completed' | 'failed';
    progress?: number;
    downloadUrl?: string;
    error?: string;
  }> {
    const response = await api.get(`/analytics/${ngoId}/exports/${exportId}/status`);
    return response.data.data;
  }

  static async downloadExport(ngoId: string, exportId: string): Promise<Blob> {
    const response = await api.get(`/analytics/${ngoId}/exports/${exportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // ==================== REAL-TIME ANALYTICS ====================

  static async getRealTimeStats(ngoId: string): Promise<{
    activeUsers: number;
    currentSessions: number;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
      userId?: string;
    }>;
    todayStats: {
      donations: number;
      registrations: number;
      volunteerHours: number;
      newUsers: number;
    };
  }> {
    const response = await api.get(`/analytics/${ngoId}/real-time`);
    return response.data.data;
  }

  static async getAlerts(ngoId: string): Promise<Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    isRead: boolean;
    actionRequired?: boolean;
    actionUrl?: string;
  }>> {
    const response = await api.get(`/analytics/${ngoId}/alerts`);
    return response.data.data;
  }

  static async markAlertAsRead(ngoId: string, alertId: string): Promise<void> {
    await api.patch(`/analytics/${ngoId}/alerts/${alertId}/read`);
  }

  static async dismissAlert(ngoId: string, alertId: string): Promise<void> {
    await api.delete(`/analytics/${ngoId}/alerts/${alertId}`);
  }
}

export default AnalyticsService;
