import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Post, FeedTab } from '../types';
import { getPosts, CURRENT_USER } from '../services/api';
import type { ToastMessage } from '../components/Toast';

interface PostContextType {
  posts: Post[];
  allPosts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  activeTab: FeedTab;
  setActiveTab: (tab: FeedTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  loadMorePosts: () => void;
  retry: () => void;
  toggleLike: (postId: number) => void;
  toggleBookmark: (postId: number) => void;
  createPost: (title: string, body: string, mediaUrl?: string, tags?: string[]) => Post;
  updatePost: (
    postId: number,
    updates: { title: string; body: string; mediaUrl?: string; tags?: string[] }
  ) => void;
  deletePost: (postId: number) => void;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  deletingPost: Post | null;
  setDeletingPost: (post: Post | null) => void;
  customPosts: Post[];
  bookmarkedPostIds: Set<number>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Main states
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab & search states
  const [activeTab, setActiveTab] = useState<FeedTab>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modal states for editing and deleting
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simple toast message helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Saved user custom posts in localStorage
  const [customPosts, setCustomPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('chirp_user_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Track deleted post IDs
  const [deletedPostIds, setDeletedPostIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('chirp_deleted_posts');
    return saved ? new Set(JSON.parse(saved)) : new Set<number>();
  });

  // Track edited posts map: { [postId]: Partial<Post> }
  const [editedPosts, setEditedPosts] = useState<Record<number, Partial<Post>>>(() => {
    const saved = localStorage.getItem('chirp_edited_posts');
    return saved ? JSON.parse(saved) : {};
  });

  // Track liked and bookmarked ids
  const [likedPostIds, setLikedPostIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('chirp_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set<number>();
  });

  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('chirp_bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set<number>();
  });

  // Fetch initial posts on page load using basic useEffect
  const loadInitialPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPosts(10, 0);
      setTotalPosts(data.total);
      setSkip(10);

      // Merge any posts user created with api posts
      const merged = [...customPosts, ...data.posts];

      // Update liked and bookmarked status, apply edits, and filter out deleted posts
      const updated = merged
        .filter((p) => !deletedPostIds.has(p.id))
        .map((p) => {
          const edit = editedPosts[p.id];
          const isUser = p.userId === CURRENT_USER.id || p.author?.id === CURRENT_USER.id;
          return {
            ...p,
            ...(edit || {}),
            author: isUser && !p.author ? CURRENT_USER : p.author,
            isLiked: likedPostIds.has(p.id),
            isBookmarked: bookmarkedPostIds.has(p.id),
          };
        });

      setPosts(updated);
    } catch (err) {
      console.log('Error loading posts:', err);
      setError('Could not load posts. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Load more posts for infinite scrolling
  const loadMorePosts = async () => {
    if (isLoadingMore || isLoading) return;
    if (posts.length >= totalPosts) return;

    setIsLoadingMore(true);

    try {
      const data = await getPosts(10, skip);
      setSkip((prev) => prev + 10);

      const newPosts = data.posts
        .filter((p) => !deletedPostIds.has(p.id))
        .map((p) => {
          const edit = editedPosts[p.id];
          const isUser = p.userId === CURRENT_USER.id || p.author?.id === CURRENT_USER.id;
          return {
            ...p,
            ...(edit || {}),
            author: isUser && !p.author ? CURRENT_USER : p.author,
            isLiked: likedPostIds.has(p.id),
            isBookmarked: bookmarkedPostIds.has(p.id),
          };
        });

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (err) {
      console.log('Failed to load more posts:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Like / Unlike post
  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          const newLikes = newLiked ? post.reactions.likes + 1 : Math.max(0, post.reactions.likes - 1);
          return {
            ...post,
            isLiked: newLiked,
            reactions: { ...post.reactions, likes: newLikes },
          };
        }
        return post;
      })
    );

    // Save to set
    setLikedPostIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(postId)) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      localStorage.setItem('chirp_likes', JSON.stringify([...updated]));
      return updated;
    });
  };

  // Bookmark / Unbookmark post
  const toggleBookmark = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      })
    );

    setBookmarkedPostIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(postId)) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      localStorage.setItem('chirp_bookmarks', JSON.stringify([...updated]));
      return updated;
    });
  };

  // Create a new post
  const createPost = (title: string, body: string, mediaUrl?: string, tags = ['chirp']) => {
    const newPost: Post = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      tags: tags,
      reactions: { likes: 0, dislikes: 0 },
      views: 1,
      userId: CURRENT_USER.id,
      createdAt: 'Just now',
      mediaUrl: mediaUrl,
      isLiked: false,
      isBookmarked: false,
      author: CURRENT_USER,
      commentsCount: 0,
    };

    // Add to top of feed
    setPosts((prev) => [newPost, ...prev]);

    // Save locally
    setCustomPosts((prev) => {
      const updated = [newPost, ...prev];
      localStorage.setItem('chirp_user_posts', JSON.stringify(updated));
      return updated;
    });

    showToast('Your chirp was posted! 🎉', 'success');
    return newPost;
  };

  // Update an existing post
  const updatePost = (
    postId: number,
    updates: { title: string; body: string; mediaUrl?: string; tags?: string[] }
  ) => {
    const editPayload = {
      title: updates.title.trim(),
      body: updates.body.trim(),
      mediaUrl: updates.mediaUrl,
      tags: updates.tags && updates.tags.length > 0 ? updates.tags : ['chirp'],
      isEdited: true,
    };

    // 1. Update posts in state
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            ...editPayload,
          };
        }
        return post;
      })
    );

    // 2. Update customPosts if it was a user created post
    setCustomPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            ...editPayload,
          };
        }
        return post;
      });
      localStorage.setItem('chirp_user_posts', JSON.stringify(updated));
      return updated;
    });

    // 3. Save to edited posts in localStorage
    setEditedPosts((prev) => {
      const updated = {
        ...prev,
        [postId]: editPayload,
      };
      localStorage.setItem('chirp_edited_posts', JSON.stringify(updated));
      return updated;
    });

    setEditingPost(null);
    showToast('Your chirp was updated! ✨', 'success');
  };

  // Delete a post
  const deletePost = (postId: number) => {
    // 1. Remove from in-memory posts
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    // 2. Remove from customPosts
    setCustomPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      localStorage.setItem('chirp_user_posts', JSON.stringify(updated));
      return updated;
    });

    // 3. Save to deleted IDs
    setDeletedPostIds((prev) => {
      const updated = new Set(prev);
      updated.add(postId);
      localStorage.setItem('chirp_deleted_posts', JSON.stringify([...updated]));
      return updated;
    });

    // 4. Remove from bookmarks if present
    setBookmarkedPostIds((prev) => {
      if (prev.has(postId)) {
        const updated = new Set(prev);
        updated.delete(postId);
        localStorage.setItem('chirp_bookmarks', JSON.stringify([...updated]));
        return updated;
      }
      return prev;
    });

    setDeletingPost(null);
    showToast('Your chirp was deleted.', 'info');
  };

  // Simple filter for search and tags
  const filteredPosts = posts.filter((post) => {
    // If there is search text
    if (searchQuery.trim() !== '') {
      const text = searchQuery.toLowerCase();
      const inTitle = post.title.toLowerCase().includes(text);
      const inBody = post.body.toLowerCase().includes(text);
      const inTags = post.tags.some((t) => t.toLowerCase().includes(text));
      if (!inTitle && !inBody && !inTags) return false;
    }

    // If tag is clicked
    if (selectedTag) {
      const cleanTag = selectedTag.replace('#', '').toLowerCase();
      const hasTag = post.tags.some((t) => t.toLowerCase() === cleanTag);
      if (!hasTag) return false;
    }

    // Filter by tab: Following vs Suggested
    if (activeTab === 'following') {
      return true;
    } else {
      return post.reactions.likes > 40;
    }
  });

  const hasMore = posts.length < totalPosts;

  return (
    <PostContext.Provider
      value={{
        posts: filteredPosts,
        allPosts: posts,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        loadMorePosts,
        retry: loadInitialPosts,
        toggleLike,
        toggleBookmark,
        createPost,
        updatePost,
        deletePost,
        editingPost,
        setEditingPost,
        deletingPost,
        setDeletingPost,
        customPosts,
        bookmarkedPostIds,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export function usePostContext() {
  const ctx = useContext(PostContext);
  if (!ctx) {
    throw new Error('usePostContext must be used within PostProvider');
  }
  return ctx;
}
