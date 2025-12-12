import React, { useState, useEffect, useCallback } from 'react';
import { 
  Filter, 
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Star,
  CheckCircle
} from 'lucide-react';
import { format, subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Interface definitions
export interface FilterConfig {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multiselect' | 'range' | 'boolean' | 'search';
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  min?: number;
  max?: number;
}

export interface CustomView {
  id: string;
  name: string;
  description: string;
  filters: Record<string, any>;
  chartTypes: string[];
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  isFavorite: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'map';
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  dataSource: string;
  isVisible: boolean;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}

interface AdvancedFilteringProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onViewChange: (view: CustomView | null) => void;
  role: string;
  initialFilters?: Record<string, any>;
}

// Pre-defined filter configurations
const FILTER_CONFIGS: Record<string, FilterConfig[]> = {
  ngo_admin: [
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date',
      defaultValue: { start: subDays(new Date(), 30), end: new Date() }
    },
    {
      id: 'program',
      label: 'Program',
      type: 'multiselect',
      options: [
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Healthcare' },
        { value: 'environment', label: 'Environment' },
        { value: 'poverty', label: 'Poverty Alleviation' },
        { value: 'disaster', label: 'Disaster Relief' }
      ]
    },
    {
      id: 'donationRange',
      label: 'Donation Amount Range',
      type: 'range',
      min: 0,
      max: 100000,
      defaultValue: { min: 0, max: 100000 }
    },
    {
      id: 'volunteerStatus',
      label: 'Volunteer Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Volunteers' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'new', label: 'New Joiners' }
      ],
      defaultValue: 'all'
    },
    {
      id: 'region',
      label: 'Region',
      type: 'multiselect',
      options: [
        { value: 'north', label: 'North India' },
        { value: 'south', label: 'South India' },
        { value: 'east', label: 'East India' },
        { value: 'west', label: 'West India' },
        { value: 'central', label: 'Central India' }
      ]
    },
    {
      id: 'successRate',
      label: 'Program Success Rate',
      type: 'range',
      min: 0,
      max: 100,
      defaultValue: { min: 0, max: 100 }
    }
  ],
  volunteer: [
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date',
      defaultValue: { start: subDays(new Date(), 30), end: new Date() }
    },
    {
      id: 'activityType',
      label: 'Activity Type',
      type: 'multiselect',
      options: [
        { value: 'fieldwork', label: 'Field Work' },
        { value: 'fundraising', label: 'Fundraising' },
        { value: 'awareness', label: 'Awareness Campaigns' },
        { value: 'admin', label: 'Administrative' },
        { value: 'training', label: 'Training' }
      ]
    },
    {
      id: 'hoursRange',
      label: 'Hours Volunteered',
      type: 'range',
      min: 0,
      max: 100,
      defaultValue: { min: 0, max: 100 }
    }
  ],
  donor: [
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date',
      defaultValue: { start: subDays(new Date(), 30), end: new Date() }
    },
    {
      id: 'donationType',
      label: 'Donation Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Donations' },
        { value: 'one-time', label: 'One-time' },
        { value: 'recurring', label: 'Recurring' },
        { value: 'memorial', label: 'Memorial' }
      ],
      defaultValue: 'all'
    }
  ]
};

// Pre-defined custom views
const PREDEFINED_VIEWS: CustomView[] = [
  {
    id: 'overview',
    name: 'Overview Dashboard',
    description: 'High-level overview of all key metrics',
    filters: {},
    chartTypes: ['line', 'bar', 'pie'],
    isDefault: true,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 'donation-analysis',
    name: 'Donation Analysis',
    description: 'Detailed analysis of donation patterns and trends',
    filters: { 
      dateRange: { start: subMonths(new Date(), 6), end: new Date() },
      donationRange: { min: 1000, max: 50000 }
    },
    chartTypes: ['line', 'area', 'bar'],
    isDefault: false,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 'volunteer-performance',
    name: 'Volunteer Performance',
    description: 'Track volunteer activities and performance metrics',
    filters: {
      dateRange: { start: subMonths(new Date(), 3), end: new Date() },
      volunteerStatus: 'active'
    },
    chartTypes: ['bar', 'donut'],
    isDefault: false,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFavorite: false
  },
  {
    id: 'program-effectiveness',
    name: 'Program Effectiveness',
    description: 'Analyze program success rates and impact',
    filters: {
      successRate: { min: 70, max: 100 },
      dateRange: { start: subMonths(new Date(), 12), end: new Date() }
    },
    chartTypes: ['bar', 'line'],
    isDefault: false,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFavorite: false
  }
];

