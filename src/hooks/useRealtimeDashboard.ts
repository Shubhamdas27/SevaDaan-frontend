import { useState, useEffect, useCallback } from 'react';
import { useSocketEvent } from '../context/SocketContext';
import { useRealTime, DashboardMetrics, NotificationUpdate, ChartUpdate } from '../services/enhancedRealTimeService';
import { useAuth } from '../context/AuthContext';
import { 
  DonationSocketData, 
  VolunteerSocketData, 
  ApplicationSocketData, 
  ProgramSocketData,
  DashboardUpdateData,
  SOCKET_EVENTS 
} from '../types/socket';

interface DashboardStats {
  totalDonations: number;
  totalVolunteers: number;
  totalApplications: number;
  totalPrograms: number;
  recentDonations: DonationSocketData[];
  recentVolunteers: VolunteerSocketData[];
  recentApplications: ApplicationSocketData[];
  recentPrograms: ProgramSocketData[];
}

export const useRealtimeDashboard = (userRole: string, ngoId?: string) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalVolunteers: 0,
    totalApplications: 0,
    totalPrograms: 0,
    recentDonations: [],
    recentVolunteers: [],
    recentApplications: [],
    recentPrograms: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // Handle new donations
  useSocketEvent(SOCKET_EVENTS.DONATION_NEW, useCallback((donation: DonationSocketData) => {
    // Only update if relevant to user (same NGO or if user is admin/donor)
    const isRelevant = !ngoId || donation.ngoId === ngoId || ['admin', 'donor'].includes(userRole);
    
    if (isRelevant) {
      setStats(prev => ({
        ...prev,
        totalDonations: prev.totalDonations + 1,
        recentDonations: [donation, ...prev.recentDonations.slice(0, 9)] // Keep last 10
      }));
    }
  }, [ngoId, userRole]));

  // Handle volunteer updates
  useSocketEvent(SOCKET_EVENTS.VOLUNTEER_UPDATE, useCallback((volunteer: VolunteerSocketData) => {
    const isRelevant = !ngoId || volunteer.ngoId === ngoId || userRole === 'admin';
    
    if (isRelevant) {
      setStats(prev => ({
        ...prev,
        totalVolunteers: prev.totalVolunteers + (volunteer.activity === 'application_submitted' ? 1 : 0),
        recentVolunteers: [volunteer, ...prev.recentVolunteers.slice(0, 9)]
      }));
    }
  }, [ngoId, userRole]));

  // Handle application status changes
  useSocketEvent(SOCKET_EVENTS.APPLICATION_STATUS_CHANGED, useCallback((application: ApplicationSocketData) => {
    const isRelevant = !ngoId || application.ngoId === ngoId || userRole === 'admin';
    
    if (isRelevant) {
      setStats(prev => ({
        ...prev,
        recentApplications: [application, ...prev.recentApplications.slice(0, 9)]
      }));
    }
  }, [ngoId, userRole]));

  // Handle new applications
  useSocketEvent(SOCKET_EVENTS.APPLICATION_NEW, useCallback((application: ApplicationSocketData) => {
    const isRelevant = !ngoId || application.ngoId === ngoId || userRole === 'admin';
    
    if (isRelevant) {
      setStats(prev => ({
        ...prev,
        totalApplications: prev.totalApplications + 1,
        recentApplications: [application, ...prev.recentApplications.slice(0, 9)]
      }));
    }
  }, [ngoId, userRole]));

  // Handle new programs
  useSocketEvent(SOCKET_EVENTS.PROGRAM_NEW, useCallback((program: ProgramSocketData) => {
    const isRelevant = !ngoId || program.ngoId === ngoId || ['admin', 'volunteer', 'citizen'].includes(userRole);
    
    if (isRelevant) {
      setStats(prev => ({
        ...prev,
        totalPrograms: prev.totalPrograms + 1,
        recentPrograms: [program, ...prev.recentPrograms.slice(0, 9)]
      }));
    }
  }, [ngoId, userRole]));

  // Handle dashboard updates
  useSocketEvent(SOCKET_EVENTS.DASHBOARD_UPDATE, useCallback((update: DashboardUpdateData) => {
    // Update specific stats based on update type
    setStats(prev => ({
      ...prev,
      ...update.data
    }));
  }, []));

  // Initial data fetch (you would replace this with actual API call)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/dashboard/stats?role=${userRole}&ngoId=${ngoId}`);
        // const data = await response.json();
        
        // For now, set initial empty state
        setStats({
          totalDonations: 0,
          totalVolunteers: 0,
          totalApplications: 0,
          totalPrograms: 0,
          recentDonations: [],
          recentVolunteers: [],
          recentApplications: [],
          recentPrograms: []
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch initial dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [userRole, ngoId]);

  return {
    stats,
    isLoading,
    // Helper functions
    refreshStats: () => {
      setIsLoading(true);
      // Trigger refresh
    }
  };
};

