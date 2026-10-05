import React, { useState, useEffect, useRef } from 'react';
import { X, Pencil, Paperclip, Hash, Image as ImageIcon } from 'lucide-react';
import type { Post } from '../types';

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    postId: number,
    updates: { title: string; body: string; mediaUrl?: string; tags?: string[] }
  ) => void;
}

interface EditFormProps {
  post: Post;
  onClose: () => void;
  onSave: (
    postId: number,
    updates: { title: string; body: string; mediaUrl?: string; tags?: string[] }
  ) => void;
}

const EditPostForm: React.FC<EditFormProps> = ({ post, onClose, onSave }) => {
  const [title, setTitle] = useState(post.title || '');
  const [body, setBody] = useState(post.body || '');
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(post.mediaUrl);
  const [tags, setTags] = useState<string[]>(post.tags ? [...post.tags] : []);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charLimit = 280;
  const charsLeft = charLimit - body.length;
  const isTooLong = body.length > charLimit;
  const canSave = title.trim() !== '' && body.trim() !== '' && !isTooLong;

  // Handle uploading/changing image
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

  // Add tag
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#+/, '').toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    onSave(post.id, {
      title: title.trim(),
      body: body.trim(),
      mediaUrl: mediaUrl || undefined,
      tags: tags.length > 0 ? tags : ['chirp'],
    });

    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/80 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transform transition-all animate-scale-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00B59C]/10 text-[#00B59C]">
            <Pencil className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2
              id="edit-modal-title"
              className="text-lg font-bold text-gray-900 dark:text-white leading-tight"
            >
              Edit Chirp
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update your chirp's title, text, tags, or image.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Post Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chirp title..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B59C] focus:border-transparent transition-all"
          />
        </div>

        {/* Post Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Chirp Content
            </label>
            <span
              className={`text-xs tabular-nums font-semibold ${
                isTooLong
                  ? 'text-red-500 font-bold'
                  : charsLeft < 30
                  ? 'text-amber-500'
                  : 'text-gray-400'
              }`}
            >
              {body.length}/{charLimit}
            </span>
          </div>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What would you like to update?..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B59C] focus:border-transparent transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Media Attachment / Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Media Attachment
          </label>
          {mediaUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 max-h-56 bg-gray-100 dark:bg-slate-900 group">
              <img
                src={mediaUrl}
                alt="Post preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-bold backdrop-blur-sm transition-all"
                  title="Change image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaUrl(undefined)}
                  className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-sm transition-all"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-[#00B59C] dark:hover:border-[#00B59C] rounded-2xl p-4 text-center text-xs font-semibold text-gray-500 hover:text-[#00B59C] transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Attach or replace photo</span>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadImage}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 min-h-[42px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00B59C]/10 text-[#008774] dark:text-[#38e8cb]"
              >
                <Hash className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500 p-0.5"
                  title={`Remove #${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              placeholder={tags.length === 0 ? 'Type tags and press Enter...' : '+ tag'}
              className="flex-1 min-w-[100px] bg-transparent border-none text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none px-1 py-0.5"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Press Enter or comma to add a tag.
          </p>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-gray-100 dark:border-slate-700/70 bg-gray-50/60 dark:bg-slate-800/80">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSave}
          className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all ${
            canSave
              ? 'bg-[#00B59C] hover:bg-[#009d87] text-white shadow-sm active:scale-95 cursor-pointer'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onSave,
}) => {
  // Lock body scroll when modal is open and handle ESC key
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <EditPostForm key={post.id} post={post} onClose={onClose} onSave={onSave} />
    </div>
  );
};
