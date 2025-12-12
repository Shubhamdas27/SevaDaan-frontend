import React, { useState } from 'react';
import { Plus, Layout, Download, Settings, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../context/AuthContext';
import { ChartWidget } from './ChartWidget';
import { KPIWidget } from './KPIWidget';
import { TableWidget } from './TableWidget';
import { ActivityWidget } from './ActivityWidget';
import { DashboardWidget } from '../../types/dashboard';
import './Dashboard.css';

interface DashboardContainerProps {
  layoutId?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ layoutId }) => {
  const { user } = useAuth();
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    currentLayout,
    widgets,
    isLoading,
    error,
    actions
  } = useDashboard({
    userId: user?.id || '',
    role: user?.role || 'citizen',
    layoutId
  });

  const renderWidget = (widget: DashboardWidget) => {
    const commonProps = {
      widget,
      onUpdate: actions.updateWidget,
      onRemove: actions.removeWidget,
      onRefresh: actions.refreshWidget
    };

    switch (widget.type) {
      case 'chart':
        return <ChartWidget key={widget.id} {...commonProps} />;
      case 'kpi':
        return <KPIWidget key={widget.id} {...commonProps} />;
      case 'table':
        return <TableWidget key={widget.id} {...commonProps} />;
      case 'activity':
        return <ActivityWidget key={widget.id} {...commonProps} />;
      default:
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-gray-500 text-center">
              Unknown widget type: {widget.type}
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div>
          <RefreshCw className="dashboard-loading-spinner" />
          <p className="dashboard-loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-content">
          <div className="dashboard-error-icon">⚠️</div>
          <p className="dashboard-error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="dashboard-error-retry"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {currentLayout?.name || 'Dashboard'}
          </h1>
          <p className="dashboard-subtitle">
            {currentLayout?.widgets.length || 0} widgets • Last updated{' '}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        <div className="dashboard-actions">
          <button
            onClick={() => actions.refreshAllWidgets()}
            className="dashboard-action-btn"
            title="Refresh all widgets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowWidgetSelector(true)}
            className="dashboard-action-btn"
            title="Add widget"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`dashboard-action-btn ${isEditing ? 'active' : ''}`}
            title="Toggle edit mode"
          >
            <Layout className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => actions.exportDashboard('pdf')}
            className="dashboard-action-btn"
            title="Export dashboard"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            className="dashboard-action-btn"
            title="Dashboard settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {widgets.map(renderWidget)}
        
        {/* Add Widget Button (in edit mode) */}
        {isEditing && (
          <button
            onClick={() => setShowWidgetSelector(true)}
            className="add-widget-placeholder"
          >
            <div className="add-widget-content">
              <Plus className="add-widget-icon" />
              <p className="add-widget-text">Add Widget</p>
            </div>
          </button>
        )}
      </div>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
        <WidgetSelectorModal
          onClose={() => setShowWidgetSelector(false)}
          onAddWidget={actions.addWidget}
        />
      )}
    </div>
  );
};

// Widget Selector Modal Component
interface WidgetSelectorModalProps {
  onClose: () => void;
  onAddWidget: (type: string, config: any) => void;
}

const WidgetSelectorModal: React.FC<WidgetSelectorModalProps> = ({
  onClose,
  onAddWidget
}) => {
  const widgetTypes = [
    {
      type: 'kpi',
      name: 'KPI Metric',
      description: 'Display key performance indicators with trends',
      icon: '📊',
      config: {
        title: 'New KPI',
        dataSource: 'kpi-data',
        format: 'number'
      }
    },
    {
      type: 'chart',
      name: 'Chart',
      description: 'Various chart types for data visualization',
      icon: '📈',
      config: {
        title: 'New Chart',
        chartType: 'line',
        dataSource: 'chart-data',
        showLegend: true
      }
    },
    {
      type: 'table',
      name: 'Data Table',
      description: 'Tabular data with sorting and filtering',
      icon: '📋',
      config: {
        title: 'New Table',
        dataSource: 'table-data',
        pageSize: 10
      }
    },
    {
      type: 'activity',
      name: 'Activity Feed',
      description: 'Recent activities and events',
      icon: '🔔',
      config: {
        title: 'Activity Feed',
        dataSource: 'activity-data',
        maxItems: 20
      }
    }
  ];

  const handleAddWidget = (widgetType: any) => {
    onAddWidget(widgetType.type, widgetType.config);
    onClose();
  };

  return (
    <div className="widget-selector-overlay">
      <div className="widget-selector-modal">
        <div className="widget-selector-header">
          <h3 className="widget-selector-title">Add Widget</h3>
          <button
            onClick={onClose}
            className="widget-selector-close"
            title="Close"
          >
            ×
          </button>
        </div>
        
        <div className="widget-selector-content">
          <div className="widget-selector-grid">
            {widgetTypes.map((widget) => (
              <button
                key={widget.type}
                onClick={() => handleAddWidget(widget)}
                className="widget-selector-item"
              >
                <div className="widget-selector-item-header">
                  <span className="widget-selector-item-icon">{widget.icon}</span>
                  <h4 className="widget-selector-item-title">{widget.name}</h4>
                </div>
                <p className="widget-selector-item-description">{widget.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
