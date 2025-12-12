import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  MessageCircle, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Trash2,
  ArrowRight
} from 'lucide-react';
import apiService from '../../../lib/apiService';
import { CitizenNotification } from '../../../types';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    pushNotifications: true,
    applicationUpdates: true,
    serviceAnnouncements: true,
    deadlineReminders: true,
    supportMessages: true
  });
  
  // Load notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiService.getCitizenNotifications({
          filter
        });
        setNotifications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again.');
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [filter]);
  
  const toggleExpandNotification = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  
  const filteredNotifications = notifications;
  
  const getTypeIcon = (type: CitizenNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-accent-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };
  
  const getBackgroundColor = (type: CitizenNotification['type'], isRead: boolean) => {
    if (isRead) return 'bg-white';
    
    switch (type) {
      case 'success':
        return 'bg-success-50';
      case 'warning':
        return 'bg-warning-50';
      case 'error':
        return 'bg-error-50';
      case 'message':
        return 'bg-accent-50';
      default:
        return 'bg-primary-50';
    }
  };
  
  const getDateString = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  const saveNotificationSettings = async () => {
    try {
      await apiService.updateNotificationSettings(notificationSettings);
      setShowSettings(false);
    } catch (err) {
      console.error('Error updating notification settings:', err);
    }
  };
  
  const renderSettings = () => {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Notification Settings</h3>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-800">Email Notifications</h4>
                <p className="text-sm text-slate-500">Receive notifications via email</p>
              </div>              <label className="relative inline-flex items-center cursor-pointer" htmlFor="email-toggle">                <input 
                  id="email-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    email: e.target.checked
                  }))}
                  aria-label="Toggle email notifications"
                  title="Toggle email notifications"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-800">Push Notifications</h4>
                <p className="text-sm text-slate-500">Receive push notifications on your device</p>
              </div>              <label className="relative inline-flex items-center cursor-pointer" htmlFor="push-toggle">                <input 
                  id="push-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    pushNotifications: e.target.checked
                  }))}
                  aria-label="Toggle push notifications"
                  title="Toggle push notifications"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <hr className="my-4" />
            <h4 className="font-medium text-slate-800 mb-2">Notification Types</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-700">Application Updates</h4>
                <p className="text-sm text-slate-500">Status changes, approvals, rejections</p>
              </div>              <label className="relative inline-flex items-center cursor-pointer" htmlFor="app-updates-toggle">                <input 
                  id="app-updates-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.applicationUpdates}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    applicationUpdates: e.target.checked
                  }))}
                  aria-label="Toggle application updates notifications"
                  title="Toggle application updates notifications"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-700">Service Announcements</h4>
                <p className="text-sm text-slate-500">New services, changes to existing services</p>
              </div>              <label className="relative inline-flex items-center cursor-pointer" htmlFor="service-toggle">                <input 
                  id="service-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.serviceAnnouncements}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    serviceAnnouncements: e.target.checked
                  }))}
                  aria-label="Toggle service announcements"
                  title="Toggle service announcements"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-700">Deadline Reminders</h4>
                <p className="text-sm text-slate-500">Reminders about upcoming deadlines</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" htmlFor="deadline-toggle">
                <input 
                  id="deadline-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.deadlineReminders}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    deadlineReminders: e.target.checked
                  }))}
                  aria-label="Toggle deadline reminders"
                  title="Toggle deadline reminders"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-700">Support Messages</h4>
                <p className="text-sm text-slate-500">Messages from support team</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" htmlFor="support-toggle">
                <input 
                  id="support-toggle"
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationSettings.supportMessages}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    supportMessages: e.target.checked
                  }))}
                  aria-label="Toggle support message notifications"
                  title="Toggle support message notifications"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-500"></div>
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button variant="primary" onClick={saveNotificationSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-error-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-800">Error loading notifications</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }
    return (
    <div className="space-y-6">
      {showSettings ? (
        renderSettings()
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button
                variant={filter === 'read' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(true)}
                aria-label="Open notification settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-800">No notifications</h3>
              <p className="text-slate-600 mb-4">
                {filter === 'all' 
                  ? "You don't have any notifications yet" 
                  : filter === 'unread' 
                    ? "You don't have any unread notifications" 
                    : "You don't have any read notifications"}
              </p>
              {filter !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Show All Notifications
                </Button>
              )}
            </div>
          ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notification => {
            const isExpandedItem = expanded.includes(notification.id);
            const bgColorClass = getBackgroundColor(notification.type, notification.isRead);
            
            return (
              <div 
                key={notification.id} 
                className={`border border-slate-200 rounded-lg overflow-hidden ${bgColorClass}`}
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                  onClick={() => toggleExpandNotification(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-slate-800">{notification.title}</h3>
                        <span className="text-xs text-slate-500">{getDateString(notification.date)}</span>
                      </div>
                      
                      {notification.serviceName && (
                        <p className="text-sm text-slate-600 mt-1">{notification.serviceName}</p>
                      )}
                      
                      <p className={`text-sm mt-1 ${isExpandedItem ? '' : 'line-clamp-2'} text-slate-700`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex text-xs text-slate-500 items-center">
                          <span>
                            {isExpandedItem ? 'Click to collapse' : 'Click to expand'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs flex items-center gap-1 text-primary-600 hover:bg-primary-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Eye className="w-3 h-3" /> Mark read
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs flex items-center gap-1 text-slate-500 hover:text-error-600 hover:bg-error-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                          
                          {notification.actionUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs flex items-center gap-1 text-primary-600 hover:bg-primary-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.actionUrl!;
                              }}
                            >
                              {notification.actionText || 'View'} <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                      <div className="flex-shrink-0">
                      <button 
                        className="text-slate-400" 
                        aria-label={isExpandedItem ? "Collapse notification" : "Expand notification"}
                        title={isExpandedItem ? "Collapse notification" : "Expand notification"}
                      >
                        {isExpandedItem ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}        </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
