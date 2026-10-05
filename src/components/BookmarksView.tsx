import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import type { Post } from '../types';
import { PostCard } from './PostCard';

interface BookmarksViewProps {
  posts: Post[];
  onBack: () => void;
  onPostClick: (postId: number) => void;
  onUserClick: (userId: number) => void;
  onLikeToggle: (postId: number) => void;
  onBookmarkToggle: (postId: number) => void;
  onShare?: (post: Post) => void;
  onTagClick?: (tag: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  posts,
  onBack,
  onPostClick,
  onUserClick,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onTagClick,
  onEdit,
  onDelete,
}) => {
  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-2 py-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#00B59C] fill-[#00B59C]" />
            <span>Saved Bookmarks</span>
          </h2>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {bookmarkedPosts.length} saved
        </span>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center shadow-card border border-gray-100 dark:border-slate-700/60 space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#00B59C]/10 text-[#00B59C] flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            You don't have any bookmarks yet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Click the bookmark icon on any chirp in your feed to save it for quick reference later.
          </p>
          <button
            onClick={onBack}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00B59C] text-white text-sm font-bold hover:bg-[#009d87] transition-all"
          >
            Explore Feed
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostClick={onPostClick}
              onUserClick={onUserClick}
              onLikeToggle={onLikeToggle}
              onBookmarkToggle={onBookmarkToggle}
              onShare={onShare}
              onTagClick={onTagClick}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
