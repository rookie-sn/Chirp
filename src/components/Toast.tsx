import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xl border border-gray-700/50 dark:border-gray-200 animate-fade-in"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-[#00B59C] shrink-0" />
          )}

          <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-gray-400 hover:text-white dark:hover:text-gray-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
