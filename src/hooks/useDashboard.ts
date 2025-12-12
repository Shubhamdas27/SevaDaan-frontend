import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout, DashboardWidget, DataProvider, FilterOptions } from '../types/dashboard';

interface UseDashboardProps {
  userId: string;
  role: string;
  layoutId?: string;
}

export const useDashboard = ({ userId, role, layoutId }: UseDashboardProps) => {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [availableLayouts, setAvailableLayouts] = useState<DashboardLayout[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [dataProviders, setDataProviders] = useState<DataProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Load dashboard layout
  const loadLayout = useCallback(async (id?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dashboard/layouts/${id || 'default'}?userId=${userId}&role=${role}`);
      if (!response.ok) {
        throw new Error('Failed to load dashboard layout');
      }
      
      const layout = await response.json();
      setCurrentLayout(layout);
      setWidgets(layout.widgets || []);
      
      // Load data for each widget
      await loadWidgetData(layout.widgets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId, role]);

  // Load available layouts
  const loadAvailableLayouts = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/layouts?userId=${userId}&role=${role}`);
      if (!response.ok) {
        throw new Error('Failed to load available layouts');
      }
      
      const layouts = await response.json();
      setAvailableLayouts(layouts);
    } catch (err) {
      console.error('Failed to load available layouts:', err);
    }
  }, [userId, role]);

  // Load widget data
  const loadWidgetData = useCallback(async (widgetList: DashboardWidget[]) => {
    const updatedWidgets = [...widgetList];
    
    for (const widget of updatedWidgets) {
      try {
        const response = await fetch(`/api/dashboard/widgets/${widget.id}/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            config: widget.config,
            filters,
            userId,
            role 
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          widget.data = data;
          widget.lastUpdated = new Date();
          widget.isLoading = false;
          widget.error = undefined;
        } else {
          widget.error = 'Failed to load widget data';
          widget.isLoading = false;
        }
      } catch (err) {
        widget.error = err instanceof Error ? err.message : 'An error occurred';
        widget.isLoading = false;
      }
    }
    
    setWidgets(updatedWidgets);
  }, [filters, userId, role]);

  // Save layout
  const saveLayout = useCallback(async (layout: DashboardLayout) => {
    try {
      const response = await fetch(`/api/dashboard/layouts/${layout.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layout)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save layout');
      }
      
      setCurrentLayout(layout);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save layout');
      return false;
    }
  }, []);

  // Add widget
  const addWidget = useCallback(async (widgetType: string, config: any) => {
    if (!currentLayout) return;

    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: config.title || 'New Widget',
      position: { x: 0, y: 0 },
      size: { width: 4, height: 3 },
      config,
      isLoading: true
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    };

    setCurrentLayout(updatedLayout);
    setWidgets(updatedLayout.widgets);
    
    // Load data for the new widget
    await loadWidgetData([newWidget]);
    
    // Save the layout
    await saveLayout(updatedLayout);
  }, [currentLayout, loadWidgetData, saveLayout]);

  // Remove widget
  const removeWidget = useCallback(async (widgetId: string) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
    };

    setCurrentLayout(updatedLayout);
    setWidgets(updatedLayout.widgets);
    
    // Save the layout
    await saveLayout(updatedLayout);
  }, [currentLayout, saveLayout]);

  // Update widget
  const updateWidget = useCallback(async (widgetId: string, updates: Partial<DashboardWidget>) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    };

    setCurrentLayout(updatedLayout);
    setWidgets(updatedLayout.widgets);
    
    // If config changed, reload data
    if (updates.config) {
      const updatedWidget = updatedLayout.widgets.find(w => w.id === widgetId);
      if (updatedWidget) {
        await loadWidgetData([updatedWidget]);
      }
    }
    
    // Save the layout
    await saveLayout(updatedLayout);
  }, [currentLayout, loadWidgetData, saveLayout]);

  // Refresh widget data
  const refreshWidget = useCallback(async (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.isLoading = true;
      setWidgets([...widgets]);
      await loadWidgetData([widget]);
    }
  }, [widgets, loadWidgetData]);

  // Refresh all widgets
  const refreshAllWidgets = useCallback(async () => {
    if (widgets.length > 0) {
      widgets.forEach(widget => {
        widget.isLoading = true;
      });
      setWidgets([...widgets]);
      await loadWidgetData(widgets);
    }
  }, [widgets, loadWidgetData]);

  // Update filters
  const updateFilters = useCallback(async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (widgets.length > 0) {
      await loadWidgetData(widgets);
    }
  }, [widgets, loadWidgetData]);

  // Export dashboard
  const exportDashboard = useCallback(async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    if (!currentLayout) return;

    try {
      const response = await fetch('/api/dashboard/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layoutId: currentLayout.id,
          format,
          filters,
          userId,
          role
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export dashboard');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${currentLayout.name}-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export dashboard');
    }
  }, [currentLayout, filters, userId, role]);

  // Initialize dashboard
  useEffect(() => {
    loadLayout(layoutId);
    loadAvailableLayouts();
  }, [loadLayout, loadAvailableLayouts, layoutId]);

  return {
    currentLayout,
    availableLayouts,
    widgets,
    dataProviders,
    isLoading,
    error,
    filters,
    actions: {
      loadLayout,
      saveLayout,
      addWidget,
      removeWidget,
      updateWidget,
      refreshWidget,
      refreshAllWidgets,
      updateFilters,
      exportDashboard
    }
  };
};