export const AdvancedFiltering: React.FC<AdvancedFilteringProps> = ({
  onFiltersChange,
  onViewChange,
  role,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [customViews, setCustomViews] = useState<CustomView[]>(PREDEFINED_VIEWS);
  const [selectedView, setSelectedView] = useState<CustomView | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateView, setShowCreateView] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [quickDateFilter, setQuickDateFilter] = useState('last30days');

  const filterConfigs = FILTER_CONFIGS[role] || FILTER_CONFIGS.volunteer;

  // Initialize default filters
  useEffect(() => {
    const defaultFilters = filterConfigs.reduce((acc, config) => {
      if (config.defaultValue !== undefined) {
        acc[config.id] = config.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>);
    
    setFilters({ ...defaultFilters, ...initialFilters });
  }, [role, initialFilters]);

  // Apply filters
  const applyFilters = useCallback(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Quick date filter options
  const quickDateOptions = [
    { value: 'today', label: 'Today', getDates: () => ({ start: new Date(), end: new Date() }) },
    { value: 'yesterday', label: 'Yesterday', getDates: () => ({ start: subDays(new Date(), 1), end: subDays(new Date(), 1) }) },
    { value: 'last7days', label: 'Last 7 Days', getDates: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
    { value: 'last30days', label: 'Last 30 Days', getDates: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
    { value: 'thisweek', label: 'This Week', getDates: () => ({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }) },
    { value: 'thismonth', label: 'This Month', getDates: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
    { value: 'last3months', label: 'Last 3 Months', getDates: () => ({ start: subMonths(new Date(), 3), end: new Date() }) },
    { value: 'last6months', label: 'Last 6 Months', getDates: () => ({ start: subMonths(new Date(), 6), end: new Date() }) }
  ];

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  // Handle quick date filter
  const handleQuickDateFilter = (value: string) => {
    setQuickDateFilter(value);
    const option = quickDateOptions.find(opt => opt.value === value);
    if (option) {
      const dates = option.getDates();
      handleFilterChange('dateRange', dates);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = filterConfigs.reduce((acc, config) => {
      if (config.defaultValue !== undefined) {
        acc[config.id] = config.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>);
    setFilters(defaultFilters);
    setQuickDateFilter('last30days');
  };

  // Apply custom view
  const applyView = (view: CustomView) => {
    setSelectedView(view);
    setFilters({ ...filters, ...view.filters });
    onViewChange(view);
    
    // Update usage count
    setCustomViews(prev => prev.map(v => 
      v.id === view.id ? { ...v, usageCount: v.usageCount + 1 } : v
    ));
  };

  // Toggle favorite view
  const toggleFavorite = (viewId: string) => {
    setCustomViews(prev => prev.map(view => 
      view.id === viewId ? { ...view, isFavorite: !view.isFavorite } : view
    ));
  };

  // Save current view
  const saveCurrentView = () => {
    if (!newViewName.trim()) return;

    const newView: CustomView = {
      id: `custom-${Date.now()}`,
      name: newViewName,
      description: newViewDescription,
      filters: { ...filters },
      chartTypes: ['line', 'bar', 'pie'],
      isDefault: false,
      isPublic: false,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      isFavorite: false
    };

    setCustomViews(prev => [...prev, newView]);
    setShowCreateView(false);
    setNewViewName('');
    setNewViewDescription('');
  };

  // Render filter input based on type
  const renderFilterInput = (config: FilterConfig) => {
    const value = filters[config.id];

    switch (config.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(config.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={config.label}
          >
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {config.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValue = value || [];
                    const newValue = e.target.checked
                      ? [...currentValue, option.value]
                      : currentValue.filter((v: string) => v !== option.value);
                    handleFilterChange(config.id, newValue);
                  }}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e) => handleFilterChange(config.id, { ...value, min: Number(e.target.value) })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={config.min}
                max={config.max}
                aria-label={`${config.label} minimum value`}
              />
              <input
                type="number"
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e) => handleFilterChange(config.id, { ...value, max: Number(e.target.value) })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={config.min}
                max={config.max}
                aria-label={`${config.label} maximum value`}
              />
            </div>
            <div className="text-sm text-gray-500">
              Range: {config.min} - {config.max}
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-3">
            {/* Quick Date Filters */}
            <div className="grid grid-cols-2 gap-2">
              {quickDateOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleQuickDateFilter(option.value)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    quickDateFilter === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Custom Date Inputs */}
            <div className="flex space-x-2">
              <input
                type="date"
                value={value?.start ? format(new Date(value.start), 'yyyy-MM-dd') : ''}
                onChange={(e) => handleFilterChange(config.id, { ...value, start: new Date(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Start date"
              />
              <input
                type="date"
                value={value?.end ? format(new Date(value.end), 'yyyy-MM-dd') : ''}
                onChange={(e) => handleFilterChange(config.id, { ...value, end: new Date(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="End date"
              />
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFilterChange(config.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${config.label.toLowerCase()}`}
            aria-label={config.label}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filtering</h3>
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              {isFiltersExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{isFiltersExpanded ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowViewModal(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Views</span>
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
        
        {selectedView && (
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">Active View:</span>
            <span className="font-medium text-gray-900">{selectedView.name}</span>
            <button
              onClick={() => setSelectedView(null)}
              className="text-red-600 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {isFiltersExpanded && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterConfigs.map(config => (
              <div key={config.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {config.label}
                </label>
                {renderFilterInput(config)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Views Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Custom Views</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCreateView(true)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create View
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customViews.map(view => (
                  <div
                    key={view.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedView?.id === view.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      applyView(view);
                      setShowViewModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{view.name}</h4>
                          {view.isDefault && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              Default
                            </span>
                          )}
                          {view.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{view.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Used {view.usageCount} times</span>
                          <span>Created {format(new Date(view.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(view.id);
                        }}
                        className="ml-2 text-gray-400 hover:text-yellow-500"
                      >
                        {view.isFavorite ? 
                          <Star className="h-4 w-4 fill-current" /> : 
                          <Star className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create View Modal */}
      {showCreateView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Custom View</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  View Name
                </label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter view name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newViewDescription}
                  onChange={(e) => setNewViewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe this view"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                Current filters will be saved with this view.
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateView(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentView}
                disabled={!newViewName.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFiltering;
