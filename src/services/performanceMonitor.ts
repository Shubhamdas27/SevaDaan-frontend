// Performance Monitoring Service
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, any> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private isEnabled: boolean = true;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
    this.trackWebVitals();
  }

  // Initialize performance observers
  private initializeObservers(): void {
    if (!this.isEnabled || typeof PerformanceObserver === 'undefined') return;

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', {
          value: lastEntry.startTime,
          timestamp: Date.now(),
          url: window.location.href
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', {
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', {
          value: clsValue,
          timestamp: Date.now(),
          url: window.location.href
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // Long Tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('LongTask', {
            value: entry.duration,
            startTime: entry.startTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (error) {
      console.warn('Long Task observer not supported:', error);
    }

    // Navigation Timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('Navigation', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            domInteractive: entry.domInteractive - entry.fetchStart,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }

    // Resource Loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.initiatorType) {
            this.recordMetric('Resource', {
              name: entry.name,
              type: entry.initiatorType,
              duration: entry.duration,
              size: entry.transferSize || 0,
              timestamp: Date.now()
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }

  // Track Web Vitals
  private trackWebVitals(): void {
    // Time to First Byte (TTFB)
    window.addEventListener('load', () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.recordMetric('TTFB', {
          value: navigationEntry.responseStart - navigationEntry.requestStart,
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', {
            value: entry.startTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        }
      });
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', fcpObserver);
    } catch (error) {
      console.warn('FCP observer not supported:', error);
    }
  }

  // Record a metric
  private recordMetric(name: string, data: any): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metrics = this.metrics.get(name);
    metrics.push({
      ...data,
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: this.getConnectionInfo()
    });

    // Keep only last 100 entries per metric
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Send to analytics if available
    this.sendToAnalytics(name, data);
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('performanceSessionId');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('performanceSessionId', sessionId);
    }
    return sessionId;
  }

  // Get connection information
  private getConnectionInfo(): any {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Send metrics to analytics
  private sendToAnalytics(metricName: string, data: any): void {
    // Debounce analytics calls
    if (!this.shouldSendAnalytics(metricName)) return;

    try {
      // Send to your analytics service
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric: metricName,
          data,
          timestamp: Date.now(),
          page: window.location.pathname
        })
      }).catch(error => {
        console.warn('Failed to send performance analytics:', error);
      });
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  }

  // Throttle analytics sending
  private shouldSendAnalytics(metricName: string): boolean {
    const lastSent = sessionStorage.getItem(`lastAnalytics_${metricName}`);
    const now = Date.now();
    
    if (!lastSent || now - parseInt(lastSent) > 30000) { // 30 seconds throttle
      sessionStorage.setItem(`lastAnalytics_${metricName}`, now.toString());
      return true;
    }
    
    return false;
  }

  // Public API methods
  public trackUserAction(action: string, details?: any): void {
    this.recordMetric('UserAction', {
      action,
      details,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  public trackError(error: Error, context?: string): void {
    this.recordMetric('Error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  public trackCustomMetric(name: string, value: number, unit?: string): void {
    this.recordMetric('CustomMetric', {
      name,
      value,
      unit,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  public getMetrics(metricName?: string): any {
    if (metricName) {
      return this.metrics.get(metricName) || [];
    }
    
    const allMetrics: any = {};
    this.metrics.forEach((value, key) => {
      allMetrics[key] = value;
    });
    
    return allMetrics;
  }

  public getPerformanceSummary(): any {
    const summary: any = {
      pageLoadTime: 0,
      totalResources: 0,
      resourceSize: 0,
      webVitals: {},
      errors: 0,
      userActions: 0
    };

    // Calculate page load time
    const navigation = this.metrics.get('Navigation');
    if (navigation && navigation.length > 0) {
      const latest = navigation[navigation.length - 1];
      summary.pageLoadTime = latest.loadComplete;
    }

    // Calculate resource metrics
    const resources = this.metrics.get('Resource') || [];
    summary.totalResources = resources.length;
    summary.resourceSize = resources.reduce((total: number, resource: any) => total + (resource.size || 0), 0);

    // Web Vitals
    ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].forEach(metric => {
      const values = this.metrics.get(metric);
      if (values && values.length > 0) {
        const latest = values[values.length - 1];
        summary.webVitals[metric] = latest.value;
      }
    });

    // Error count
    const errors = this.metrics.get('Error') || [];
    summary.errors = errors.length;

    // User action count
    const userActions = this.metrics.get('UserAction') || [];
    summary.userActions = userActions.length;

    return summary;
  }

  public generateReport(): string {
    const summary = this.getPerformanceSummary();
    const allMetrics = this.getMetrics();
    
    return JSON.stringify({
      summary,
      details: allMetrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }, null, 2);
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  public reset(): void {
    this.metrics.clear();
  }

  // Performance budget checking
  public checkPerformanceBudget(): {
    passed: boolean;
    results: Array<{ metric: string; value: number; budget: number; passed: boolean }>;
  } {
    const budgets = {
      LCP: 2500, // 2.5 seconds
      FID: 100,  // 100ms
      CLS: 0.1,  // 0.1
      FCP: 1800, // 1.8 seconds
      TTFB: 600  // 600ms
    };

    const results: Array<{ metric: string; value: number; budget: number; passed: boolean }> = [];
    let allPassed = true;

    Object.entries(budgets).forEach(([metric, budget]) => {
      const values = this.metrics.get(metric);
      if (values && values.length > 0) {
        const latest = values[values.length - 1];
        const passed = latest.value <= budget;
        results.push({
          metric,
          value: latest.value,
          budget,
          passed
        });
        
        if (!passed) {
          allPassed = false;
        }
      }
    });

    return {
      passed: allPassed,
      results
    };
  }
}

// Create and export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
import { useEffect, useRef } from 'react';

export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    performanceMonitor.trackCustomMetric(`ComponentRender_${componentName}`, renderTime, 'ms');
  }, [componentName]);

  const trackUserAction = (action: string, details?: any) => {
    performanceMonitor.trackUserAction(`${componentName}_${action}`, details);
  };

  const trackError = (error: Error, context?: string) => {
    performanceMonitor.trackError(error, `${componentName}_${context}`);
  };

  return {
    trackUserAction,
    trackError,
    performanceMonitor
  };
};

// Initialize performance monitoring when module loads
if (typeof window !== 'undefined') {
  // Start monitoring
  performanceMonitor.enable();
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      performanceMonitor.trackUserAction('PageHidden');
    } else {
      performanceMonitor.trackUserAction('PageVisible');
    }
  });

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error, 'UnhandledError');
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), 'UnhandledPromiseRejection');
  });

  console.log('[Performance Monitor] Initialized successfully');
}
