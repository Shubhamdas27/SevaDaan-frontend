import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { X, Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  data?: any;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-red-500`} />;
    default:
      return <Info className={`${iconClass} text-blue-500`} />;
  }
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: (id: string) => void;
  onRead: (id: string) => void;
}> = ({ notification, onClose, onRead }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!notification.read) {
      const timer = setTimeout(() => {
        onRead(notification.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.read, onRead]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`
            relative p-4 rounded-lg border shadow-lg max-w-sm w-full
            ${getBgColor()}
            ${!notification.read ? 'ring-2 ring-blue-400' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <NotificationIcon type={notification.type} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 text-sm">
                  {notification.title}
                </h4>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close notification"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
                
                {notification.actionUrl && notification.actionText && (
                  <button
                    onClick={() => window.open(notification.actionUrl, '_blank')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {notification.actionText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { socket, connectionStats, on, off, emit } = useSocket();

  useEffect(() => {
    setIsConnected(connectionStats.connected);
  }, [connectionStats.connected]);

  useEffect(() => {
    if (!socket) return;

    // Listen for various notification events
    const handleNotification = (data: any) => {
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: data.type || 'info',
        title: data.title || 'New Notification',
        message: data.message || '',
        timestamp: new Date(data.timestamp || Date.now()),
        read: false,
        actionUrl: data.actionUrl,
        actionText: data.actionText,
        data: data.data
      };

      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 notifications
      
      // Play notification sound if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    };

    // Listen for different types of notifications
    const eventHandlers = {
      'notification': handleNotification,
      'program_updated': (data: any) => handleNotification({
        type: 'info',
        title: 'Program Updated',
        message: `A program has been updated`,
        data
      }),
      'donation_status_changed': (data: any) => handleNotification({
        type: 'success',
        title: 'Donation Status Changed',
        message: `Donation status updated to ${data.status}`,
        data
      }),
      'volunteer_application_updated': (data: any) => handleNotification({
        type: 'info',
        title: 'Volunteer Application Updated',
        message: `Your volunteer application status has been updated`,
        data
      }),
      'emergency_alert': (data: any) => handleNotification({
        type: 'error',
        title: 'Emergency Alert',
        message: data.message,
        data
      }),
      'user_status_changed': (data: any) => handleNotification({
        type: 'info',
        title: 'User Status Changed',
        message: `User status updated to ${data.status}`,
        data
      }),
      'dashboard_metrics_response': (data: any) => handleNotification({
        type: 'success',
        title: 'Dashboard Updated',
        message: 'Dashboard metrics have been refreshed',
        data
      }),
      'room_joined': (data: any) => handleNotification({
        type: 'success',
        title: 'Room Joined',
        message: `Successfully joined room`,
        data
      }),
      'new_message': (data: any) => handleNotification({
        type: 'info',
        title: 'New Message',
        message: `New message from ${data.userEmail}`,
        data
      })
    };

    // Register all event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      on(event, handler);
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      // Clean up event listeners
      Object.keys(eventHandlers).forEach(event => {
        off(event);
      });
    };
  }, [socket, on, off]);

  const handleCloseNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    // Emit to server
    emit('mark_notification_read', { notificationId: id });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">
              Real-time connection lost. Trying to reconnect...
            </span>
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={handleCloseNotification}
            onRead={handleMarkAsRead}
          />
        ))}
      </AnimatePresence>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={clearAllNotifications}
          className="
            bg-gray-100 hover:bg-gray-200 text-gray-700 
            px-3 py-2 rounded-lg text-sm font-medium
            transition-colors shadow-sm border border-gray-200
            flex items-center gap-2 w-full justify-center
          "
        >
          <X className="w-4 h-4" />
          Clear All
        </motion.button>
      )}

      {/* Notification Bell Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          bg-white border border-gray-200 rounded-full p-2 shadow-lg
          flex items-center justify-center relative
        "
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="
            absolute -top-1 -right-1 
            bg-red-500 text-white text-xs
            rounded-full w-5 h-5 flex items-center justify-center
            animate-pulse
          ">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
        
        {/* Connection indicator */}
        <div className={`
          absolute -bottom-1 -right-1 w-3 h-3 rounded-full
          ${isConnected ? 'bg-green-500' : 'bg-red-500'}
        `} />
      </motion.div>
    </div>
  );
};
