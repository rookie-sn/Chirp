import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from '../components/SettingsModal';
import { useTheme } from '../hooks/useTheme';
import { usePostContext } from '../context/PostContext';
import { CURRENT_USER } from '../services/api';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = usePostContext();

  const handleClearData = () => {
    localStorage.removeItem('chirp_user_posts');
    localStorage.removeItem('chirp_custom_posts');
    localStorage.removeItem('chirp_deleted_posts');
    localStorage.removeItem('chirp_edited_posts');
    localStorage.removeItem('chirp_likes');
    localStorage.removeItem('chirp_bookmarks');
    localStorage.removeItem('chirp_liked_posts');
    localStorage.removeItem('chirp_bookmarked_posts');
    showToast('Local custom posts and cache reset.', 'info');
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  };

  return (
    <SettingsModal
      currentUser={CURRENT_USER}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onBack={() => navigate('/')}
      onClearData={handleClearData}
    />
  );
};
