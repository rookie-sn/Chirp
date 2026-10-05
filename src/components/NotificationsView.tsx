import React from 'react';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, Sparkles } from 'lucide-react';

interface NotificationsViewProps {
  onBack: () => void;
  onUserClick: (userId: number) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onBack,
  onUserClick,
}) => {
  const notifications = [
    {
      id: 1,
      type: 'like',
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      user: { id: 2, name: 'Michael Williams', handle: '@michaelw', avatar: 'https://dummyjson.com/icon/michaelw/128' },
      text: 'liked your chirp "Excited to share the updated Chirp design system!"',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircle,
      iconColor: 'text-[#00B59C] bg-[#00B59C]/10',
      user: { id: 3, name: 'Sophia Brown', handle: '@sophiab', avatar: 'https://dummyjson.com/icon/sophiab/128' },
      text: 'replied: "The clean teal aesthetics and typography feel incredible!"',
      time: '45m ago',
      unread: true,
    },
    {
      id: 3,
      type: 'follow',
      icon: UserPlus,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      user: { id: 4, name: 'James Davis', handle: '@jamesd', avatar: 'https://dummyjson.com/icon/jamesd/128' },
      text: 'started following you.',
      time: '2h ago',
      unread: true,
    },
    {
      id: 4,
      type: 'sparkle',
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      user: { id: 5, name: 'Emma Miller', handle: '@emmaj', avatar: 'https://dummyjson.com/icon/emmaj/128' },
      text: 'mentioned you in a discussion on #React19 and responsive web layouts.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-2 py-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00B59C]" />
            <span>Notifications</span>
          </h2>
        </div>
        <span className="text-xs font-semibold text-[#00B59C] bg-[#00B59C]/10 px-2 py-0.5 rounded-full">
          3 new
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-slate-700/60 divide-y divide-gray-100 dark:divide-slate-700/60">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                n.unread
                  ? 'bg-[#00B59C]/5 dark:bg-[#00B59C]/10'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/40'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${n.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUserClick(n.user.id)}
                    className="font-bold text-sm text-gray-900 dark:text-white hover:underline focus:outline-none"
                  >
                    {n.user.name}
                  </button>
                  <span className="text-xs text-gray-400">{n.user.handle}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{n.text}</p>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-[#00B59C] shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
