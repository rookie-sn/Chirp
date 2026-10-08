import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { ComposeBox } from './ComposeBox';
import { TrendingWidget } from './TrendingWidget';
import { MobileFab } from './MobileFab';
import { Toast } from './Toast';
import { EditPostModal } from './EditPostModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useTheme } from '../hooks/useTheme';
import { usePostContext } from '../context/PostContext';
import { CURRENT_USER } from '../services/api';

export const Layout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    createPost,
    updatePost,
    deletePost,
    editingPost,
    setEditingPost,
    deletingPost,
    setDeletingPost,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    bookmarkedPostIds,
    toasts,
    dismissToast,
  } = usePostContext();

  const handlePostCreated = (title: string, body: string, mediaUrl?: string, tags?: string[]) => {
    createPost(title, body, mediaUrl, tags);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleDeleteConfirm = (postId: number) => {
    deletePost(postId);
    if (location.pathname === `/post/${postId}`) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      {/* 1. Top Teal Header Bar (#00B59C) */}
      <Header
        currentUser={CURRENT_USER}
        onToggleDrawer={() => setIsDrawerOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={CURRENT_USER}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        bookmarksCount={bookmarkedPostIds.size}
      />

      {/* Main 3-Column Layout Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[240px_1fr_340px] xl:grid-cols-[260px_1fr_360px] gap-4 sm:gap-6 items-start">
          {/* Column 1: Left Navigation Sidebar (Fixed Menu Card, does not scroll down) */}
          <div className="hidden md:block sticky top-20 self-start z-30">
            <Sidebar
              currentUser={CURRENT_USER}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              bookmarksCount={bookmarkedPostIds.size}
            />
          </div>

          {/* Column 2: Middle Column (Feed / PostDetail / Profile - scrolls) */}
          <main className="min-w-0 w-full space-y-4">
            <Outlet />
          </main>

          {/* Column 3: Right Sidebar (Sticky in place, does not scroll away with feed) */}
          <aside className="hidden lg:block sticky top-20 self-start z-20 space-y-5 max-h-[calc(100vh-5.5rem)] overflow-y-auto pr-1">
            {/* Top Widget: "Share What You Are Feeling! 😁" */}
            <ComposeBox
              currentUser={CURRENT_USER}
              onPostCreated={handlePostCreated}
            />

            {/* Bottom Widget: "Trending" card containing topic discussions */}
            <TrendingWidget
              onSelectTag={handleTagSelect}
              selectedTag={selectedTag}
              onNavigateProfile={(userId) => navigate(`/profile/${userId}`)}
            />
          </aside>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <MobileFab
        currentUser={CURRENT_USER}
        onPostCreated={handlePostCreated}
      />

      {/* Edit Chirp Modal */}
      <EditPostModal
        post={editingPost}
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        onSave={updatePost}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        post={deletingPost}
        isOpen={Boolean(deletingPost)}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Floating Action Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
