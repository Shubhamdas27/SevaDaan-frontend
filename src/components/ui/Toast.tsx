import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icons } from '../icons';
import { Button } from './Button';

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  // Create convenience methods
  const toast = {
    success: (message: string, title?: string, duration?: number) => {
      context.addToast({ type: 'success', message, title, duration });
    },
    error: (message: string, title?: string, duration?: number) => {
      context.addToast({ type: 'error', message, title, duration });
    },
    warning: (message: string, title?: string, duration?: number) => {
      context.addToast({ type: 'warning', message, title, duration });
    },
    info: (message: string, title?: string, duration?: number) => {
      context.addToast({ type: 'info', message, title, duration });
    }
  };
  
  return {
    ...context,
    toast
  };
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { type, title, message } = toast;
  const typeConfig = {
    success: {
      icon: Icons.success,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    error: {
      icon: Icons.error,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: Icons.warning,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    info: {
      icon: Icons.info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`
      ${config.bgColor} 
      ${config.borderColor} 
      border 
      rounded-lg 
      p-4 
      shadow-lg 
      min-w-80 
      max-w-md 
      animate-slide-in-right
    `}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="ml-3 flex-1">
          {title && (
            <p className={`text-sm font-medium ${config.titleColor} mb-1`}>
              {title}
            </p>
          )}
          <p className={`text-sm ${config.messageColor}`}>
            {message}
          </p>
        </div>        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`ml-2 p-1 hover:bg-white/50 ${config.iconColor}`}
        >
          <Icons.close className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
