import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, ChevronDown, ChevronUp, Calendar, Download } from 'lucide-react';
import apiService from '../../../lib/apiService';
import { ServiceApplication as ServiceApplicationType } from '../../../types';
import { formatDate } from '../../../lib/utils';

const ServiceApplication: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ServiceApplicationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiService.getServiceApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const getStatusBadge = (status: ServiceApplicationType['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="bg-success-100 text-success-800 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="bg-warning-100 text-warning-800 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-error-100 text-error-800 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'incomplete':
        return (
          <span className="bg-slate-100 text-slate-800 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" /> Incomplete
          </span>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-slate-600">Loading your applications...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-error-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-800">Error loading applications</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }
  
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-800">No applications found</h3>
        <p className="text-slate-600 mb-4">You haven't applied to any services yet.</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = '/services'}
        >
          Explore Available Services
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-800">Your Service Applications</h3>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export All
        </Button>
      </div>
      
      {applications.map(application => {
        const isExpanded = expandedIds.includes(application.id);
        
        return (
          <Card key={application.id} className="overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleExpand(application.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusBadge(application.status)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{application.serviceName}</h4>
                  <p className="text-sm text-slate-600">{application.provider}</p>                  <div className="text-xs text-slate-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Applied on {formatDate(application.applicationDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="p-1">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-4 pb-4 pt-0">
                <div className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-slate-800 mb-2">Required Documents</h5>
                    <ul className="space-y-1">
                      {application.requiredDocuments.map((doc, index) => {
                        const isSubmitted = application.submittedDocuments.includes(doc);
                        
                        return (
                          <li key={index} className="flex items-center text-sm">
                            {isSubmitted ? (
                              <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-warning-500 mr-2" />
                            )}
                            <span className={isSubmitted ? 'text-slate-600' : 'text-slate-800 font-medium'}>
                              {doc}
                            </span>
                            {!isSubmitted && (
                              <Button variant="ghost" size="sm" className="ml-2 text-xs">
                                Upload
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-slate-800 mb-2">Status Details</h5>
                    {application.status === 'approved' && (
                      <div className="bg-success-50 border border-success-100 rounded-lg p-3 text-sm">
                        <p className="font-medium text-success-800 mb-1">Application Approved</p>
                        <p className="text-success-700">{application.nextSteps}</p>
                      </div>
                    )}
                    
                    {application.status === 'pending' && (
                      <div className="bg-warning-50 border border-warning-100 rounded-lg p-3 text-sm">
                        <p className="font-medium text-warning-800 mb-1">Under Review</p>
                        <p className="text-warning-700">{application.nextSteps}</p>
                      </div>
                    )}
                    
                    {application.status === 'rejected' && (
                      <div className="bg-error-50 border border-error-100 rounded-lg p-3 text-sm">
                        <p className="font-medium text-error-800 mb-1">Application Rejected</p>
                        <p className="text-error-700">{application.rejectionReason}</p>
                      </div>
                    )}
                    
                    {application.status === 'incomplete' && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                        <p className="font-medium text-slate-800 mb-1">Incomplete Application</p>
                        <p className="text-slate-700">{application.nextSteps}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" /> View Details
                      </Button>
                      
                      {(application.status === 'incomplete' || application.status === 'rejected') && (
                        <Button variant="primary" size="sm">
                          Complete Application
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceApplication;
