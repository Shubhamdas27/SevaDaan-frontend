import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component for graceful error handling in React components.
 * 
 * Features:
 * - Catches JavaScript errors in child component tree
 * - Displays a fallback UI instead of crashing the application
 * - Logs error information for debugging
 * - Provides ability to retry/reset when errors occur
 * - Can be reset when specified props change
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props): void {
    // If any resetKeys change, reset the error boundary
    if (this.state.hasError && this.props.resetKeys) {
      // Check if any reset keys have changed
      const hasKeyChanged = this.props.resetKeys.some((key, index) => {
        return prevProps.resetKeys?.[index] !== key;
      });

      if (hasKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-6 rounded-lg border border-error-200 bg-error-50 text-center flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-error-500 mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-error-700 mb-2">Something went wrong</h3>
          <div className="text-error-600 mb-4">
            <p className="mb-2">An error occurred while rendering this component.</p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="text-left whitespace-pre-wrap text-xs mt-2 p-2 bg-error-100 rounded">
                <summary className="cursor-pointer mb-1">Error details (developer only)</summary>
                <p className="mb-1"><strong>{this.state.error.toString()}</strong></p>
                <p className="text-xs text-error-700">
                  {this.state.errorInfo?.componentStack || 'Stack trace not available'}
                </p>
              </details>
            )}
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={this.resetErrorBoundary}
              className="flex items-center"
              aria-label="Try again"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
