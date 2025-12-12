import { api } from './api';

export interface IntegrationConfig {
  id?: string;
  name: string;
  type: 'payment' | 'email' | 'sms' | 'social' | 'analytics' | 'crm' | 'storage' | 'notification' | 'other';
  provider: string;
  isActive: boolean;
  config: Record<string, any>;
  endpoints?: {
    baseUrl: string;
    authentication?: {
      type: 'api_key' | 'oauth' | 'basic' | 'bearer';
      credentials: Record<string, any>;
    };
    rateLimit?: {
      requests: number;
      period: string;
    };
  };
  webhooks?: {
    url: string;
    events: string[];
    secret?: string;
  };
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  lastSyncAt?: string;
  status?: 'active' | 'inactive' | 'error' | 'pending';
}

export interface AvailableIntegration {
  id: string;
  name: string;
  description: string;
  type: 'payment' | 'email' | 'sms' | 'social' | 'analytics' | 'crm' | 'storage' | 'notification' | 'other';
  provider: string;
  logoUrl?: string;
  features: string[];
  configFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'url' | 'number' | 'select' | 'checkbox';
    required: boolean;
    description?: string;
    options?: Array<{ label: string; value: string }>;
    placeholder?: string;
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
    };
  }>;
  documentation?: {
    setupGuide: string;
    apiReference: string;
    examples: string;
  };
  pricing?: {
    free: boolean;
    plans: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  };
}

export interface SyncJob {
  id?: string;
  integrationId: string;
  type: 'full' | 'incremental' | 'webhook';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  direction: 'import' | 'export' | 'bidirectional';
  dataType: 'users' | 'donations' | 'programs' | 'events' | 'volunteers' | 'all';
  config?: {
    batchSize?: number;
    filters?: Record<string, any>;
    mapping?: Record<string, string>;
  };
  progress?: {
    total: number;
    processed: number;
    errors: number;
    warnings: number;
  };
  startedAt?: string;
  completedAt?: string;
  error?: string;
  logs?: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    details?: any;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebhookEvent {
  id?: string;
  integrationId: string;
  eventType: string;
  payload: Record<string, any>;
  headers: Record<string, string>;
  timestamp: string;
  status: 'pending' | 'processed' | 'failed' | 'ignored';
  processedAt?: string;
  response?: {
    statusCode: number;
    body: any;
    error?: string;
  };
  retryCount?: number;
  nextRetryAt?: string;
}

export class APIIntegrationService {
  // ==================== INTEGRATION MANAGEMENT ====================
  
  static async getAvailableIntegrations(): Promise<AvailableIntegration[]> {
    const response = await api.get('/integrations/available');
    return response.data.data;
  }

  static async getIntegrationById(integrationId: string): Promise<AvailableIntegration> {
    const response = await api.get(`/integrations/available/${integrationId}`);
    return response.data.data;
  }

  static async getConfiguredIntegrations(ngoId: string): Promise<IntegrationConfig[]> {
    const response = await api.get(`/integrations/${ngoId}`);
    return response.data.data;
  }

  static async getIntegrationConfig(ngoId: string, configId: string): Promise<IntegrationConfig> {
    const response = await api.get(`/integrations/${ngoId}/${configId}`);
    return response.data.data;
  }

  static async createIntegration(ngoId: string, integration: {
    name: string;
    type: string;
    provider: string;
    config: Record<string, any>;
    endpoints?: any;
    webhooks?: any;
    metadata?: Record<string, any>;
  }): Promise<IntegrationConfig> {
    const response = await api.post(`/integrations/${ngoId}`, integration);
    return response.data.data;
  }

  static async updateIntegration(ngoId: string, configId: string, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    const response = await api.put(`/integrations/${ngoId}/${configId}`, updates);
    return response.data.data;
  }

  static async deleteIntegration(ngoId: string, configId: string): Promise<void> {
    await api.delete(`/integrations/${ngoId}/${configId}`);
  }

  static async toggleIntegration(ngoId: string, configId: string, isActive: boolean): Promise<IntegrationConfig> {
    const response = await api.patch(`/integrations/${ngoId}/${configId}/toggle`, { isActive });
    return response.data.data;
  }

  // ==================== INTEGRATION TESTING ====================

