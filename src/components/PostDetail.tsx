import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CornerDownRight,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Post, Comment, User } from '../types';
import { fetchCommentsByPost } from '../services/api';
import { CommentSkeleton } from './SkeletonLoader';
import { usePostContext } from '../context/PostContext';

interface PostDetailProps {
  post: Post;
  currentUser: User;
  onBack: () => void;
  onUserClick: (userId: number) => void;
  onLikeToggle: (postId: number) => void;
  onBookmarkToggle?: (postId: number) => void;
  onShare?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  currentUser,
  onBack,
  onUserClick,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onEdit,
  onDelete,
}) => {
  const { setEditingPost, setDeletingPost } = usePostContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingComments(true);

    fetchCommentsByPost(post.id)
      .then((data) => {
        if (isMounted) {
          setComments(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load comments:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingComments(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [post.id]);

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);

    const newComment: Comment = {
      id: Date.now(),
      body: replyText.trim(),
      postId: post.id,
      likes: 0,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      },
      createdAt: 'Just now',
      isLiked: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setReplyText('');
    setIsSubmittingReply(false);
  };

  const toggleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  const isOwner =
    post.userId === currentUser.id ||
    post.author?.id === currentUser.id ||
    post.author?.username === currentUser.username;

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : isOwner
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : `User #${post.userId}`;

  const authorHandle = post.author?.username
    ? `@${post.author.username}`
    : isOwner
    ? `@${currentUser.username}`
    : `@user_${post.userId}`;

  const authorAvatar =
    post.author?.image ||
    (isOwner
      ? currentUser.image
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || post.userId}`);

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
          Post #{post.id}
        </span>
      </div>

      {/* Main Post Card in Detail View */}
      <article className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-card border border-gray-100 dark:border-slate-700/60 space-y-4">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUserClick(post.userId)}
              className="relative shrink-0 rounded-full group focus:outline-none"
            >
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 object-cover border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`;
                }}
              />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUserClick(post.userId)}
                  className="font-bold text-base text-gray-900 dark:text-white hover:text-[#00B59C] transition-colors focus:outline-none block text-left"
                >
                  {authorName}
                </button>
                {isOwner && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#00B59C]/10 text-[#00B59C] border border-[#00B59C]/20">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{authorHandle}</span>
                <span>•</span>
                <span>{post.createdAt || 'recent'}</span>
                {post.isEdited && (
                  <>
                    <span>•</span>
                    <span className="italic">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Owner action buttons */}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => (onEdit ? onEdit(post) : setEditingPost(post))}
                  className="p-2 rounded-xl text-gray-400 hover:text-[#00B59C] dark:hover:text-[#38e8cb] hover:bg-[#00B59C]/10 transition-colors focus:outline-none"
                  title="Edit chirp"
                  aria-label="Edit chirp"
                >
                  <Pencil className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={() => (onDelete ? onDelete(post) : setDeletingPost(post))}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none"
                  title="Delete chirp"
                  aria-label="Delete chirp"
                >
                  <Trash2 className="w-5 h-5 stroke-[2.2]" />
                </button>
              </>
            )}

            <button
              onClick={() => onShare?.(post)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors"
              title="Share post"
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rounded Light Gray Title Box */}
        <div className="bg-gray-100 dark:bg-slate-700/50 rounded-xl px-4 py-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
            {post.title}
          </h1>
        </div>

        {/* Rounded Light Gray Context Box */}
        <div className="bg-gray-50 dark:bg-slate-700/25 rounded-xl p-4 sm:p-5">
          <p className="text-base sm:text-[17px] text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
            {post.body}
          </p>
        </div>

        {/* Optional Media Container */}
        {post.mediaUrl && (
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-96">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00B59C]/10 text-[#008774] dark:text-[#38e8cb]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Stats & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/60 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLikeToggle(post.id)}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-xl font-bold text-sm transition-all ${
                post.isLiked
                  ? 'text-[#00B59C] bg-[#00B59C]/10'
                  : 'hover:text-[#00B59C] hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  post.isLiked ? 'fill-[#00B59C] stroke-[#00B59C]' : 'stroke-current'
                }`}
              />
              <span>{post.reactions?.likes || 0} Likes</span>
            </button>

            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} Replies</span>
            </div>

            {post.views !== undefined && post.views > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(post.id)}
              className={`p-2 rounded-xl transition-colors ${
                post.isBookmarked
                  ? 'text-[#00B59C] bg-[#00B59C]/10'
                  : 'hover:text-[#00B59C] hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              title={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  post.isBookmarked ? 'fill-[#00B59C] stroke-[#00B59C]' : 'stroke-current'
                }`}
              />
            </button>
          )}
        </div>
      </article>

      {/* Reply Input Box */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-card border border-gray-100 dark:border-slate-700/60">
        <form onSubmit={handleAddReply} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.image}
              alt={currentUser.firstName}
              className="w-10 h-10 rounded-full bg-gray-100 object-cover shrink-0 border border-gray-200"
            />
            <div className="flex-1">
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${authorHandle}... Share your thoughts!`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B59C] focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pl-13 pt-1">
            <span className="text-xs text-gray-400">
              Be respectful and constructive
            </span>
            <button
              type="submit"
              disabled={!replyText.trim() || isSubmittingReply}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all ${
                replyText.trim() && !isSubmittingReply
                  ? 'bg-[#00B59C] hover:bg-[#009d87] text-white shadow-sm active:scale-95 cursor-pointer'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Reply</span>
              <span className="text-sm font-bold">➢</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-card border border-gray-100 dark:border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700/60">
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <span>Replies</span>
            <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </h3>
        </div>

        {isLoadingComments ? (
          <div className="space-y-3">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <CornerDownRight className="w-8 h-8 mx-auto mb-2 text-[#00B59C]/50" />
            <p className="text-sm font-semibold">No replies yet</p>
            <p className="text-xs mt-1">Be the first to share your thoughts on this chirp!</p>
          </div>
        ) : (
          <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-slate-700/40">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-3.5 first:pt-0 flex items-start gap-3">
                <button
                  onClick={() => onUserClick(comment.user.id)}
                  className="shrink-0 focus:outline-none"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.username}`}
                    alt={comment.user.fullName}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 object-cover border border-gray-200 dark:border-slate-600"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onUserClick(comment.user.id)}
                        className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white hover:text-[#00B59C] focus:outline-none"
                      >
                        {comment.user.fullName}
                      </button>
                      <span className="text-xs text-gray-400">
                        @{comment.user.username}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {comment.createdAt || 'recently'}
                      </span>
                    </div>

                    {/* Comment Like Button */}
                    <button
                      onClick={() => toggleCommentLike(comment.id)}
                      className={`flex items-center gap-1 text-xs font-semibold py-0.5 px-1.5 rounded transition-colors ${
                        comment.isLiked
                          ? 'text-[#00B59C]'
                          : 'text-gray-400 hover:text-[#00B59C]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          comment.isLiked ? 'fill-[#00B59C] stroke-[#00B59C]' : 'stroke-current'
                        }`}
                      />
                      <span>{comment.likes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 mt-1 leading-relaxed bg-gray-50 dark:bg-slate-700/30 p-2.5 rounded-xl">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
