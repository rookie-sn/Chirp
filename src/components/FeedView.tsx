import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Users, Search, X, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import type { Post, FeedTab, User } from '../types';
import { PostCard } from './PostCard';
import { PostSkeleton } from './SkeletonLoader';
import { ErrorMessage } from './ErrorMessage';
import { ComposeBox } from './ComposeBox';

interface FeedViewProps {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onPostClick: (postId: number) => void;
  onUserClick: (userId: number) => void;
  onLikeToggle: (postId: number) => void;
  onBookmarkToggle: (postId: number) => void;
  onShare: (post: Post) => void;
  onTagClick: (tag: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  selectedTag: string | null;
  onClearTag: () => void;
  currentUser: User;
  onPostCreated: (title: string, body: string, mediaUrl?: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  activeTab,
  onTabChange,
  onLoadMore,
  onRetry,
  onPostClick,
  onUserClick,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onTagClick,
  searchQuery,
  onClearSearch,
  selectedTag,
  onClearTag,
  currentUser,
  onPostCreated,
  onEdit,
  onDelete,
}) => {
  const [showMobileBox, setShowMobileBox] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simple infinite scroll: check if bottom element is visible on screen
  useEffect(() => {
    if (!bottomRef.current || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    });

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  return (
    <div className="space-y-4">
      {/* 1. Sub-header tabs: Following vs Suggested */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700/60 overflow-hidden sticky top-[4.5rem] z-20">
        <div className="flex items-center">
          {/* Following Tab */}
          <button
            onClick={() => onTabChange('following')}
            className={`flex-1 py-3.5 text-center font-bold text-sm sm:text-base relative flex items-center justify-center gap-2 ${
              activeTab === 'following'
                ? 'text-[#00B59C]'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Following</span>
            {activeTab === 'following' && (
              <span className="absolute bottom-0 inset-x-12 sm:inset-x-20 h-1 bg-[#00B59C] rounded-t-full" />
            )}
          </button>

          {/* Suggested Tab */}
          <button
            onClick={() => onTabChange('suggested')}
            className={`flex-1 py-3.5 text-center font-bold text-sm sm:text-base relative flex items-center justify-center gap-2 ${
              activeTab === 'suggested'
                ? 'text-[#00B59C]'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Suggested</span>
            {activeTab === 'suggested' && (
              <span className="absolute bottom-0 inset-x-12 sm:inset-x-20 h-1 bg-[#00B59C] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Quick compose box on mobile and tablet */}
      <div className="lg:hidden">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700/60 p-3">
          <button
            onClick={() => setShowMobileBox(!showMobileBox)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/50 text-left"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              😁 Share what you are feeling...
            </span>
            {showMobileBox ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMobileBox && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
              <ComposeBox
                currentUser={currentUser}
                compact
                onPostCreated={(t, b, m) => {
                  onPostCreated(t, b, m);
                  setShowMobileBox(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Active search or tag indicator */}
      {(searchQuery || selectedTag) && (
        <div className="flex items-center gap-2 px-1">
          {searchQuery && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border text-xs font-semibold">
              <Search className="w-3 h-3 text-[#00B59C]" />
              <span>"{searchQuery}"</span>
              <button onClick={onClearSearch} className="hover:text-red-500 ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {selectedTag && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B59C]/10 text-[#008774] text-xs font-bold">
              <Hash className="w-3 h-3" />
              <span>{selectedTag}</span>
              <button onClick={onClearTag} className="hover:text-red-500 ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Show error card if fetch failed */}
      {error && <ErrorMessage message={error} onRetry={onRetry} />}

      {/* Loading skeletons for first page */}
      {isLoading && !error && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Empty feed if no posts */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-card border border-gray-100 dark:border-slate-700/60 space-y-2">
          <p className="text-3xl">📭</p>
          <h3 className="text-base font-bold">No posts found</h3>
          <p className="text-xs text-gray-500">Try changing your search or reset filters.</p>
        </div>
      )}

      {/* Posts list */}
      {!isLoading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
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

          {/* Skeletons while loading more */}
          {isLoadingMore && (
            <div className="space-y-4 pt-2">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          )}

          {/* Simple load more button fallback */}
          {hasMore && !isLoadingMore && (
            <div className="text-center pt-2">
              <button
                onClick={onLoadMore}
                className="px-5 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-[#00B59C] hover:text-[#00B59C] transition-colors"
              >
                Load More Posts
              </button>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-6 text-xs text-gray-400">
              You have reached the end of the feed.
            </div>
          )}

          {/* Bottom observer ref */}
          <div ref={bottomRef} className="h-4 w-full" />
        </div>
      )}
    </div>
  );
};
