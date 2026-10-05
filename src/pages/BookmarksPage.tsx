import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarksView } from '../components/BookmarksView';
import { usePostContext } from '../context/PostContext';
import type { Post } from '../types';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    allPosts,
    toggleLike,
    toggleBookmark,
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
    <BookmarksView
      posts={allPosts}
      onBack={() => navigate('/')}
      onPostClick={(id) => navigate(`/post/${id}`)}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
      onLikeToggle={toggleLike}
      onBookmarkToggle={toggleBookmark}
      onShare={handleShare}
      onTagClick={(tag) => {
        setSelectedTag(tag);
        navigate('/');
      }}
      onEdit={setEditingPost}
      onDelete={setDeletingPost}
    />
  );
};