  static async testIntegration(ngoId: string, configId: string, testType?: string): Promise<{
    success: boolean;
    statusCode?: number;
    response?: any;
    error?: string;
    latency?: number;
    timestamp: string;
  }> {
    const response = await api.post(`/integrations/${ngoId}/${configId}/test`, { testType });
    return response.data.data;
  }

  static async validateConfig(ngoId: string, config: {
    type: string;
    provider: string;
    config: Record<string, any>;
    endpoints?: any;
  }): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    const response = await api.post(`/integrations/${ngoId}/validate`, config);
    return response.data.data;
  }

  static async getConnectionStatus(ngoId: string, configId: string): Promise<{
    status: 'connected' | 'disconnected' | 'error' | 'unknown';
    lastChecked: string;
    error?: string;
    responseTime?: number;
    uptime?: number;
  }> {
    const response = await api.get(`/integrations/${ngoId}/${configId}/status`);
    return response.data.data;
  }

  // ==================== DATA SYNCHRONIZATION ====================

  static async syncData(ngoId: string, configId: string, syncConfig: {
    type: 'full' | 'incremental';
    direction: 'import' | 'export' | 'bidirectional';
    dataType: 'users' | 'donations' | 'programs' | 'events' | 'volunteers' | 'all';
    config?: {
      batchSize?: number;
      filters?: Record<string, any>;
      mapping?: Record<string, string>;
    };
  }): Promise<SyncJob> {
    const response = await api.post(`/integrations/${ngoId}/${configId}/sync`, syncConfig);
    return response.data.data;
  }

