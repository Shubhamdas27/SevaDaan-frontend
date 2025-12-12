import React from 'react';
import {
  // Navigation icons
  Home,
  Settings,
  User,
  Users,
  UserPlus,
  Check,
  Calendar,
  MapPin,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  
  // Status icons
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Shield,
  
  // Action icons
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Save,
  Copy,
  Share2,
  Bookmark,
  Heart,
  Star,
  
  // Communication icons
  Mail,
  Phone,
  MessageCircle,
  Bell,
  BellOff,
  Send,
  
  // Finance icons
  DollarSign,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  
  // Documents icons
  FileText,
  Image,
  Video,
  File,
  Folder,
  
  // Dashboard icons
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  
  // Social icons
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  
  // Utility icons
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  MoreHorizontal,
  MoreVertical,
  
  type LucideIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Export commonly used icons with consistent naming
export const Icons = {
  // Navigation
  home: Home,
  settings: Settings,
  user: User,
  users: Users,
  userPlus: UserPlus,
  check: Check,
  calendar: Calendar,
  location: MapPin,
  mapPin: MapPin,
  search: Search,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  externalLink: ExternalLink,
  
  // Status
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  pending: Clock,
  view: Eye,
  eye: Eye,
  hide: EyeOff,
  lock: Lock,
  shield: Shield,
  
  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  download: Download,
  upload: Upload,
  save: Save,
  copy: Copy,
  share: Share2,
  bookmark: Bookmark,
  favorite: Heart,
  heart: Heart,
  star: Star,
  
  // Communication
  email: Mail,
  phone: Phone,
  message: MessageCircle,
  notification: Bell,
  notificationOff: BellOff,
  send: Send,
  
  // Finance
  money: DollarSign,
  dollarSign: DollarSign,
  payment: CreditCard,
  donation: PiggyBank,
  trendUp: TrendingUp,
  trendDown: TrendingDown,
  
  // Documents
  document: FileText,
  image: Image,
  video: Video,
  file: File,
  folder: Folder,
  
  // Dashboard
  barChart: BarChart3,
  pieChart: PieChart,
  activity: Activity,
  target: Target,
  award: Award,
  
  // Social
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  
  // Utility
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  refresh: RefreshCw,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
} as const;

// Icon wrapper component with consistent styling
export interface IconProps {
  name: keyof typeof Icons;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted';
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className, 
  size = 'md', 
  color = 'default' 
}) => {
  const IconComponent = Icons[name];
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  
  const colorClasses = {
    default: 'text-current',
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
    muted: 'text-slate-400'
  };
  
  return (
    <IconComponent 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  );
};

// Export the LucideIcon type for props
export type { LucideIcon };

// Status icon helpers
export const getStatusIcon = (status: string): LucideIcon => {
  const statusIconMap: Record<string, LucideIcon> = {
    success: CheckCircle,
    completed: CheckCircle,
    approved: CheckCircle,
    verified: CheckCircle,
    
    warning: AlertTriangle,
    pending: Clock,
    review: Clock,
    
    error: AlertCircle,
    failed: AlertCircle,
    rejected: AlertCircle,
    cancelled: AlertCircle,
    
    info: Info,
    upcoming: Info,
    scheduled: Info
  };
  
  return statusIconMap[status.toLowerCase()] || Info;
};

// Common icon combinations for quick use
export const IconCombos = {
  loading: ({ className, ...props }: { className?: string }) => 
    <Clock className={cn('animate-spin', className)} {...props} />,
  success: ({ className, ...props }: { className?: string }) => 
    <CheckCircle className={cn('text-success-600', className)} {...props} />,
  error: ({ className, ...props }: { className?: string }) => 
    <AlertCircle className={cn('text-error-600', className)} {...props} />,
  warning: ({ className, ...props }: { className?: string }) => 
    <AlertTriangle className={cn('text-warning-600', className)} {...props} />,
  info: ({ className, ...props }: { className?: string }) => 
    <Info className={cn('text-primary-600', className)} {...props} />,
};
