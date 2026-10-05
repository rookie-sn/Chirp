export function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-slate-700/60 animate-pulse space-y-4">
      {/* Author Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-1/6" />
        </div>
      </div>

      {/* Rounded light gray Title box */}
      <div className="bg-gray-100 dark:bg-slate-700/40 rounded-xl p-3">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-3/4" />
      </div>

      {/* Rounded light gray Context box */}
      <div className="bg-gray-50 dark:bg-slate-700/20 rounded-xl p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded-md w-full" />
        <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded-md w-5/6" />
        <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded-md w-4/6" />
      </div>

      {/* Media skeleton */}
      <div className="h-44 bg-gray-200 dark:bg-slate-700 rounded-xl w-full" />

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-12" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-12" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-12" />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl animate-pulse">
      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-slate-700">
        <div className="h-36 bg-gray-200 dark:bg-slate-700" />
        <div className="px-6 pb-6 pt-0 relative">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-slate-600 border-4 border-white dark:border-slate-800 -mt-12 mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/5 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <PostSkeleton />
    </div>
  );
}
