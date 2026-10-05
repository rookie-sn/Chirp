import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostDetail } from '../components/PostDetail';
import { PostSkeleton } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { usePostContext } from '../context/PostContext';
import { fetchPostById, CURRENT_USER } from '../services/api';
import type { Post } from '../types';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const { allPosts, toggleLike, toggleBookmark, setEditingPost, setDeletingPost, showToast } = usePostContext();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId) {
      setError('Invalid post ID.');
      setIsLoading(false);
      return;
    }

    // Check if post already exists in context memory
    const existing = allPosts.find((p) => p.id === numericId);
    if (existing) {
      setPost(existing);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch post by ID using plain useState/useEffect
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchPostById(numericId)
      .then((data) => {
        if (isMounted) {
          setPost(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load post.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [numericId, allPosts]);

  const handleShare = (p: Post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${p.id}`);
      showToast('Link copied to clipboard! 📋', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <ErrorMessage
        message={error || 'The requested post could not be found.'}
        onRetry={() => navigate('/')}
      />
    );
  }

  return (
    <PostDetail
      post={post}
      currentUser={CURRENT_USER}
      onBack={() => navigate(-1)}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
      onLikeToggle={toggleLike}
      onBookmarkToggle={toggleBookmark}
      onShare={handleShare}
      onEdit={setEditingPost}
      onDelete={setDeletingPost}
    />
  );
};
