import React, { useState, useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import type { User } from '../types';

interface ComposeBoxProps {
  currentUser?: User;
  onPostCreated: (title: string, body: string, mediaUrl?: string) => void;
  compact?: boolean;
  onSuccess?: () => void;
}

export const ComposeBox: React.FC<ComposeBoxProps> = ({
  currentUser,
  onPostCreated,
  compact = false,
  onSuccess,
}) => {
  // Simple form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character limit is 280
  const charLimit = 280;
  const charsLeft = charLimit - body.length;
  const isTooLong = body.length > charLimit;
  const canPost = title.trim() !== '' && body.trim() !== '' && !isTooLong;

  // Handle uploading an image
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;

    onPostCreated(title, body, mediaUrl || undefined);

    // Reset inputs
    setTitle('');
    setBody('');
    setMediaUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-card border border-gray-100 dark:border-slate-700/60">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">😁</span>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Share What You Are Feeling!
          </h3>
        </div>
        {currentUser && (
          <span className="text-xs text-gray-400">
            @{currentUser.username}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Post Title input */}
        <input
          type="text"
          placeholder="Title (e.g. A nice thought today...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B59C]"
        />

        {/* Post Context textarea */}
        <textarea
          rows={compact ? 3 : 4}
          placeholder="Share what is on your mind..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B59C] resize-none"
        />

        {/* Image preview if user uploaded one */}
        {mediaUrl && (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 max-h-48">
            <img src={mediaUrl} alt="Preview" className="w-full h-44 object-cover" />
            <button
              type="button"
              onClick={() => setMediaUrl(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60">
          {/* File attachment button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadImage}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#00B59C] hover:bg-[#00B59C]/10 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              <span>Attach Assets</span>
            </button>
          </div>

          {/* Right side: 280 count and Post pill */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs ${
                isTooLong
                  ? 'text-red-500 font-bold'
                  : charsLeft < 30
                  ? 'text-amber-500 font-medium'
                  : 'text-gray-400'
              }`}
            >
              {body.length}/280
            </span>

            {/* Teal rounded pill button: Post ➢ */}
            <button
              type="submit"
              disabled={!canPost}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                canPost
                  ? 'bg-[#00B59C] text-white hover:bg-[#009d87] cursor-pointer'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Post ➢
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
