import React from 'react';
import { Badge } from '../../ui/Badge';

interface ReferralItem {
  id: string;
  fromProgram: string;
  toProgram: string;
  beneficiary: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
}

const ReferralTrackingList: React.FC = () => {
  const referrals: ReferralItem[] = [
    {
      id: '1',
      fromProgram: 'Healthcare Initiative',
      toProgram: 'Nutrition Program',
      beneficiary: 'Anil Kumar',
      status: 'approved',
      date: '2025-06-05'
    },
    {
      id: '2',
      fromProgram: 'Education Workshop',
      toProgram: 'Skill Development',
      beneficiary: 'Meena Sharma',
      status: 'pending',
      date: '2025-06-07'
    },
    {
      id: '3',
      fromProgram: 'Food Distribution',
      toProgram: 'Community Kitchen',
      beneficiary: 'Rajesh Patel',
      status: 'completed',
      date: '2025-06-01'
    },
    {
      id: '4',
      fromProgram: 'Mental Health Support',
      toProgram: 'Counseling Services',
      beneficiary: 'Priya Singh',
      status: 'pending',
      date: '2025-06-07'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'rejected':
        return 'bg-danger-100 text-danger-700';
      case 'completed':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-3">
      {referrals.map(referral => (
        <div key={referral.id} className="p-3 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{referral.beneficiary}</span>
            <Badge className={getStatusColor(referral.status)}>
              {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>From: {referral.fromProgram}</span>
              <span>Date: {new Date(referral.date).toLocaleDateString()}</span>
            </div>
            <div className="flex">
              <span>To: {referral.toProgram}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferralTrackingList;
