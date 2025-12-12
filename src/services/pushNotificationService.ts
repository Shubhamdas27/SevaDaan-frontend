// Push Notification Service
interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

interface PushSubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: Uint8Array;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  timestamp?: number;
  tag?: string;
  renotify?: boolean;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private vapidPublicKey: string = 'BMxJxKYLdTfVhpnvnHvfbS-i6CtqjdWFI0ZWYZfTqcJMrNvJxKrGkF7eNwCXDl9KhfSd9sAcVdInCwQsVg1J8AQ'; // Replace with your VAPID key
  private subscription: PushSubscription | null = null;
  private isSupported: boolean = false;
  private isEnabled: boolean = false;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  constructor() {
    this.checkSupport();
    this.initializeServiceWorker();
  }

  // Check if push notifications are supported
  private checkSupport(): void {
    this.isSupported = 'serviceWorker' in navigator && 
                     'PushManager' in window && 
                     'Notification' in window;
  }

  // Initialize service worker
  private async initializeServiceWorker(): Promise<void> {
    if (!this.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Push Service] Service Worker registered:', registration);
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('[Push Service] Service Worker ready');
    } catch (error) {
      console.error('[Push Service] Service Worker registration failed:', error);
    }
  }

  // Request notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    try {
      const permission = await Notification.requestPermission();
      
      const result: NotificationPermission = {
        granted: permission === 'granted',
        denied: permission === 'denied',
        prompt: permission === 'default'
      };

      if (result.granted) {
        this.isEnabled = true;
        await this.subscribeToPush();
      }

      return result;
    } catch (error) {
      console.error('[Push Service] Permission request failed:', error);
      throw error;
    }
  }

  // Subscribe to push notifications
  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.isEnabled) {
      throw new Error('Push notifications are not available');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      this.subscription = await registration.pushManager.getSubscription();
      
      if (!this.subscription) {
        // Create new subscription
        const options: PushSubscriptionOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
        };
        
        this.subscription = await registration.pushManager.subscribe(options);
        console.log('[Push Service] Subscribed to push notifications:', this.subscription);
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
      return this.subscription;
    } catch (error) {
      console.error('[Push Service] Subscription failed:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  public async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const success = await this.subscription.unsubscribe();
      
      if (success) {
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
        this.isEnabled = false;
      }
      
      return success;
    } catch (error) {
      console.error('[Push Service] Unsubscription failed:', error);
      throw error;
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('[Push Service] Subscription sent to server successfully');
    } catch (error) {
      console.error('[Push Service] Failed to send subscription to server:', error);
      // Don't throw here - subscription can still work locally
    }
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('[Push Service] Subscription removed from server successfully');
    } catch (error) {
      console.error('[Push Service] Failed to remove subscription from server:', error);
    }
  }

  // Show local notification
  public async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || Notification.permission !== 'granted') {
      throw new Error('Notifications are not permitted');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/icon-192x192.png',
        data: payload.data || {},
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        tag: payload.tag
      };

      await registration.showNotification(payload.title, options);
      console.log('[Push Service] Local notification shown:', payload.title);
    } catch (error) {
      console.error('[Push Service] Failed to show local notification:', error);
      throw error;
    }
  }

  // Send push notification via server
  public async sendPushNotification(
    payload: NotificationPayload, 
    recipients?: string[]
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payload,
          recipients,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('[Push Service] Push notification sent via server');
    } catch (error) {
      console.error('[Push Service] Failed to send push notification:', error);
      throw error;
    }
  }

  // Schedule local notification
  public scheduleNotification(
    payload: NotificationPayload, 
    delay: number
  ): number {
    const timeoutId = window.setTimeout(async () => {
      try {
        await this.showLocalNotification(payload);
      } catch (error) {
        console.error('[Push Service] Scheduled notification failed:', error);
      }
    }, delay);

    return timeoutId;
  }

  // Cancel scheduled notification
  public cancelScheduledNotification(timeoutId: number): void {
    window.clearTimeout(timeoutId);
  }

  // Get subscription status
  public async getSubscriptionStatus(): Promise<{
    supported: boolean;
    enabled: boolean;
    subscribed: boolean;
    subscription: PushSubscription | null;
  }> {
    let subscribed = false;
    let subscription: PushSubscription | null = null;

    if (this.isSupported) {
      try {
        const registration = await navigator.serviceWorker.ready;
        subscription = await registration.pushManager.getSubscription();
        subscribed = !!subscription;
        this.subscription = subscription;
      } catch (error) {
        console.error('[Push Service] Failed to get subscription status:', error);
      }
    }

    return {
      supported: this.isSupported,
      enabled: this.isEnabled,
      subscribed,
      subscription
    };
  }

  // Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Predefined notification templates
  public static readonly Templates = {
    DONATION_RECEIVED: (amount: number, donor: string): NotificationPayload => ({
      title: 'New Donation Received!',
      body: `₹${amount.toLocaleString()} donated by ${donor}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: { type: 'donation', amount, donor },
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'thank', title: 'Send Thanks' }
      ]
    }),

    VOLUNTEER_SIGNUP: (programName: string, volunteer: string): NotificationPayload => ({
      title: 'New Volunteer Signup',
      body: `${volunteer} signed up for ${programName}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: { type: 'volunteer', programName, volunteer },
      actions: [
        { action: 'view', title: 'View Profile' },
        { action: 'approve', title: 'Approve' }
      ]
    }),

    GRANT_APPROVED: (grantName: string, amount: number): NotificationPayload => ({
      title: 'Grant Approved!',
      body: `Your grant application for ${grantName} has been approved for ₹${amount.toLocaleString()}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: { type: 'grant', grantName, amount },
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'download', title: 'Download Letter' }
      ]
    }),

    PROGRAM_REMINDER: (programName: string, date: string): NotificationPayload => ({
      title: 'Program Reminder',
      body: `${programName} is scheduled for ${date}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: { type: 'reminder', programName, date },
      actions: [
        { action: 'view', title: 'View Program' },
        { action: 'reschedule', title: 'Reschedule' }
      ]
    }),

    PERFORMANCE_ALERT: (metric: string, value: string): NotificationPayload => ({
      title: 'Performance Alert',
      body: `${metric}: ${value} - requires attention`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [300, 100, 300],
      data: { type: 'performance', metric, value },
      actions: [
        { action: 'view', title: 'View Dashboard' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  };

  // Public getters
  public get isNotificationSupported(): boolean {
    return this.isSupported;
  }

  public get isNotificationEnabled(): boolean {
    return this.isEnabled;
  }

  public get currentSubscription(): PushSubscription | null {
    return this.subscription;
  }
}

// Create and export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();

// React hook for push notifications
import { useState, useEffect } from 'react';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await pushNotificationService.getSubscriptionStatus();
      setIsSupported(status.supported);
      setIsEnabled(status.enabled);
      setIsSubscribed(status.subscribed);
      setSubscription(status.subscription);
    } catch (error) {
      console.error('Failed to check notification status:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      if (permission.granted) {
        await checkStatus();
      }
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      throw error;
    }
  };

  const subscribe = async () => {
    try {
      const sub = await pushNotificationService.subscribeToPush();
      await checkStatus();
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        await checkStatus();
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      throw error;
    }
  };

  const showNotification = async (payload: NotificationPayload) => {
    try {
      await pushNotificationService.showLocalNotification(payload);
    } catch (error) {
      console.error('Failed to show notification:', error);
      throw error;
    }
  };

  return {
    isSupported,
    isEnabled,
    isSubscribed,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    checkStatus
  };
};

console.log('[Push Notification Service] Initialized successfully');
