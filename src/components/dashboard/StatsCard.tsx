import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Icons } from '../icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconColor = "text-blue-600" 
}) => {
  const IconComponent = Icons[icon];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <IconComponent className={`w-8 h-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
