import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Copy,
} from 'lucide-react';
import type { Post } from '../types';
import { CURRENT_USER } from '../services/api';
import { usePostContext } from '../context/PostContext';

interface PostCardProps {
  post: Post;
  onPostClick: (postId: number) => void;
  onUserClick: (userId: number) => void;
  onLikeToggle: (postId: number) => void;
  onBookmarkToggle?: (postId: number) => void;
  onShare?: (post: Post) => void;
  onTagClick?: (tag: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostClick,
  onUserClick,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onTagClick,
  onEdit,
  onDelete,
}) => {
  const { setEditingPost, setDeletingPost, showToast } = usePostContext();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close 3-dots menu on click outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Check if post was authored by the logged-in user
  const isOwner =
    post.userId === CURRENT_USER.id ||
    post.author?.id === CURRENT_USER.id ||
    post.author?.username === CURRENT_USER.username;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) {
      onEdit(post);
    } else {
      setEditingPost(post);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete(post);
    } else {
      setDeletingPost(post);
    }
  };

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${post.title}\n\n${post.body}`);
      showToast('Chirp content copied to clipboard! 📋', 'info');
    }
  };

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : isOwner
    ? `${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`
    : `User #${post.userId}`;

  const authorHandle = post.author?.username
    ? `@${post.author.username}`
    : isOwner
    ? `@${CURRENT_USER.username}`
    : `@user_${post.userId}`;

  const authorAvatar =
    post.author?.image ||
    (isOwner
      ? CURRENT_USER.image
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || post.userId}`);

  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover border border-gray-100 dark:border-slate-700/60 transition-all duration-200 space-y-3.5">
      {/* 1. Header: Avatar icon, Username, @handle, time ago, Owner actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar Icon */}
          <button
            onClick={() => onUserClick(post.userId)}
            className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00B59C] group"
            title={`View ${authorName}'s profile`}
          >
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 dark:bg-slate-700 object-cover border border-gray-200 dark:border-slate-600 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`;
              }}
            />
          </button>

          {/* User Details */}
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onUserClick(post.userId)}
                className="font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-[#00B59C] dark:hover:text-[#00B59C] transition-colors truncate focus:outline-none"
              >
                {authorName}
              </button>
              <button
                onClick={() => onUserClick(post.userId)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline truncate focus:outline-none"
              >
                {authorHandle}
              </button>

              {/* Distinguish user's own post with a badge */}
              {isOwner && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#00B59C]/10 text-[#00B59C] border border-[#00B59C]/20 shrink-0">
                  You
                </span>
              )}

              <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {post.createdAt || 'recent'}
              </span>

              {post.isEdited && (
                <>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    edited
                  </span>
                </>
              )}
            </div>
            {post.author?.company?.title && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate hidden sm:block">
                {post.author.company.title}
              </span>
            )}
          </div>
        </div>

        {/* Action Menu: Edit, Delete (only for user's posts), Share, More */}
        <div className="flex items-center gap-1 relative shrink-0" ref={menuRef}>
          {/* Quick Edit & Delete buttons: ONLY if owner */}
          {isOwner && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#00B59C] dark:hover:text-[#38e8cb] hover:bg-[#00B59C]/10 transition-colors focus:outline-none"
                title="Edit chirp"
                aria-label="Edit chirp"
              >
                <Pencil className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none"
                title="Delete chirp"
                aria-label="Delete chirp"
              >
                <Trash2 className="w-4 h-4 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Share Button (Available for all posts) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(post);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-none"
            title="Share post"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* 3-dots Menu Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-none"
            title="More actions"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/80 py-1.5 z-30 animate-fade-in overflow-hidden">
              {/* Owner actions in menu */}
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-[#00B59C] dark:hover:text-[#38e8cb] transition-colors text-left"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#00B59C]" />
                    <span>Edit Chirp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Chirp</span>
                  </button>

                  <div className="my-1 border-t border-gray-100 dark:border-slate-700" />
                </>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onShare?.(post);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <Share2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                <span>Copy Text</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Rounded light gray Title box */}
      <div
        onClick={() => onPostClick(post.id)}
        className="bg-gray-100 dark:bg-slate-700/50 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-gray-200/70 dark:hover:bg-slate-700/80 transition-colors"
      >
        <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight leading-snug">
          {post.title}
        </h2>
      </div>

      {/* 3. Rounded light gray Context box with text */}
      <div
        onClick={() => onPostClick(post.id)}
        className="bg-gray-50 dark:bg-slate-700/25 rounded-xl p-3.5 sm:p-4 cursor-pointer hover:bg-gray-100/80 dark:hover:bg-slate-700/40 transition-colors"
      >
        <p className="text-sm sm:text-[15px] text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {post.body}
        </p>
      </div>

      {/* 4. Optional media placeholder container */}
      {post.mediaUrl && (
        <div
          onClick={() => onPostClick(post.id)}
          className="rounded-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-slate-700 max-h-80 bg-gray-100 dark:bg-slate-900"
        >
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-200"
            loading="lazy"
          />
        </div>
      )}

      {/* 5. Tags list */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#00B59C]/10 text-[#008774] dark:text-[#38e8cb] hover:bg-[#00B59C]/20 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 6. Interactive Like/Unlike and Comment buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Like / Unlike Button */}
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-lg text-xs sm:text-sm font-semibold transition-all group ${
              post.isLiked
                ? 'text-[#00B59C] dark:text-[#00B59C]'
                : 'hover:text-[#00B59C] hover:bg-[#00B59C]/10'
            }`}
            title={post.isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-125 ${
                post.isLiked
                  ? 'fill-[#00B59C] stroke-[#00B59C] scale-110'
                  : 'stroke-current fill-none'
              }`}
            />
            <span className="tabular-nums font-bold">
              {post.reactions?.likes || 0}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => onPostClick(post.id)}
            className="flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs sm:text-sm font-semibold hover:text-[#00B59C] hover:bg-[#00B59C]/10 transition-all group"
            title="View discussion & replies"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-current transition-transform duration-200 group-hover:scale-125" />
            <span className="tabular-nums">
              {post.commentsCount || 0}
            </span>
          </button>

          {/* Views count */}
          {post.views !== undefined && post.views > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        <div className="flex items-center gap-2">
          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(post.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                post.isBookmarked
                  ? 'text-[#00B59C] bg-[#00B59C]/10'
                  : 'hover:text-[#00B59C] hover:bg-gray-100 dark:hover:bg-slate-700/60'
              }`}
              title={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <Bookmark
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  post.isBookmarked ? 'fill-[#00B59C] stroke-[#00B59C]' : 'stroke-current'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