// Hook for managing real-time charts/graphs
export const useRealtimeCharts = (ngoId?: string) => {
  const [chartData, setChartData] = useState<{
    donationTrends: Array<{ date: string; amount: number; timestamp: string }>;
    volunteerActivity: Array<{ date: string; count: number; timestamp: string }>;
    applicationStats: Array<{ date: string; status: string; count: number; timestamp: string }>;
  }>({
    donationTrends: [],
    volunteerActivity: [],
    applicationStats: []
  });

  // Listen for stats updates
  useSocketEvent(SOCKET_EVENTS.STATS_UPDATE, useCallback((data: any) => {
    setChartData(prev => ({
      ...prev,
      ...data
    }));
  }, []));

  // Update chart data when new events come in
  useSocketEvent(SOCKET_EVENTS.DONATION_NEW, useCallback((donation: DonationSocketData) => {
    if (!ngoId || donation.ngoId === ngoId) {
      setChartData(prev => ({
        ...prev,
        donationTrends: [...prev.donationTrends, {
          date: new Date(donation.timestamp).toISOString().split('T')[0],
          amount: donation.amount,
          timestamp: donation.timestamp
        }].slice(-30) // Keep last 30 entries
      }));
    }
  }, [ngoId]));

  return {
    chartData,
    updateChartData: setChartData
  };
};

// Enhanced Real-time Dashboard Hook with WebSocket integration
export const useEnhancedRealtimeDashboard = () => {
  const realTimeService = useRealTime();
  const { user } = useAuth();
  
  const [state, setState] = useState({
    isConnected: false,
    lastUpdate: null as string | null,
    metrics: null as DashboardMetrics | null,
    notifications: [] as NotificationUpdate[],
    chartUpdates: new Map<string, ChartUpdate>(),
    connectionAttempts: 0
  });

  // Update dashboard metrics
  const handleDashboardUpdate = useCallback((metrics: DashboardMetrics) => {
    setState(prev => ({
      ...prev,
      metrics,
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // Handle new notifications
  const handleNotificationUpdate = useCallback((notification: NotificationUpdate) => {
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications.slice(0, 9)], // Keep latest 10
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // Handle chart updates
  const handleChartUpdate = useCallback((chartUpdate: ChartUpdate) => {
    setState(prev => {
      const newChartUpdates = new Map(prev.chartUpdates);
      newChartUpdates.set(chartUpdate.chartId, chartUpdate);
      
      return {
        ...prev,
        chartUpdates: newChartUpdates,
        lastUpdate: new Date().toISOString()
      };
    });
  }, []);

  // Handle connection status changes
  const handleConnectionStatus = useCallback((status: { connected: boolean; reason?: string }) => {
    setState(prev => ({
      ...prev,
      isConnected: status.connected
    }));

    if (status.connected && user?.role) {
      // Join role-based room and request initial data
      realTimeService.joinRoom(`role_${user.role}`);
      realTimeService.requestDashboardMetrics(user.role);
    }
  }, [realTimeService, user?.role]);

  // Handle connection errors
  const handleConnectionError = useCallback((error: { attempts: number }) => {
    setState(prev => ({
      ...prev,
      connectionAttempts: error.attempts
    }));
  }, []);

  // Initialize real-time listeners
  useEffect(() => {
    // Set up event listeners
    realTimeService.on('dashboard_update', handleDashboardUpdate);
    realTimeService.on('notification_update', handleNotificationUpdate);
    realTimeService.on('chart_update', handleChartUpdate);
    realTimeService.on('connection_status', handleConnectionStatus);
    realTimeService.on('connection_error', handleConnectionError);

    // Join user's role room if connected
    if (user?.role) {
      realTimeService.joinRoom(`role_${user.role}`);
      realTimeService.requestDashboardMetrics(user.role);
    }

    // Cleanup on unmount
    return () => {
      realTimeService.off('dashboard_update', handleDashboardUpdate);
      realTimeService.off('notification_update', handleNotificationUpdate);
      realTimeService.off('chart_update', handleChartUpdate);
      realTimeService.off('connection_status', handleConnectionStatus);
      realTimeService.off('connection_error', handleConnectionError);
    };
  }, [
    realTimeService,
    user?.role,
    handleDashboardUpdate,
    handleNotificationUpdate,
    handleChartUpdate,
    handleConnectionStatus,
    handleConnectionError
  ]);

  // Utility functions
  const markNotificationAsRead = useCallback((notificationId: string) => {
    realTimeService.markNotificationRead(notificationId);
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  }, [realTimeService]);

  const requestRefresh = useCallback(() => {
    if (user?.role) {
      realTimeService.requestDashboardMetrics(user.role);
    }
  }, [realTimeService, user?.role]);

  const reconnect = useCallback(() => {
    realTimeService.reconnect();
  }, [realTimeService]);

  const getChartData = useCallback((chartId: string) => {
    return state.chartUpdates.get(chartId);
  }, [state.chartUpdates]);

  const sendUserActivity = useCallback((activity: any) => {
    realTimeService.sendUserActivity({
      ...activity,
      userId: user?.id,
      role: user?.role
    });
  }, [realTimeService, user?.id, user?.role]);

  return {
    // State
    isConnected: state.isConnected,
    lastUpdate: state.lastUpdate,
    metrics: state.metrics,
    notifications: state.notifications,
    connectionAttempts: state.connectionAttempts,
    
    // Actions
    markNotificationAsRead,
    requestRefresh,
    reconnect,
    getChartData,
    sendUserActivity,
    
    // Utility
    unreadNotificationsCount: state.notifications.filter(n => !n.read).length,
    connectionStatus: realTimeService.getConnectionStatus()
  };
};
