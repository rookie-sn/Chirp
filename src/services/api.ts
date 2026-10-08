import type { Post, User, Comment } from '../types';

// Hardcoded logged-in user (Siva N)
export const CURRENT_USER: User = {
  id: 1,
  firstName: 'Siva',
  lastName: 'N',
  username: 'Siva.n',
  email: 'Siva.n@chirp.io',
  image: 'https://dummyjson.com/icon/emilys/128',
  bio: 'Product Designer at Chirp. Love clean UI and React!',
  company: {
    name: 'Chirp Inc.',
    title: 'Lead Product Designer',
  },
  address: {
    city: 'coimbatore',
    state: 'coimbatore',
  },
  followersCount: 1420,
  followingCount: 380,
  postsCount: 24,
};

// Simple helper to fetch posts from DummyJSON
export async function getPosts(limit = 10, skip = 0) {
  const res = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();

  // Format posts to make them easy to use in our components
  const formattedPosts: Post[] = data.posts.map((p: any) => {
    // DummyJSON has reactions as { likes, dislikes } or number
    let likes = 0;
    if (typeof p.reactions === 'number') {
      likes = p.reactions;
    } else if (p.reactions && typeof p.reactions.likes === 'number') {
      likes = p.reactions.likes;
    }

    return {
      id: p.id,
      title: p.title,
      body: p.body,
      tags: p.tags || ['chirp'],
      reactions: { likes, dislikes: 0 },
      views: p.views || 100,
      userId: p.userId,
      createdAt: `${(p.id * 3) % 24 + 1}h ago`,
      isLiked: false,
      isBookmarked: false,
      commentsCount: (p.id % 6) + 2,
    };
  });

  return {
    posts: formattedPosts,
    total: data.total,
  };
}

// Simple helper to fetch single post
export async function getPostById(id: number) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  if (!res.ok) {
    throw new Error('Post not found');
  }
  const p = await res.json();

  let likes = 0;
  if (typeof p.reactions === 'number') {
    likes = p.reactions;
  } else if (p.reactions && typeof p.reactions.likes === 'number') {
    likes = p.reactions.likes;
  }
  // new post after creation
  return {
    id: p.id,
    title: p.title,
    body: p.body,
    tags: p.tags || ['chirp', 'New'],
    reactions: { likes: 1, dislikes: 0 },
    views: p.views || 100,
    userId: p.userId,
    createdAt: `${(p.id * 3) % 24 + 1}h ago`,
    isLiked: false,
    isBookmarked: false,
    commentsCount: (p.id % 6) + 2,
  };
}

// Simple helper to fetch a user
export async function getUserById(userId: number) {
  try {
    const res = await fetch(`https://dummyjson.com/users/${userId}`);
    if (!res.ok) throw new Error('User not found');
    const u = await res.json();
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      image: u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
      bio: `Hello! I am ${u.firstName} and I work as a ${u.company?.title || 'developer'}.`,
      company: u.company,
      address: u.address,
      followersCount: 200 + u.id * 15,
      followingCount: 150 + u.id * 8,
      postsCount: 10 + (u.id % 12),
    };
  } catch {
    // If error, return basic fallback user
    return {
      id: userId,
      firstName: 'User',
      lastName: `${userId}`,
      username: `user_${userId}`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      bio: 'Chirp community member.',
      followersCount: 100,
      followingCount: 50,
      postsCount: 5,
    };
  }
}

// Simple helper to fetch comments for a post
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  try {
    const res = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.comments.map((c: any, index: number) => ({
      id: c.id,
      body: c.body,
      postId: c.postId,
      likes: c.likes || 0,
      user: {
        id: c.user?.id || 1,
        username: c.user?.username || 'user',
        fullName: c.user?.fullName || 'Anonymous',
      },
      createdAt: `${(index + 1) * 20}m ago`,
      isLiked: false,
    }));
  } catch {
    return [];
  }
}

// Simple helper to fetch posts by a specific user
export async function getPostsByUserId(userId: number): Promise<Post[]> {
  const res = await fetch(`https://dummyjson.com/posts/user/${userId}`);
  if (!res.ok) return [];
  const data = await res.json();

  return data.posts.map((p: any) => {
    let likes = 0;
    if (typeof p.reactions === 'number') {
      likes = p.reactions;
    } else if (p.reactions && typeof p.reactions.likes === 'number') {
      likes = p.reactions.likes;
    }

    return {
      id: p.id,
      title: p.title,
      body: p.body,
      tags: p.tags || ['chirp'],
      reactions: { likes, dislikes: 0 },
      views: p.views || 50,
      userId: p.userId,
      createdAt: '1d ago',
      isLiked: false,
      isBookmarked: false,
      commentsCount: 2,
    };
  });
}

// Simple export aliases
export const fetchPosts = getPosts;
export const fetchPostById = getPostById;
export const fetchUserById = getUserById;
export const fetchCommentsByPost = getCommentsByPostId;
export const fetchPostsByUser = getPostsByUserId;

