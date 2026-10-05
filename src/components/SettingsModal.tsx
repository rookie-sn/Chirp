import React, { useState } from 'react';
import { ArrowLeft, Settings, Moon, Sun, Bell, Trash2, CheckCircle } from 'lucide-react';
import type { User } from '../types';

interface SettingsModalProps {
  currentUser: User;
  isDark: boolean;
  onToggleTheme: () => void;
  onBack: () => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isDark,
  onToggleTheme,
  onBack,
  onClearData,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataCleared, setDataCleared] = useState(false);

  const handleClear = () => {
    onClearData();
    setDataCleared(true);
    setTimeout(() => setDataCleared(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-2 py-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs font-semibold text-gray-400">Settings & Preferences</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-slate-700/60 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-xs text-gray-500">Manage your profile and application preferences.</p>
          </div>
        </div>

        {/* Section: Appearance */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Theme</p>
                <p className="text-xs text-gray-500">Enable dark color palette for late night browsing</p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isDark ? 'bg-[#00B59C]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 absolute top-1 ${
                  isDark ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Mock Account */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Account</h3>
          <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.image}
                alt={currentUser.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-gray-500">@{currentUser.username} • ID: {currentUser.id}</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#00B59C]/10 text-[#00B59C] font-bold">
              Active Mock User
            </span>
          </div>
        </div>

        {/* Section: Notifications */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">In-App Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts when community members interact with your chirps</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsEnabled ? 'bg-[#00B59C]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 absolute top-1 ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Reset Local Storage Data */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Storage & Cache</h3>
          <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-red-600 dark:red-400">Reset Local Custom Data</p>
              <p className="text-xs text-gray-500">Clears locally saved custom posts, likes, and bookmarks</p>
            </div>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
            >
              {dataCleared ? <CheckCircle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>{dataCleared ? 'Cleared!' : 'Clear Cache'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
