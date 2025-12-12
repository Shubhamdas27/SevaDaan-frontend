import React from 'react';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} className="flex items-center gap-2">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
