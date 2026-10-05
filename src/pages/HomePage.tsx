import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedView } from '../components/FeedView';
import { usePostContext } from '../context/PostContext';
import { CURRENT_USER } from '../services/api';
import type { Post } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    activeTab,
    setActiveTab,
    loadMorePosts,
    retry,
    toggleLike,
    toggleBookmark,
    createPost,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    setEditingPost,
    setDeletingPost,
    showToast,
  } = usePostContext();

  const handleShare = (post: Post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      showToast('Link copied to clipboard! 📋', 'info');
    } else {
      showToast(`Shared post "${post.title.slice(0, 20)}..."`, 'info');
    }
  };

  return (
    <FeedView
      posts={posts}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      hasMore={hasMore}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLoadMore={loadMorePosts}
      onRetry={retry}
      onPostClick={(id) => navigate(`/post/${id}`)}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
      onLikeToggle={toggleLike}
      onBookmarkToggle={toggleBookmark}
      onShare={handleShare}
      onTagClick={(tag) => setSelectedTag(tag)}
      searchQuery={searchQuery}
      onClearSearch={() => setSearchQuery('')}
      selectedTag={selectedTag}
      onClearTag={() => setSelectedTag(null)}
      currentUser={CURRENT_USER}
      onPostCreated={createPost}
      onEdit={setEditingPost}
      onDelete={setDeletingPost}
    />
  );
};
