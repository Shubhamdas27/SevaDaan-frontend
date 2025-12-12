import React, { useState, useEffect } from 'react';
import { realTimeService } from '../../services/realTimeService';
import { Users, DollarSign, Target, Award, Clock, Bell } from 'lucide-react';
import LiveStatus from './LiveStatus';

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface ActivityFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  maxItems = 5, 
  showHeader = true,
  className = ''
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Get initial activities
    setActivities(realTimeService.getData('activities'));

    // Subscribe to real-time updates
    const unsubscribe = realTimeService.subscribe('activities', setActivities);

    return unsubscribe;
  }, []);

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'DollarSign': return DollarSign;
      case 'Target': return Target;
      case 'Award': return Award;
      case 'Clock': return Clock;
      case 'Bell': return Bell;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'volunteer': return 'text-blue-600 bg-blue-50';
      case 'donation': return 'text-green-600 bg-green-50';
      case 'program': return 'text-purple-600 bg-purple-50';
      case 'certificate': return 'text-yellow-600 bg-yellow-50';
      case 'team': return 'text-indigo-600 bg-indigo-50';
      case 'notification': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <LiveStatus size="sm" />
        </div>
      )}
      
      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity) => {
          const IconComponent = getActivityIcon(activity.icon);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activities yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
