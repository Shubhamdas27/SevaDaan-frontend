import React, { useState, useCallback, useRef } from 'react';
import { X, Move, Settings, RefreshCw, MoreVertical } from 'lucide-react';
import { DashboardWidget as WidgetType } from '../../types/dashboard';

interface WidgetWrapperProps {
  widget: WidgetType;
  children: React.ReactNode;
  onUpdate: (widgetId: string, updates: Partial<WidgetType>) => void;
  onRemove: (widgetId: string) => void;
  onRefresh: (widgetId: string) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  isEditable?: boolean;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widget,
  children,
  onUpdate,
  onRemove,
  onRefresh,
  isDraggable = true,
  isResizable = true,
  isEditable = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowMenu(false);
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    setIsDragging(true);
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      
      // Convert to grid coordinates (assuming 20px grid)
      const gridX = Math.round(newX / 20);
      const gridY = Math.round(newY / 20);

      onUpdate(widget.id, {
        position: { x: Math.max(0, gridX), y: Math.max(0, gridY) }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDraggable, onUpdate, widget.id]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (!isResizable) return;
    
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = widget.size.width;
    const startHeight = widget.size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Convert to grid units (assuming 20px grid)
      const gridDeltaX = Math.round(deltaX / 20);
      const gridDeltaY = Math.round(deltaY / 20);

      const newWidth = Math.max(2, startWidth + gridDeltaX);
      const newHeight = Math.max(2, startHeight + gridDeltaY);

      onUpdate(widget.id, {
        size: { width: newWidth, height: newHeight }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isResizable, onUpdate, widget.id, widget.size]);

  const handleRefresh = useCallback(() => {
    onRefresh(widget.id);
    setShowMenu(false);
  }, [onRefresh, widget.id]);

  const handleRemove = useCallback(() => {
    if (window.confirm('Are you sure you want to remove this widget?')) {
      onRemove(widget.id);
    }
  }, [onRemove, widget.id]);

  const handleSettings = useCallback(() => {
    setShowSettings(true);
    setShowMenu(false);
  }, []);

  const handleSaveSettings = useCallback((newConfig: any) => {
    onUpdate(widget.id, { config: { ...widget.config, ...newConfig } });
    setShowSettings(false);
  }, [onUpdate, widget.id, widget.config]);

  return (
    <div
      ref={dragRef}
      className={`relative bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105 z-50' : ''
      } ${isResizing ? 'shadow-lg z-40' : ''}`}
      style={{
        gridArea: `${widget.position.y + 1} / ${widget.position.x + 1} / span ${widget.size.height} / span ${widget.size.width}`,
        minHeight: '200px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {isDraggable && (isHovered || isDragging) && (
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-move"
              onMouseDown={handleDragStart}
              title="Drag to move"
            >
              <Move className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <h3 className="font-medium text-gray-900 truncate">{widget.title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {widget.isLoading && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          
          {widget.lastUpdated && (
            <span className="text-xs text-gray-500">
              {new Date(widget.lastUpdated).toLocaleTimeString()}
            </span>
          )}
          
          {(isHovered || showMenu) && (
            <div className="relative">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => setShowMenu(!showMenu)}
                title="Widget menu"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                  <button
                    className="w-full px-3 py-1 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                  
                  {isEditable && (
                    <button
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={handleSettings}
                    >
                      <Settings className="w-3 h-3" />
                      Settings
                    </button>
                  )}
                  
                  <button
                    className="w-full px-3 py-1 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    onClick={handleRemove}
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-3 h-full overflow-hidden">
        {widget.error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-sm text-red-600">{widget.error}</p>
              <button
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                onClick={handleRefresh}
              >
                Retry
              </button>
            </div>
          </div>
        ) : widget.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Resize Handle */}
      {isResizable && (isHovered || isResizing) && (
        <div
          ref={resizeRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <WidgetSettingsModal
          widget={widget}
          onSave={handleSaveSettings}
          onCancel={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

// Widget Settings Modal Component
interface WidgetSettingsModalProps {
  widget: WidgetType;
  onSave: (config: any) => void;
  onCancel: () => void;
}

const WidgetSettingsModal: React.FC<WidgetSettingsModalProps> = ({
  widget,
  onSave,
  onCancel
}) => {
  const [config, setConfig] = useState(widget.config);
  const [title, setTitle] = useState(widget.title);

  const handleSave = useCallback(() => {
    onSave({ ...config, title });
  }, [config, title, onSave]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Widget Settings</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded"
            title="Close settings"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter widget title"
              title="Widget title"
            />
          </div>
          
          {/* Dynamic config fields based on widget type */}
          {widget.type === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={config.chartType || 'line'}
                onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Chart type"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="doughnut">Doughnut Chart</option>
              </select>
            </div>
          )}
          
          {widget.type === 'table' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rows Per Page
              </label>
              <input
                type="number"
                value={config.pageSize || 10}
                onChange={(e) => setConfig({ ...config, pageSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="50"
                title="Rows per page"
                placeholder="10"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
