import { io, Socket } from 'socket.io-client';

// Interface definitions for real-time events
export interface RealTimeUpdate {
  type: 'dashboard' | 'notification' | 'chart' | 'user_activity';
  data: any;
  timestamp: string;
  userId?: string;
  role?: string;
}

export interface NotificationUpdate {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface ChartUpdate {
  chartId: string;
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'area';
  timestamp: string;
}

export interface DashboardMetrics {
  kpis: Array<{
    title: string;
    value: number | string;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
  timestamp: string;
}

class EnhancedRealTimeService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners = new Map<string, Function[]>();

  constructor() {
    this.initialize();
  }

  // Initialize WebSocket connection
  private initialize() {
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventHandlers();
  }

  // Setup WebSocket event handlers
  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔗 WebSocket connected:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      this.reconnectAttempts++;
      this.emit('connection_error', { error, attempts: this.reconnectAttempts });
    });

    // Real-time data events
    this.socket.on('dashboard_update', (data: DashboardMetrics) => {
      console.log('📊 Dashboard update received:', data);
      this.emit('dashboard_update', data);
    });

    this.socket.on('notification_update', (notification: NotificationUpdate) => {
      console.log('🔔 Notification received:', notification);
      this.emit('notification_update', notification);
    });

    this.socket.on('chart_update', (chartData: ChartUpdate) => {
      console.log('📈 Chart update received:', chartData);
      this.emit('chart_update', chartData);
    });

    this.socket.on('user_activity', (activity: any) => {
      console.log('👤 User activity:', activity);
      this.emit('user_activity', activity);
    });

    // System events
    this.socket.on('system_alert', (alert: any) => {
      console.log('⚠️ System alert:', alert);
      this.emit('system_alert', alert);
    });
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Join a specific room (for role-based updates)
  joinRoom(room: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { room });
      console.log(`🏠 Joined room: ${room}`);
    }
  }

  // Leave a room
  leaveRoom(room: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { room });
      console.log(`🚪 Left room: ${room}`);
    }
  }

  // Request real-time dashboard metrics
  requestDashboardMetrics(role: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('dashboard_metrics_request', { role, timestamp: new Date().toISOString() });
    }
  }

  // Mark notification as read
  markNotificationRead(notificationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_notification_read', { notificationId });
    }
  }

  // Send user activity update
  sendUserActivity(activity: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user_activity', {
        ...activity,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Manual reconnection
  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Cleanup
  destroy() {
    this.disconnect();
    this.eventListeners.clear();
  }
}

// Create singleton instance
export const enhancedRealTimeService = new EnhancedRealTimeService();

// Export hook for React components
export const useRealTime = () => {
  return enhancedRealTimeService;
};
