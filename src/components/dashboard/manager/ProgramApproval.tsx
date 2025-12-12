import React, { useState, useEffect } from 'react';
import { Check, X, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import './ProgramApproval.css';
// import { Program } from '../../../types';

// Define Program type locally without status property to avoid intersection conflicts
type Program = {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  eligibilityCriteria: string;
  capacity: number;
  currentParticipants: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

interface ProgramApprovalProps {
  onActionTaken?: (programId: string, action: 'approve' | 'reject' | 'request-changes') => void;
}

const ProgramApproval: React.FC<ProgramApprovalProps> = ({ onActionTaken }) => {
  const [programs, setPrograms] = useState<(Program & { status: 'pending' | 'approved' | 'rejected' | 'changes-requested' })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrograms([
        {
          id: 'prog-1',
          ngoId: 'ngo-1',
          title: 'Community Health Camp',
          description: 'A free healthcare camp providing medical checkups, consultations, and basic medications to underserved communities.',
          startDate: '2023-08-15',
          endDate: '2023-08-17',
          location: 'Central Park, Mumbai',
          status: 'pending',
          eligibilityCriteria: 'Open to all residents of nearby slum areas',
          capacity: 500,
          currentParticipants: 0,
          imageUrl: '/images/health-camp.jpg',
          createdAt: '2023-07-20T10:30:00Z',
          updatedAt: '2023-07-20T10:30:00Z'
        },
        {
          id: 'prog-2',
          ngoId: 'ngo-2',
          title: 'Women Empowerment Workshop',
          description: 'A series of workshops focusing on skill development, financial literacy, and entrepreneurship for women from marginalized communities.',
          startDate: '2023-09-01',
          endDate: '2023-10-30',
          location: 'Community Center, Delhi',
          status: 'pending',
          eligibilityCriteria: 'Women aged 18-45 from low-income households',
          capacity: 100,
          currentParticipants: 0,
          imageUrl: '/images/women-workshop.jpg',
          createdAt: '2023-07-25T14:15:00Z',
          updatedAt: '2023-07-25T14:15:00Z'
        },
        {
          id: 'prog-3',
          ngoId: 'ngo-3',
          title: 'Clean River Initiative',
          description: 'An environmental project aimed at cleaning and preserving local river ecosystems through community involvement.',
          startDate: '2023-08-20',
          endDate: '2023-11-20',
          location: 'Yamuna River Bank, Delhi',
          status: 'changes-requested',
          eligibilityCriteria: 'Open to all volunteers above 16 years',
          capacity: 300,
          currentParticipants: 0,
          imageUrl: '/images/river-cleanup.jpg',
          createdAt: '2023-07-18T09:45:00Z',
          updatedAt: '2023-07-18T09:45:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAction = (programId: string, action: 'approve' | 'reject' | 'request-changes') => {
    // Update local state
    setPrograms(prev => 
      prev.map(program => {
        if (program.id === programId) {
          let newStatus: 'pending' | 'approved' | 'rejected' | 'changes-requested';
          
          switch (action) {
            case 'approve':
              newStatus = 'approved';
              break;
            case 'reject':
              newStatus = 'rejected';
              break;
            case 'request-changes':
              newStatus = 'changes-requested';
              break;
            default:
              newStatus = program.status;
          }
          
          return { ...program, status: newStatus };
        }
        return program;
      })
    );
    
    // Call parent component callback if provided
    if (onActionTaken) {
      onActionTaken(programId, action);
    }
  };

  const handleCommentChange = (programId: string, comment: string) => {
    setCommentMap(prev => ({ ...prev, [programId]: comment }));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-600" />;
      case 'changes-requested':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Program Approvals</h2>
        <p className="text-sm text-gray-500 mt-1">Review and manage program submissions</p>
      </div>

      <div className="divide-y divide-gray-200">
        {programs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No programs pending approval
          </div>
        ) : (
          programs.map(program => (
            <div key={program.id} className="p-4 hover:bg-gray-50">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(program.id)}
              >
                <div className="flex items-center">
                  {getStatusIcon(program.status)}
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{program.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(program.startDate).toLocaleDateString()} - {program.location}
                    </p>
                  </div>
                </div>
                <span
                  className={
                    `px-3 py-1 text-xs rounded-full mr-4 ` +
                    (program.status === 'approved'
                      ? 'status-badge-approved'
                      : program.status === 'rejected'
                      ? 'status-badge-rejected'
                      : program.status === 'changes-requested'
                      ? 'status-badge-changes-requested'
                      : 'status-badge-pending')
                  }
                >
                  {program.status === 'pending' ? 'Pending Review' :
                    program.status === 'approved' ? 'Approved' :
                    program.status === 'rejected' ? 'Rejected' :
                    'Changes Requested'}
                </span>
                {expandedId === program.id ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />}
              </div>
              {expandedId === program.id && (
                <div className="mt-4 pl-12">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Description:</h4>
                    <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Date Range:</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(program.startDate).toLocaleDateString()} - 
                          {program.endDate ? new Date(program.endDate).toLocaleDateString() : 'Ongoing'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Capacity:</h4>
                        <p className="text-sm text-gray-600">{program.capacity} participants</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900">Eligibility:</h4>
                      <p className="text-sm text-gray-600">{program.eligibilityCriteria}</p>
                    </div>
                  </div>
                  
                  {program.status !== 'approved' && program.status !== 'rejected' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback/Comments
                      </label>
                      <textarea 
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        placeholder="Enter your feedback or reason for approval/rejection..."
                        value={commentMap[program.id] || ''}
                        onChange={(e) => handleCommentChange(program.id, e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    {program.status === 'pending' && (
                      <>
                        <button
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md text-sm font-medium border border-amber-200"
                          onClick={() => handleAction(program.id, 'request-changes')}
                        >
                          Request Changes
                        </button>
                        <button
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-200"
                          onClick={() => handleAction(program.id, 'reject')}
                        >
                          Reject
                        </button>
                        <button
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                          onClick={() => handleAction(program.id, 'approve')}
                        >
                          Approve
                        </button>
                      </>
                    )}
                    
                    {program.status === 'changes-requested' && (
                      <>
                        <button
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-200"
                          onClick={() => handleAction(program.id, 'reject')}
                        >
                          Reject
                        </button>
                        <button
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                          onClick={() => handleAction(program.id, 'approve')}
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgramApproval;
