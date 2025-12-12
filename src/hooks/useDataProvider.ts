import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { DataProvider, DashboardData, FilterOptions } from '../types/dashboard';

interface UseDataProviderProps {
  providerId: string;
  config: Record<string, any>;
  filters?: FilterOptions;
  userId?: string;
  role?: string;
}

export const useDataProvider = ({ 
  providerId, 
  config, 
  filters = {}, 
  userId, 
  role 
}: UseDataProviderProps) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [provider, setProvider] = useState<DataProvider | null>(null);
  
  const socket = useSocket();

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dashboard/data/${providerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          filters,
          userId,
          role
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result.data);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [providerId, config, filters, userId, role]);

  // Load provider configuration
  const loadProvider = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/providers/${providerId}`);
      if (response.ok) {
        const providerData = await response.json();
        setProvider(providerData);
      }
    } catch (err) {
      console.error('Failed to load provider:', err);
    }
  }, [providerId]);

  // Subscribe to real-time updates
  const subscribeToUpdates = useCallback(() => {
    if (!socket || !provider?.isRealtime) return;

    const eventName = `dashboard-data-${providerId}`;
    
    const handleUpdate = (updatedData: DashboardData) => {
      setData(updatedData);
      setLastFetched(new Date());
    };

    socket.on(eventName, handleUpdate);

    // Join room for this data provider
    socket.emit('join-dashboard-room', {
      providerId,
      userId,
      role,
      filters
    });

    return () => {
      socket.off(eventName, handleUpdate);
      socket.emit('leave-dashboard-room', { providerId, userId });
    };
  }, [socket, provider, providerId, userId, role, filters]);

  // Set up automatic refresh
  const setupAutoRefresh = useCallback(() => {
    if (!provider?.refreshInterval) return;

    const interval = setInterval(fetchData, provider.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [provider, fetchData]);

  // Initialize provider
  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  // Fetch initial data
  useEffect(() => {
    if (provider) {
      fetchData();
    }
  }, [provider, fetchData]);

  // Set up real-time updates
  useEffect(() => {
    if (provider?.isRealtime) {
      return subscribeToUpdates();
    }
  }, [provider, subscribeToUpdates]);

  // Set up auto refresh
  useEffect(() => {
    if (provider && !provider.isRealtime && provider.refreshInterval) {
      return setupAutoRefresh();
    }
  }, [provider, setupAutoRefresh]);

  return {
    data,
    isLoading,
    error,
    lastFetched,
    provider,
    refetch: fetchData
  };
};

// Hook for managing multiple data providers
export const useDataProviders = (providers: Array<{
  id: string;
  config: Record<string, any>;
  filters?: FilterOptions;
}>, userId?: string, role?: string) => {
  const [providersData, setProvidersData] = useState<Record<string, DashboardData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create individual provider hooks
  const providerHooks = providers.map(provider => 
    useDataProvider({
      providerId: provider.id,
      config: provider.config,
      filters: provider.filters,
      userId,
      role
    })
  );

  // Update combined state when individual providers change
  useEffect(() => {
    const newData: Record<string, DashboardData> = {};
    const newErrors: Record<string, string> = {};
    let hasLoading = false;

    providerHooks.forEach((hook, index) => {
      const providerId = providers[index].id;
      
      if (hook.data) {
        newData[providerId] = hook.data;
      }
      
      if (hook.error) {
        newErrors[providerId] = hook.error;
      }
      
      if (hook.isLoading) {
        hasLoading = true;
      }
    });

    setProvidersData(newData);
    setErrors(newErrors);
    setIsLoading(hasLoading);
  }, [providerHooks, providers]);

  const refetchAll = useCallback(async () => {
    await Promise.all(providerHooks.map(hook => hook.refetch()));
  }, [providerHooks]);

  return {
    data: providersData,
    isLoading,
    errors,
    refetchAll
  };
};
