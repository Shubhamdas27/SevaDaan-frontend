import React, { ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import ErrorBoundary from '../common/ErrorBoundary';
import apiService from '../../lib/apiService';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
}

/**
 * Dashboard-specific error boundary that includes error reporting
 * and dashboard-specific fallback UIs.
 */
const DashboardErrorBoundary: React.FC<DashboardErrorBoundaryProps> = ({ 
  children, 
  componentName 
}) => {
  // Function to handle errors specific to dashboard components
  const handleDashboardError = async (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${componentName}:`, error);
    
    // Log the error to our backend service
    try {
      await apiService.logClientError({
        componentName,
        errorMessage: error.message,
        stackTrace: error.stack || 'No stack trace',
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    } catch (reportError) {
      // If error reporting fails, just log it (don't want to cause additional errors)
      console.error('Failed to report error to backend:', reportError);
    }
  };

  // Custom fallback UI specific to dashboard components
  const dashboardFallback = (
    <div className="p-6 rounded-lg border border-warning-200 bg-warning-50">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" aria-hidden="true" />
        <h3 className="text-lg font-medium text-warning-700">Component Error</h3>
      </div>
      <p className="text-warning-700 mb-4">
        There was an error loading the {componentName} component. 
        This has been reported to our team.
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="text-sm"
        >
          Refresh Page
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-sm"
        >
          Go Back
        </Button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      onError={handleDashboardError}
      fallback={dashboardFallback}
      resetKeys={[componentName]} // Reset if the component changes
    >
      {children}
    </ErrorBoundary>
  );
};

export default DashboardErrorBoundary;
