export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  image: string;
  bio?: string;
  company?: {
    name: string;
    title: string;
    department?: string;
  };
  address?: {
    city: string;
    state?: string;
    country?: string;
  };
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface Reactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Reactions;
  views: number;
  userId: number;
  createdAt?: string;
  mediaUrl?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isEdited?: boolean;
  author?: User;
  commentsCount?: number;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
  createdAt?: string;
  isLiked?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export type ViewType = 'feed' | 'post-detail' | 'profile' | 'bookmarks' | 'notifications' | 'messages' | 'about' | 'settings';

export type FeedTab = 'following' | 'suggested';
