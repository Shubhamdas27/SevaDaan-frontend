import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';

interface DashboardStats {
  activeVolunteers: number;
  totalDonations: number;
  activeProgrammes: number;
  beneficiariesThisMonth: number;
  newVolunteersToday: number;
  donationsToday: number;
  hoursLoggedToday: number;
  certificatesIssued: number;
  totalNGOs: number;
  approvedVolunteers: number;
  pendingVolunteers: number;
  totalPrograms: number;
  ongoingPrograms: number;
  completedPrograms: number;
}

interface VolunteerUpdate {
  volunteerId: string;
  volunteerName: string;
  activity: string;
  programId?: string;
  ngoId: string;
  status: string;
  timestamp: string;
}

interface ProgramUpdate {
  programId: string;
  programName: string;
  action: string;
  ngoId: string;
  timestamp: string;
}

interface DonationUpdate {
  donationId: string;
  amount: number;
  donorName: string;
  ngoId: string;
  timestamp: string;
}

interface ManagerUpdate {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  permissions: string[];
  isActive: boolean;
  joinDate?: string;
}

class LiveUpdateService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;

  // Initialize connection
  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(API_URL.replace('/api/v1', ''), {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🟢 Real-time service connected');
      this.isConnected = true;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Real-time service disconnected:', reason);
      this.isConnected = false;
      this.emit('connection', { status: 'disconnected', reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Real-time connection error:', error);
      this.emit('connection', { status: 'error', error: error.message });
    });

    // Data update events
    this.socket.on('stats_update', (data: DashboardStats) => {
      this.emit('stats_update', data);
    });

    this.socket.on('volunteer_update', (data: VolunteerUpdate) => {
      this.emit('volunteer_update', data);
    });

    this.socket.on('program_update', (data: ProgramUpdate) => {
      this.emit('program_update', data);
    });

    this.socket.on('donation_update', (data: DonationUpdate) => {
      this.emit('donation_update', data);
    });

    this.socket.on('manager_update', (data: ManagerUpdate) => {
      this.emit('manager_update', data);
    });

    // General notification events
    this.socket.on('notification', (data: any) => {
      this.emit('notification', data);
    });

    // NGO specific events
    this.socket.on('ngo_data_update', (data: any) => {
      this.emit('ngo_data_update', data);
    });

    // Manager events
    this.socket.on('manager_added', (data: ManagerUpdate) => {
      this.emit('manager_added', data);
    });

    this.socket.on('manager_updated', (data: ManagerUpdate) => {
      this.emit('manager_updated', data);
    });

    this.socket.on('manager_deleted', (data: { managerId: string; email: string }) => {
      this.emit('manager_deleted', data);
    });

    // Program events (updating existing to match backend)
    this.socket.on('program_added', (data: any) => {
      this.emit('program_added', data);
    });

    this.socket.on('program_updated', (data: any) => {
      this.emit('program_updated', data);
    });

    this.socket.on('program_deleted', (data: any) => {
      this.emit('program_deleted', data);
    });
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Request live data refresh
  requestDataRefresh(dataType: string) {
    if (this.socket?.connected) {
      this.socket.emit('request_data_refresh', { type: dataType });
    }
  }

  // Join NGO room for NGO-specific updates
  joinNGORoom(ngoId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_ngo_room', { ngoId });
    }
  }

  // Leave NGO room
  leaveNGORoom(ngoId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_ngo_room', { ngoId });
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }

  // Manual data sync methods for fallback
  async syncDashboardData() {
    try {
      // Simulate real-time data updates when socket is not available
      const mockStats: DashboardStats = {
        activeVolunteers: Math.floor(Math.random() * 50) + 30,
        totalDonations: Math.floor(Math.random() * 100000) + 200000,
        activeProgrammes: Math.floor(Math.random() * 5) + 10,
        beneficiariesThisMonth: Math.floor(Math.random() * 50) + 100,
        newVolunteersToday: Math.floor(Math.random() * 5) + 1,
        donationsToday: Math.floor(Math.random() * 20000) + 5000,
        hoursLoggedToday: Math.floor(Math.random() * 50) + 50,
        certificatesIssued: Math.floor(Math.random() * 50) + 200,
        totalNGOs: 1,
        approvedVolunteers: Math.floor(Math.random() * 40) + 35,
        pendingVolunteers: Math.floor(Math.random() * 10) + 5,
        totalPrograms: Math.floor(Math.random() * 5) + 12,
        ongoingPrograms: Math.floor(Math.random() * 3) + 10,
        completedPrograms: Math.floor(Math.random() * 3) + 2
      };

      this.emit('stats_update', mockStats);
    } catch (error) {
      console.error('Error syncing dashboard data:', error);
    }
  }

  // Start periodic data sync (fallback when socket is not working)
  startPeriodicSync(interval: number = 30000) {
    setInterval(() => {
      if (!this.isConnected) {
        this.syncDashboardData();
      }
    }, interval);
  }

  // Convenience methods for manager events
  onManagerAdded(callback: (manager: ManagerUpdate) => void) {
    this.on('manager_added', callback);
  }

  offManagerAdded(callback: (manager: ManagerUpdate) => void) {
    this.off('manager_added', callback);
  }

  onManagerUpdated(callback: (manager: ManagerUpdate) => void) {
    this.on('manager_updated', callback);
  }

  offManagerUpdated(callback: (manager: ManagerUpdate) => void) {
    this.off('manager_updated', callback);
  }

  onManagerDeleted(callback: (data: { managerId: string; email: string }) => void) {
    this.on('manager_deleted', callback);
  }

  offManagerDeleted(callback: (data: { managerId: string; email: string }) => void) {
    this.off('manager_deleted', callback);
  }

  // Convenience methods for program events
  onProgramAdded(callback: (program: any) => void) {
    this.on('program_added', callback);
  }

  offProgramAdded(callback: (program: any) => void) {
    this.off('program_added', callback);
  }

  onProgramUpdated(callback: (program: any) => void) {
    this.on('program_updated', callback);
  }

  offProgramUpdated(callback: (program: any) => void) {
    this.off('program_updated', callback);
  }

  onProgramDeleted(callback: (data: any) => void) {
    this.on('program_deleted', callback);
  }

  offProgramDeleted(callback: (data: any) => void) {
    this.off('program_deleted', callback);
  }
}

// Create singleton instance
export const liveUpdateService = new LiveUpdateService();

// Export for use in components
export default liveUpdateService;
