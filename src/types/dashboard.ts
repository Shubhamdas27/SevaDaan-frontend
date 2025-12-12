// Dashboard types and interfaces
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  config: Record<string, any>;
  isLoading?: boolean;
  error?: string;
  data?: any;
  lastUpdated?: Date;
}

export interface DashboardLayout {
  id: string;
  userId: string;
  role: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault?: boolean;
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetConfig {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultSize: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  maxSize?: {
    width: number;
    height: number;
  };
  configSchema: Record<string, any>;
  permissions: string[];
}

export interface DashboardData {
  [key: string]: any;
}

export interface DataProvider {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  isRealtime: boolean;
  refreshInterval?: number;
  lastFetched?: Date;
  data?: any;
  error?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface KPIData {
  value: number;
  label: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    period: string;
  };
  format?: 'number' | 'currency' | 'percentage';
  color?: string;
}

export interface TableData {
  columns: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'action';
    sortable?: boolean;
    width?: string;
  }[];
  rows: Record<string, any>[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface MapData {
  locations: {
    id: string;
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    value: number;
    color?: string;
    popup?: string;
  }[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

export interface ActivityData {
  id: string;
  timestamp: Date;
  type: string;
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: {
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  status?: string[];
  customFilters?: Record<string, any>;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  widgets?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
  includeData?: boolean;
}

export type UserRole = 'admin' | 'ngo' | 'ngo_admin' | 'ngo_manager' | 'volunteer' | 'donor' | 'citizen';

export interface DashboardPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canManageNGOs: boolean;
  canManagePrograms: boolean;
  canViewFinancials: boolean;
  canManagePayments: boolean;
}

export interface DashboardTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface DashboardState {
  currentLayout: DashboardLayout | null;
  availableLayouts: DashboardLayout[];
  widgets: DashboardWidget[];
  widgetConfigs: WidgetConfig[];
  dataProviders: DataProvider[];
  permissions: DashboardPermissions;
  theme: DashboardTheme;
  filters: FilterOptions;
  isLoading: boolean;
  error?: string;
}
