import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Mail,
  UserCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import type { User, Post } from '../types';
import { fetchUserById, fetchPostsByUser } from '../services/api';
import { PostCard } from './PostCard';
import { ProfileSkeleton } from './SkeletonLoader';

interface ProfileViewProps {
  userId: number;
  currentUser: User;
  onBack: () => void;
  onPostClick: (postId: number) => void;
  onUserClick: (userId: number) => void;
  onLikeToggle: (postId: number) => void;
  onBookmarkToggle?: (postId: number) => void;
  onShare?: (post: Post) => void;
  onTagClick?: (tag: string) => void;
  customPosts?: Post[];
  allPosts?: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userId,
  currentUser,
  onBack,
  onPostClick,
  onUserClick,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onTagClick,
  customPosts = [],
  allPosts = [],
  onEdit,
  onDelete,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'about'>('posts');

  const isCurrentUser = userId === currentUser.id;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const deletedSaved = localStorage.getItem('chirp_deleted_posts');
    const deletedIds = deletedSaved ? new Set(JSON.parse(deletedSaved)) : new Set<number>();
    const editsSaved = localStorage.getItem('chirp_edited_posts');
    const editsMap: Record<number, Partial<Post>> = editsSaved ? JSON.parse(editsSaved) : {};

    Promise.all([
      fetchUserById(userId),
      fetchPostsByUser(userId).catch(() => []),
    ])
      .then(([userData, postsData]) => {
        if (isMounted) {
          setUser(userData);
          const sanitizedApiPosts = postsData
            .filter((p) => !deletedIds.has(p.id))
            .map((p) => ({
              ...p,
              ...(editsMap[p.id] || {}),
            }));

          if (userId === currentUser.id) {
            const userCustomPosts = customPosts
              .filter((p) => (p.userId === currentUser.id || p.author?.id === currentUser.id) && !deletedIds.has(p.id))
              .map((p) => ({
                ...p,
                ...(editsMap[p.id] || {}),
              }));
            setUserPosts([...userCustomPosts, ...sanitizedApiPosts]);
          } else {
            setUserPosts(sanitizedApiPosts);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId, currentUser.id, customPosts, allPosts]);

  if (isLoading || !user) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  const displayName = `${user.firstName} ${user.lastName}`;
  const displayHandle = `@${user.username}`;
  const displayAvatar =
    user.image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.id}`;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C] dark:hover:text-[#00B59C] hover:bg-[#00B59C]/10 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Feed</span>
        </button>

        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
          {userPosts.length} {userPosts.length === 1 ? 'Chirp' : 'Chirps'}
        </span>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-slate-700/60">
        {/* Banner Cover with Teal Gradient */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-[#00B59C] via-[#008774] to-[#0f766e] relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        </div>

        {/* Profile Main Content */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          {/* Avatar & Action Button Row */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
              }}
            />

            <div>
              {isCurrentUser ? (
                <div className="px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-700/50">
                  Logged in User
                </div>
              ) : (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600'
                      : 'bg-[#00B59C] hover:bg-[#009d87] text-white active:scale-95'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-[#00B59C]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Name & Handle */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              {isCurrentUser && (
                <span className="p-1 rounded-full bg-[#00B59C]/10 text-[#00B59C]">
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {displayHandle}
            </p>
          </div>

          {/* User Bio */}
          {user.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-3 leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}

          {/* Meta Details: Company, Location, Email */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#00B59C]" />
                <span>
                  {user.company.title} at {user.company.name}
                </span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00B59C]" />
                <span>
                  {user.address.city}
                  {user.address.state ? `, ${user.address.state}` : ''}
                </span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#00B59C]" />
                <span>{user.email}</span>
              </div>
            )}
          </div>

          {/* Followers & Following Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                {user.followingCount || 382}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Following
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                {(user.followersCount || 1420) + (isFollowing ? 1 : 0)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Followers
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                {userPosts.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Chirps
              </span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-gray-100 dark:border-slate-700/60 bg-gray-50/60 dark:bg-slate-800/80 px-6">
          <button
            onClick={() => setActiveProfileTab('posts')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeProfileTab === 'posts'
                ? 'border-[#00B59C] text-[#00B59C]'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Chirps ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveProfileTab('about')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeProfileTab === 'about'
                ? 'border-[#00B59C] text-[#00B59C]'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeProfileTab === 'posts' ? (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-card border border-gray-100 dark:border-slate-700/60">
              <p className="text-gray-500 font-semibold text-sm">
                No chirps posted by {user.firstName} yet.
              </p>
            </div>
          ) : (
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, author: user }}
                onPostClick={onPostClick}
                onUserClick={onUserClick}
                onLikeToggle={onLikeToggle}
                onBookmarkToggle={onBookmarkToggle}
                onShare={onShare}
                onTagClick={onTagClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-slate-700/60 space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Detailed Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Full Name</span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Username</span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                @{user.username}
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Company & Title</span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {user.company?.title || 'Contributor'} • {user.company?.name || 'Community'}
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Location</span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {user.address?.city || 'San Francisco'}, {user.address?.state || 'CA'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
