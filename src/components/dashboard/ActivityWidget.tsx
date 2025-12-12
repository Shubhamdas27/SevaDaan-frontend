import React from 'react';
import { Clock, User, Calendar, MessageCircle, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { ActivityData, DashboardWidget } from '../../types/dashboard';
import { WidgetWrapper } from './WidgetWrapper';

interface ActivityWidgetProps {
  widget: DashboardWidget;
  onUpdate: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  onRemove: (widgetId: string) => void;
  onRefresh: (widgetId: string) => void;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  widget,
  onUpdate,
  onRemove,
  onRefresh
}) => {
  const activities = widget.data as ActivityData[];
  
  if (!activities || activities.length === 0) {
    return (
      <WidgetWrapper
        widget={widget}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onRefresh={onRefresh}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          No recent activity
        </div>
      </WidgetWrapper>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'volunteer':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'program':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-indigo-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <WidgetWrapper
      widget={widget}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onRefresh={onRefresh}
    >
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {activity.user.name}
                    </span>
                  </div>
                  
                  {activity.metadata && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {activity.metadata.location || activity.metadata.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
};
