import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  Info,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import type { User } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  isDark: boolean;
  onToggleTheme: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  bookmarksCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  isDark,
  onToggleTheme,
  unreadNotificationsCount = 3,
  unreadMessagesCount = 2,
  bookmarksCount = 0,
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  if (!isOpen) return null;

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      badge: null,
      isActive: pathname === '/',
    },
    {
      to: '/notifications',
      label: 'Notification',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      isActive: pathname === '/notifications',
    },
    {
      to: '/messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      isActive: pathname === '/messages',
    },
    {
      to: '/bookmarks',
      label: 'Bookmarks',
      icon: Bookmark,
      badge: bookmarksCount > 0 ? bookmarksCount : null,
      isActive: pathname === '/bookmarks',
    },
    {
      to: `/profile/${currentUser.id}`,
      label: 'Profile',
      icon: UserIcon,
      badge: null,
      isActive: pathname.startsWith('/profile'),
    },
    {
      to: '/about',
      label: 'About',
      icon: Info,
      badge: null,
      isActive: pathname === '/about',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col justify-between p-5 z-50 transform transition-transform duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00B59C] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-gray-900 dark:text-white">
                Chirp
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <Link
            to={`/profile/${currentUser.id}`}
            onClick={onClose}
            className="flex items-center gap-3 my-4 p-3 bg-gray-50 dark:bg-slate-700/40 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors"
          >
            <img
              src={currentUser.image}
              alt={currentUser.firstName}
              className="w-11 h-11 rounded-full bg-white object-cover border border-[#00B59C]/30"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {currentUser.firstName} {currentUser.lastName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{currentUser.username}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-[#00B59C] text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-[#00B59C]'
                          : 'bg-[#00B59C] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-3">
          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-700/40 text-gray-700 dark:text-gray-200 text-sm font-semibold"
          >
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full relative transition-colors ${
                isDark ? 'bg-[#00B59C]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 absolute top-1 ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </button>

          {/* Settings Button */}
          <Link
            to="/settings"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-700/60 text-gray-800 dark:text-gray-100 font-semibold text-sm hover:bg-gray-200/70 dark:hover:bg-slate-700"
          >
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
