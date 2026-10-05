import React from 'react';
import { Flame, ArrowUpRight } from 'lucide-react';

interface TrendingTopic {
  tag: string;
  category: string;
  postsCount: string;
  isHot?: boolean;
}

interface TrendingWidgetProps {
  onSelectTag: (tag: string) => void;
  selectedTag: string | null;
  onNavigateProfile?: (userId: number) => void;
}

export const TrendingWidget: React.FC<TrendingWidgetProps> = ({
  onSelectTag,
  selectedTag,
  onNavigateProfile,
}) => {
  const trendingTopics: TrendingTopic[] = [
    { tag: '#React19', category: 'Technology • Trending', postsCount: '24.5K posts', isHot: true },
    { tag: '#TailwindCSS', category: 'Web Development', postsCount: '18.2K posts' },
    { tag: '#ChirpLaunch', category: 'Design & Social', postsCount: '12.8K posts', isHot: true },
    { tag: '#DesignSystems', category: 'UI/UX Design', postsCount: '9.4K posts' },
    { tag: '#TypeScript', category: 'Programming', postsCount: '31.1K posts' },
    { tag: '#DummyJSON', category: 'APIs & Data', postsCount: '4.7K posts' },
  ];

  const suggestedUsers = [
    { id: 2, name: 'Michael Williams', handle: '@michaelw', role: 'Staff Engineer', avatar: 'https://dummyjson.com/icon/michaelw/128' },
    { id: 3, name: 'Sophia Brown', handle: '@sophiab', role: 'Frontend Specialist', avatar: 'https://dummyjson.com/icon/sophiab/128' },
    { id: 4, name: 'James Davis', handle: '@jamesd', role: 'Design Lead', avatar: 'https://dummyjson.com/icon/jamesd/128' },
  ];

  return (
    <div className="space-y-4">
      {/* Trending Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-slate-700/60 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-500">
              <Flame className="w-5 h-5 fill-orange-500/20" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Trending
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#00B59C] bg-[#00B59C]/10 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((topic) => {
            const isSelected = selectedTag === topic.tag;

            return (
              <div
                key={topic.tag}
                onClick={() => onSelectTag(topic.tag)}
                className={`group p-2.5 rounded-xl cursor-pointer transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#00B59C]/10 border border-[#00B59C]/40 text-[#00B59C]'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium block">
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#00B59C] dark:group-hover:text-[#00B59C] transition-colors">
                    {topic.tag}
                    {topic.isHot && (
                      <span className="text-xs" title="Trending fast">
                        🔥
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 block">
                    {topic.postsCount}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#00B59C] transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {selectedTag && (
          <button
            onClick={() => onSelectTag('')}
            className="w-full mt-3 text-xs text-center text-[#00B59C] hover:underline font-semibold py-1"
          >
            Clear tag filter ({selectedTag})
          </button>
        )}
      </div>

      {/* Suggested Who to Follow Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-slate-700/60">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Who to Follow
        </h4>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <div
                onClick={() => onNavigateProfile?.(user.id)}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full bg-gray-100 object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.handle}`;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate hover:underline">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{user.role}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const isFollowing = btn.textContent === 'Following';
                  btn.textContent = isFollowing ? 'Follow' : 'Following';
                  btn.className = isFollowing
                    ? 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-[#00B59C] hover:text-white transition-all'
                    : 'px-3 py-1 text-xs font-semibold rounded-full bg-[#00B59C] text-white transition-all';
                }}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-[#00B59C] hover:text-white transition-all shrink-0"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
