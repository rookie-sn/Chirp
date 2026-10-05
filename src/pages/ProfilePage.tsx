import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileView } from '../components/ProfileView';
import { usePostContext } from '../context/PostContext';
import { CURRENT_USER } from '../services/api';
import type { Post } from '../types';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const numericUserId = userId ? Number(userId) : CURRENT_USER.id;

  const {
    allPosts,
    toggleLike,
    toggleBookmark,
    customPosts,
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
    <ProfileView
      userId={numericUserId}
      currentUser={CURRENT_USER}
      onBack={() => navigate(-1)}
      onPostClick={(postId) => navigate(`/post/${postId}`)}
      onUserClick={(uid) => navigate(`/profile/${uid}`)}
      onLikeToggle={toggleLike}
      onBookmarkToggle={toggleBookmark}
      onShare={handleShare}
      onTagClick={(tag) => {
        setSelectedTag(tag);
        navigate('/');
      }}
      customPosts={customPosts}
      allPosts={allPosts}
      onEdit={setEditingPost}
      onDelete={setDeletingPost}
    />
  );
};
