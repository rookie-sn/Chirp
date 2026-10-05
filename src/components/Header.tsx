import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Search, X } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onToggleDrawer: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onToggleDrawer,
  isDark,
  onToggleTheme,
  searchQuery,
  onSearchChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Posts';
    if (path.startsWith('/post/')) return 'Post';
    if (path.startsWith('/profile/')) return 'Profile';
    if (path === '/bookmarks') return 'Bookmarks';
    if (path === '/notifications') return 'Notifications';
    if (path === '/messages') return 'Messages';
    if (path === '/about') return 'About Chirp';
    if (path === '/settings') return 'Settings';
    return 'Posts';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#00B59C] text-white shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger + Chirp Bird Logo & Brand Text */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-max">
          <button
            onClick={onToggleDrawer}
            className="p-2 -ml-1 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 lg:hidden"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            title="Go to Home"
          >
            {/* Chirp Bird Icon */}
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-transform duration-200 group-hover:scale-105 shadow-inner">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white text-white drop-shadow-sm"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm">
              Chirp
            </span>
          </Link>
        </div>

        {/* Center: Title ("Posts") */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-xs">
          <h1 className="text-xl font-bold tracking-tight text-white/95">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Right Actions: Search + Dark Mode + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (location.pathname !== '/') {
                  navigate('/');
                }
              }}
              className="w-full bg-white/15 placeholder-white/70 text-white text-sm rounded-full pl-8 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/25 transition-all"
            />
            <Search className="w-4 h-4 text-white/70 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-white/80 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dark / Light Toggle Icon in Header */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-200" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Current User Pill / Avatar */}
          <Link
            to={`/profile/${currentUser.id}`}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-all border border-white/20 focus:outline-none"
            title={`Logged in as ${currentUser.firstName} ${currentUser.lastName}`}
          >
            <img
              src={currentUser.image}
              alt={currentUser.firstName}
              className="w-7 h-7 rounded-full bg-white object-cover border border-white/40"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;
              }}
            />
            <span className="hidden xl:inline text-xs font-semibold text-white max-w-[100px] truncate">
              {currentUser.firstName}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Title strip when on smaller screens */}
      <div className="sm:hidden px-4 pb-2 pt-0 flex items-center justify-between text-xs text-white/80">
        <span className="font-semibold text-white text-base">{getHeaderTitle()}</span>
        {searchQuery && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">
            Filtering by: "{searchQuery}"
          </span>
        )}
      </div>
    </header>
  );
};
