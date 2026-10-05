import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Failed to load content. Please check your internet connection.',
  onRetry,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-card border border-red-100 dark:border-red-900/30 text-center space-y-4">
      <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto text-red-500">
        <AlertCircle className="w-8 h-8 stroke-[1.75]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Oops! Something went wrong</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00B59C] hover:bg-[#009d87] text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};
