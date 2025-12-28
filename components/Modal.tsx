import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Batal',
  showCancel = false
}) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-8 h-8 text-green-600" />,
    error: <AlertTriangle className="w-8 h-8 text-red-600" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-600" />,
    info: <Info className="w-8 h-8 text-blue-600" />,
    confirm: <HelpCircle className="w-8 h-8 text-purple-600" />
  };

  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    confirm: 'bg-purple-600 hover:bg-purple-700'
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {icons[type]}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-slate-700 text-center mb-6 font-medium">
          {message}
        </p>

        {/* Buttons */}
        <div className={`flex gap-3 ${showCancel ? '' : 'justify-center'}`}>
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-200 text-slate-900 font-black rounded-xl hover:bg-slate-300 transition-all active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 px-4 ${buttonColors[type]} text-white font-black rounded-xl transition-all active:scale-95`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

// Helper function untuk show modal programmatically
let modalListeners: Array<(props: Omit<ModalProps, 'isOpen'>) => void> = [];

export const showModal = (props: Omit<ModalProps, 'isOpen'>) => {
  modalListeners.forEach(listener => listener(props));
};

export const useModal = () => {
  const [modalProps, setModalProps] = React.useState<Omit<ModalProps, 'isOpen'> | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const listener = (props: Omit<ModalProps, 'isOpen'>) => {
      setModalProps(props);
      setIsOpen(true);
    };
    
    modalListeners.push(listener);
    
    return () => {
      const index = modalListeners.indexOf(listener);
      if (index > -1) {
        modalListeners.splice(index, 1);
      }
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setModalProps(null), 200);
  };

  return {
    modalProps: modalProps ? { ...modalProps, isOpen, onClose: closeModal } : null,
    closeModal
  };
};


