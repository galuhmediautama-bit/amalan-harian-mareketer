import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
    info: 'text-blue-900'
  };

  return (
    <div
      className={`${bgColors[toast.type]} ${textColors[toast.type]} border-2 rounded-xl shadow-lg p-4 min-w-[280px] max-w-md flex items-center gap-3 animate-slide-in-right`}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-1 font-bold text-sm">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Toast hook/manager
let toastIdCounter = 0;
const toastListeners: Array<(toast: Toast) => void> = [];

export const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
  const toast: Toast = {
    id: `toast-${toastIdCounter++}`,
    message,
    type,
    duration
  };
  
  toastListeners.forEach(listener => listener(toast));
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
    };
    
    toastListeners.push(listener);
    
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, removeToast };
};

