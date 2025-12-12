import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  error: null
});

interface SocketProviderProps {
  children: ReactNode;
}

// Socket server URL - configure based on environment
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('No authentication token found');
      return;
    }

    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError(error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setError('Failed to reconnect to server');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update socket auth token when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('accessToken');
      if (newToken && socket && !socket.connected) {
        socket.auth = { token: newToken };
        socket.connect();
      } else if (!newToken && socket) {
        socket.disconnect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

// Additional hooks for specific socket events
export const useSocketEvent = (eventName: string, handler: (data: any) => void) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on(eventName, handler);
      
      return () => {
        socket.off(eventName, handler);
      };
    }
  }, [socket, eventName, handler]);
};

export const useSocketEmit = () => {
  const { socket } = useSocket();
  
  return (eventName: string, data?: any) => {
    if (socket && socket.connected) {
      socket.emit(eventName, data);
    } else {
      console.warn(`Cannot emit ${eventName}: socket not connected`);
    }
  };
};
