import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export interface SocketEvent {
  event: string;
  data: any;
  timestamp: Date;
}

export interface ConnectionStats {
  connected: boolean;
  connecting: boolean;
  disconnected: boolean;
  error: string | null;
  reconnectAttempts: number;
  lastConnectedAt: Date | null;
}

export interface UseSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    connected: false,
    connecting: false,
    disconnected: true,
    error: null,
    reconnectAttempts: 0,
    lastConnectedAt: null
  });
  
  const [eventHistory, setEventHistory] = useState<SocketEvent[]>([]);
  const eventListeners = useRef<Map<string, ((...args: any[]) => void)[]>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
    timeout = 20000
  } = options;

  // Connect to socket
  const connect = useCallback(() => {
    const token = localStorage.getItem('sevadaan_token');
    
    if (!token || !user) {
      console.warn('Cannot connect to socket: No authentication token or user');
      return;
    }

    if (socket?.connected) {
      console.warn('Socket already connected');
      return;
    }

    setConnectionStats(prev => ({ ...prev, connecting: true, error: null }));

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout,
      reconnection,
      reconnectionAttempts,
      reconnectionDelay
    });

    // Connection events
    newSocket.on('connect', () => {
      setConnectionStats(prev => ({
        ...prev,
        connected: true,
        connecting: false,
        disconnected: false,
        error: null,
        lastConnectedAt: new Date()
      }));
      
      console.log('Socket connected successfully');
    });

    newSocket.on('disconnect', (reason) => {
      setConnectionStats(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        disconnected: true,
        error: reason
      }));
      
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
      setConnectionStats(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        disconnected: true,
        error: error.message,
        reconnectAttempts: prev.reconnectAttempts + 1
      }));
      
      console.error('Socket connection error:', error);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      setConnectionStats(prev => ({
        ...prev,
        connecting: true,
        reconnectAttempts: attemptNumber
      }));
      
      console.log(`Socket reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setConnectionStats(prev => ({
        ...prev,
        connected: true,
        connecting: false,
        disconnected: false,
        error: null,
        reconnectAttempts: 0,
        lastConnectedAt: new Date()
      }));
      
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on('reconnect_failed', () => {
      setConnectionStats(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        disconnected: true,
        error: 'Reconnection failed after maximum attempts'
      }));
      
      console.error('Socket reconnection failed');
    });

    // Error handling
    newSocket.on('error', (error) => {
      const errorEvent: SocketEvent = {
        event: 'error',
        data: error,
        timestamp: new Date()
      };
      
      setEventHistory(prev => [...prev.slice(-99), errorEvent]);
      console.error('Socket error:', error);
    });

    // Store event history for debugging
    const originalEmit = newSocket.emit;
    newSocket.emit = (...args: any[]) => {
      const [event, data] = args;
      const socketEvent: SocketEvent = {
        event,
        data,
        timestamp: new Date()
      };
      
      setEventHistory(prev => [...prev.slice(-99), socketEvent]);
      return originalEmit.apply(newSocket, args as [string, ...any[]]);
    };

    setSocket(newSocket);
  }, [user, reconnection, reconnectionAttempts, reconnectionDelay, timeout]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [socket]);

  // Emit event to server
  const emit = useCallback((event: string, data?: any) => {
    if (!socket || !socket.connected) {
      console.warn('Cannot emit event: Socket not connected');
      return false;
    }

    socket.emit(event, data);
    return true;
  }, [socket]);

  // Listen for events
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!socket) return;

    socket.on(event, callback);
    
    // Track listeners for cleanup
    const listeners = eventListeners.current.get(event) || [];
    listeners.push(callback);
    eventListeners.current.set(event, listeners);
  }, [socket]);

  // Remove event listener
  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (!socket) return;

    if (callback) {
      socket.off(event, callback);
      
      // Remove from tracking
      const listeners = eventListeners.current.get(event) || [];
      const updatedListeners = listeners.filter(l => l !== callback);
      eventListeners.current.set(event, updatedListeners);
    } else {
      socket.off(event);
      eventListeners.current.delete(event);
    }
  }, [socket]);

  // Join room
  const joinRoom = useCallback((roomId: string) => {
    emit('join_room', { roomId });
  }, [emit]);

  // Leave room
  const leaveRoom = useCallback((roomId: string) => {
    emit('leave_room', { roomId });
  }, [emit]);

  // Send message
  const sendMessage = useCallback((roomId: string, message: string, messageType = 'text') => {
    emit('send_message', { roomId, message, messageType });
  }, [emit]);

  // Update user status
  const updateStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    emit('user_status_change', { status });
  }, [emit]);

  // Initialize connection
  useEffect(() => {
    const token = localStorage.getItem('sevadaan_token');
    if (autoConnect && token && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, user, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        // Remove all tracked listeners
        eventListeners.current.forEach((listeners, event) => {
          listeners.forEach(listener => {
            socket.off(event, listener);
          });
        });
        eventListeners.current.clear();
        
        socket.disconnect();
      }
    };
  }, [socket]);

  return {
    socket,
    connectionStats,
    eventHistory,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateStatus
  };
};
