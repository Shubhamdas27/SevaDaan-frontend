import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Heart, 
  Clock,
  DollarSign,
  Bell,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealTimeMetrics {
  activeUsers: number;
  ongoingEvents: number;
  pendingApplications: number;
  todaysDonations: number;
  volunteerHours: number;
  systemHealth: string;
  lastUpdated: string;
}

interface LiveUpdate {
  type: string;
  data: any;
  timestamp: string;
}

const RealTimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/dashboard`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('Real-time dashboard connection established');
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        handleRealTimeUpdate(update);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('Real-time dashboard connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Auto-refresh metrics
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Initial metrics fetch
  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/real-time', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setMetrics(result.data);
        updateChartData(result.data);
      }
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    }
  };

  const handleRealTimeUpdate = useCallback((update: LiveUpdate) => {
    setLiveUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
    
    // Update metrics based on update type
    if (update.type === 'metrics_update' && metrics) {
      setMetrics(prev => ({ ...prev, ...update.data }));
      updateChartData({ ...metrics, ...update.data });
    }
  }, [metrics]);

  const updateChartData = (newMetrics: RealTimeMetrics) => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    setChartData(prev => {
      const newData = [
        ...prev.slice(-23), // Keep last 24 data points
        {
          time: timeLabel,
          activeUsers: newMetrics.activeUsers,
          donations: newMetrics.todaysDonations,
          applications: newMetrics.pendingApplications
        }
      ];
      return newData;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Dashboard</h2>
          <div className="flex items-center space-x-2">
            {getConnectionStatusIcon()}
            <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {metrics.systemHealth !== 'Good' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <div>
            System health status: {metrics.systemHealth}. Some features may be affected.
          </div>
        </Alert>
      )}

      {/* Real-Time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ongoing Events</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.ongoingEvents}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pending Apps</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.pendingApplications}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Today's Donations</p>
                <p className="text-2xl font-bold text-gray-900">${metrics.todaysDonations.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Volunteer Hours</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.volunteerHours}</p>
                <Badge className={`mt-1 ${getStatusColor(metrics.systemHealth)}`}>
                  {metrics.systemHealth}
                </Badge>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Live Activity Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activeUsers" stroke="#2563eb" strokeWidth={2} name="Active Users" />
                <Line type="monotone" dataKey="applications" stroke="#dc2626" strokeWidth={2} name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Updates Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Live Updates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {liveUpdates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent updates</p>
              ) : (
                liveUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <Activity className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {update.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="primary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated Info */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default RealTimeDashboard;