  static async getSyncJobs(ngoId: string, configId?: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    dataType?: string;
  }): Promise<{
    jobs: SyncJob[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/integrations/${ngoId}/sync-jobs`, {
      params: { configId, ...params }
    });
    return response.data.data;
  }

  static async getSyncJobById(ngoId: string, jobId: string): Promise<SyncJob> {
    const response = await api.get(`/integrations/${ngoId}/sync-jobs/${jobId}`);
    return response.data.data;
  }

  static async cancelSyncJob(ngoId: string, jobId: string): Promise<SyncJob> {
    const response = await api.patch(`/integrations/${ngoId}/sync-jobs/${jobId}/cancel`);
    return response.data.data;
  }

  static async retrySyncJob(ngoId: string, jobId: string): Promise<SyncJob> {
    const response = await api.post(`/integrations/${ngoId}/sync-jobs/${jobId}/retry`);
    return response.data.data;
  }

  static async getSyncJobLogs(ngoId: string, jobId: string, params?: {
    level?: 'info' | 'warn' | 'error';
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      timestamp: string;
      level: 'info' | 'warn' | 'error';
      message: string;
      details?: any;
    }>;
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/integrations/${ngoId}/sync-jobs/${jobId}/logs`, { params });
    return response.data.data;
  }

  // ==================== WEBHOOK MANAGEMENT ====================

  static async configureWebhook(ngoId: string, configId: string, webhook: {
    url: string;
    events: string[];
    secret?: string;
    headers?: Record<string, string>;
  }): Promise<IntegrationConfig> {
    const response = await api.put(`/integrations/${ngoId}/${configId}/webhook`, webhook);
    return response.data.data;
  }

  static async testWebhook(ngoId: string, configId: string, eventType?: string): Promise<{
    success: boolean;
    statusCode?: number;
    response?: any;
    error?: string;
    timestamp: string;
  }> {
    const response = await api.post(`/integrations/${ngoId}/${configId}/webhook/test`, { eventType });
    return response.data.data;
  }

  static async getWebhookEvents(ngoId: string, configId?: string, params?: {
    page?: number;
    limit?: number;
    eventType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    events: WebhookEvent[];
    total: number;
    page: number;
    pages: number;
  }> {
    const response = await api.get(`/integrations/${ngoId}/webhook-events`, {
      params: { configId, ...params }
    });
    return response.data.data;
  }

  static async getWebhookEventById(ngoId: string, eventId: string): Promise<WebhookEvent> {
    const response = await api.get(`/integrations/${ngoId}/webhook-events/${eventId}`);
    return response.data.data;
  }

  static async retryWebhookEvent(ngoId: string, eventId: string): Promise<WebhookEvent> {
    const response = await api.post(`/integrations/${ngoId}/webhook-events/${eventId}/retry`);
    return response.data.data;
  }

  static async markWebhookEventAsProcessed(ngoId: string, eventId: string): Promise<WebhookEvent> {
    const response = await api.patch(`/integrations/${ngoId}/webhook-events/${eventId}/processed`);
    return response.data.data;
  }

  // ==================== DATA MAPPING ====================

  static async getDataMappings(ngoId: string, configId: string, dataType: string): Promise<{
    mappings: Record<string, string>;
    sourceFields: Array<{
      name: string;
      type: string;
      description?: string;
      required: boolean;
    }>;
    targetFields: Array<{
      name: string;
      type: string;
      description?: string;
      required: boolean;
    }>;
  }> {
    const response = await api.get(`/integrations/${ngoId}/${configId}/mappings/${dataType}`);
    return response.data.data;
  }

  static async updateDataMappings(ngoId: string, configId: string, dataType: string, mappings: Record<string, string>): Promise<{
    mappings: Record<string, string>;
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await api.put(`/integrations/${ngoId}/${configId}/mappings/${dataType}`, { mappings });
    return response.data.data;
  }

  static async getDefaultMappings(provider: string, dataType: string): Promise<Record<string, string>> {
    const response = await api.get(`/integrations/default-mappings/${provider}/${dataType}`);
    return response.data.data;
  }

  // ==================== INTEGRATION ANALYTICS ====================

  static async getIntegrationAnalytics(ngoId: string, configId?: string, timeframe?: string): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    totalSyncJobs: number;
    successfulSyncs: number;
    failedSyncs: number;
    totalWebhookEvents: number;
    processedEvents: number;
    failedEvents: number;
    averageResponseTime: number;
    uptimePercentage: number;
    syncFrequency: Array<{
      date: string;
      totalJobs: number;
      successfulJobs: number;
      failedJobs: number;
    }>;
    integrationUsage: Array<{
      integrationId: string;
      name: string;
      provider: string;
      totalSyncs: number;
      successRate: number;
      lastSync: string;
    }>;
    errorSummary: Array<{
      error: string;
      count: number;
      integrations: string[];
    }>;
  }> {
    const response = await api.get(`/integrations/${ngoId}/analytics`, {
      params: { configId, timeframe }
    });
    return response.data.data;
  }

  static async getIntegrationHealth(ngoId: string): Promise<Array<{
    integrationId: string;
    name: string;
    provider: string;
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    lastCheck: string;
    uptime: number;
    responseTime: number;
    errorRate: number;
    issues: Array<{
      type: 'connectivity' | 'authentication' | 'rate_limit' | 'data_sync' | 'webhook';
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      detectedAt: string;
    }>;
  }>> {
    const response = await api.get(`/integrations/${ngoId}/health`);
    return response.data.data;
  }

  // ==================== EXPORT AND BACKUP ====================

  static async exportIntegrationConfig(ngoId: string, configId?: string): Promise<Blob> {
    const response = await api.get(`/integrations/${ngoId}/export`, {
      params: { configId },
      responseType: 'blob'
    });
    return response.data;
  }

  static async importIntegrationConfig(ngoId: string, file: File): Promise<{
    imported: IntegrationConfig[];
    failed: Array<{
      integration: any;
      error: string;
    }>;
  }> {
    const formData = new FormData();
    formData.append('config', file);
    
    const response = await api.post(`/integrations/${ngoId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  static async createBackup(ngoId: string, options?: {
    includeSecrets?: boolean;
    includeHistory?: boolean;
    compressionLevel?: number;
  }): Promise<{
    backupId: string;
    status: 'creating' | 'completed' | 'failed';
    downloadUrl?: string;
  }> {
    const response = await api.post(`/integrations/${ngoId}/backup`, options);
    return response.data.data;
  }

  static async restoreFromBackup(ngoId: string, file: File, options?: {
    overwriteExisting?: boolean;
    skipValidation?: boolean;
  }): Promise<{
    restored: IntegrationConfig[];
    skipped: string[];
    failed: Array<{
      integration: any;
      error: string;
    }>;
  }> {
    const formData = new FormData();
    formData.append('backup', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    
    const response = await api.post(`/integrations/${ngoId}/restore`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}

export default APIIntegrationService;
