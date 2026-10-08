import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  Info,
  Settings,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  currentUser: User;
  isDark: boolean;
  onToggleTheme: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  bookmarksCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  isDark,
  onToggleTheme,
  unreadNotificationsCount = 3,
  unreadMessagesCount = 2,
  bookmarksCount = 0,
}) => {
  const location = useLocation();
  const pathname = location.pathname;

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
    <aside className="w-20 lg:w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700/60 p-3 lg:p-4.5 flex flex-col justify-between transition-all duration-200 select-none max-h-[calc(100vh-5.5rem)] overflow-y-auto">
      {/* Top Navigation Links */}
      <div className="space-y-1.5 lg:space-y-2">
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hidden lg:block">
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group relative ${isActive
                ? 'bg-[#00B59C] text-white shadow-sm shadow-[#00B59C]/20'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              title={item.label}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                />
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2 px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center leading-none ${isActive
                      ? 'bg-white text-[#00B59C]'
                      : 'bg-[#00B59C] text-white'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label for desktop */}
              <span className="hidden lg:inline text-left tracking-normal flex-1">
                {item.label}
              </span>

              {/* Active Indicator dot */}
              {isActive && (
                <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              )}
            </Link>
          );
        })}

        {/* Theme Toggle section in Sidebar */}
        <div className="pt-4 lg:pt-5 border-t border-gray-100 dark:border-slate-700/60 mt-3">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hidden lg:block mb-2">
            Theme
          </div>
          <div
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-2 lg:px-3.5 lg:py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-700/40 hover:bg-gray-100 dark:hover:bg-slate-700/70 cursor-pointer transition-colors"
            title="Toggle Light / Dark mode"
          >
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <span className="hidden lg:inline text-xs font-medium text-gray-700 dark:text-gray-300">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            {/* Custom Interactive Toggle Switch */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer hidden lg:block ${isDark ? 'bg-[#00B59C]' : 'bg-gray-300'
                }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 absolute top-1 ${isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom section: ⚙️ Settings with a gray highlight background box */}
      <div className="pt-3">
        <Link
          to="/settings"
          className={`w-full text-left p-3 lg:p-3.5 rounded-2xl transition-all duration-200 border flex items-center gap-3 ${pathname === '/settings'
            ? 'bg-[#00B59C]/10 border-[#00B59C] text-[#00B59C] dark:bg-[#00B59C]/20'
            : 'bg-gray-100 dark:bg-slate-700/60 hover:bg-gray-200/80 dark:hover:bg-slate-700 border-gray-200/60 dark:border-slate-600/60 text-gray-700 dark:text-gray-200'
            }`}
          title="Settings"
        >
          <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 text-gray-600 dark:text-gray-300">
            <Settings className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-bold leading-tight truncate">Settings</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Preferences & App</p>
          </div>
        </Link>

        {/* User Mini Profile Snippet */}
        <Link
          to={`/profile/${currentUser.id}`}
          className="mt-3 hidden lg:flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors"
          title="View profile"
        >
          <img
            src={currentUser.image}
            alt={currentUser.firstName}
            className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 object-cover border border-gray-200 dark:border-slate-600"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              @{currentUser.username}
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-[#00B59C] shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
