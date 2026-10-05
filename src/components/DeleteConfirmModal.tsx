import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import type { Post } from '../types';

interface DeleteConfirmModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (postId: number) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirm,
}) => {
  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/80 w-full max-w-md p-6 space-y-5 transform transition-all animate-scale-up"
      >
        {/* Top Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-100 dark:border-red-900/40 flex items-center justify-center shadow-sm">
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h2
            id="delete-modal-title"
            className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white"
          >
            Delete Chirp?
          </h2>
          <p
            id="delete-modal-desc"
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
          >
            This action cannot be undone. This chirp will be permanently removed from your feed, profile, and search results.
          </p>
        </div>

        {/* Chirp Preview snippet */}
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600/60 space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            {post.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {post.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(post.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Chirp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
