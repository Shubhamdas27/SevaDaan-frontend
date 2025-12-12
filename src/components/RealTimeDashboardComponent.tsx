import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number) => string;
}

interface RealTimeActivity {
  id: string;
  type: 'user_joined' | 'donation_received' | 'program_created' | 'volunteer_applied' | 'emergency_alert';
  message: string;
  timestamp: Date;
  user?: string;
  data?: any;
}

const MetricCard: React.FC<{
  metric: DashboardMetric;
  isLive: boolean;
}> = ({ metric, isLive }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(metric.value);

  useEffect(() => {
    if (displayValue !== metric.value) {
      setIsAnimating(true);
      
      // Animate value change
      const startValue = displayValue;
      const endValue = metric.value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const currentValue = Math.round(startValue + (endValue - startValue) * eased);
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [metric.value, displayValue]);

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 rotate-180" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getChangePercent = () => {
    if (!metric.previousValue || metric.previousValue === 0) return 0;
    return ((metric.value - metric.previousValue) / metric.previousValue) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-xl shadow-lg p-6 relative overflow-hidden
        ${isAnimating ? 'ring-2 ring-blue-400' : ''}
        ${isLive ? 'border-l-4 border-green-500' : ''}
      `}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${metric.color}`}>
          {metric.icon}
        </div>
        
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {getChangePercent().toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-gray-600 text-sm font-medium">
          {metric.label}
        </h3>
        <div className="text-2xl font-bold text-gray-900">
          {metric.formatter ? metric.formatter(displayValue) : displayValue.toLocaleString()}
        </div>
        {metric.previousValue && (
          <p className="text-xs text-gray-500">
            Previous: {metric.formatter ? metric.formatter(metric.previousValue) : metric.previousValue.toLocaleString()}
          </p>
        )}
      </div>

      {/* Animation overlay */}
      {isAnimating && (
        <div className="absolute inset-0 bg-blue-50 opacity-20 pointer-events-none" />
      )}
    </motion.div>
  );
};

const ActivityFeed: React.FC<{
  activities: RealTimeActivity[];
  isLive: boolean;
}> = ({ activities, isLive }) => {
  const getActivityIcon = (type: RealTimeActivity['type']) => {
    switch (type) {
      case 'user_joined':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'donation_received':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'program_created':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'volunteer_applied':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'emergency_alert':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-lg p-6
      ${isLive ? 'border-l-4 border-green-500' : ''}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Real-Time Activity
        </h3>
        {isLive && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                  {activity.user && (
                    <span className="text-xs text-gray-500">
                      by {activity.user}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export const RealTimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      id: 'total_users',
      label: 'Total Users',
      value: 1250,
      previousValue: 1200,
      trend: 'up',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      id: 'active_programs',
      label: 'Active Programs',
      value: 45,
      previousValue: 42,
      trend: 'up',
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      id: 'total_donations',
      label: 'Total Donations',
      value: 125000,
      previousValue: 118000,
      trend: 'up',
      icon: <Heart className="w-6 h-6 text-white" />,
      color: 'bg-red-500',
      formatter: (value) => `₹${value.toLocaleString()}`
    },
    {
      id: 'active_volunteers',
      label: 'Active Volunteers',
      value: 320,
      previousValue: 315,
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    }
  ]);

  const [activities, setActivities] = useState<RealTimeActivity[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { socket, connectionStats, on, off, emit } = useSocket();

  useEffect(() => {
    setIsLive(connectionStats.connected);
  }, [connectionStats.connected]);

  const handleMetricsUpdate = useCallback((data: any) => {
    setMetrics(prev => 
      prev.map(metric => {
        if (data.metrics && data.metrics[metric.id] !== undefined) {
          return {
            ...metric,
            previousValue: metric.value,
            value: data.metrics[metric.id],
            trend: data.metrics[metric.id] > metric.value ? 'up' : 
                   data.metrics[metric.id] < metric.value ? 'down' : 'stable'
          };
        }
        return metric;
      })
    );
    setLastUpdate(new Date());
  }, []);

  const handleActivityUpdate = useCallback((data: any) => {
    const activity: RealTimeActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type || 'user_joined',
      message: data.message || 'New activity',
      timestamp: new Date(data.timestamp || Date.now()),
      user: data.user,
      data: data.data
    };

    setActivities(prev => [activity, ...prev.slice(0, 19)]); // Keep only 20 activities
  }, []);

  useEffect(() => {
    if (!socket) return;

    const eventHandlers = {
      'dashboard_metrics_response': handleMetricsUpdate,
      'user_status_change': (data: any) => handleActivityUpdate({
        type: 'user_joined',
        message: `User ${data.userId} status changed to ${data.status}`,
        timestamp: data.timestamp,
        user: data.userId
      }),
      'donation_status_changed': (data: any) => handleActivityUpdate({
        type: 'donation_received',
        message: `Donation of ${data.amount ? `₹${data.amount}` : 'amount'} received`,
        timestamp: data.timestamp,
        user: data.donorId
      }),
      'program_updated': (data: any) => handleActivityUpdate({
        type: 'program_created',
        message: `Program ${data.programId} was updated`,
        timestamp: data.timestamp,
        user: data.updatedBy
      }),
      'volunteer_application_updated': (data: any) => handleActivityUpdate({
        type: 'volunteer_applied',
        message: `Volunteer application status updated`,
        timestamp: data.timestamp,
        user: data.volunteerId
      }),
      'emergency_alert': (data: any) => handleActivityUpdate({
        type: 'emergency_alert',
        message: data.message,
        timestamp: data.timestamp,
        user: data.reportedBy
      })
    };

    // Register event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      on(event, handler);
    });

    return () => {
      Object.keys(eventHandlers).forEach(event => {
        off(event);
      });
    };
  }, [socket, on, off, handleMetricsUpdate, handleActivityUpdate]);

  const requestMetricsUpdate = () => {
    emit('dashboard_metrics_request', {
      metricsType: 'overview',
      filters: {}
    });
  };

  useEffect(() => {
    // Request initial metrics
    if (socket && connectionStats.connected) {
      requestMetricsUpdate();
    }
  }, [socket, connectionStats.connected]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Real-Time Dashboard
          </h1>
          <p className="text-gray-600">
            Live updates from your NGO platform
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>
          
          <button
            onClick={requestMetricsUpdate}
            disabled={!connectionStats.connected}
            className="
              flex items-center gap-2 px-4 py-2 
              bg-blue-600 hover:bg-blue-700 
              disabled:bg-gray-400 disabled:cursor-not-allowed
              text-white rounded-lg font-medium transition-colors
            "
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            isLive={isLive}
          />
        ))}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed
          activities={activities}
          isLive={isLive}
        />
        
        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Connection Status
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${
                connectionStats.connected ? 'text-green-600' : 'text-red-600'
              }`}>
                {connectionStats.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="text-sm text-gray-900">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            
            {connectionStats.lastConnectedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connected At</span>
                <span className="text-sm text-gray-900">
                  {connectionStats.lastConnectedAt.toLocaleTimeString()}
                </span>
              </div>
            )}
            
            {connectionStats.reconnectAttempts > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reconnect Attempts</span>
                <span className="text-sm text-gray-900">
                  {connectionStats.reconnectAttempts}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
