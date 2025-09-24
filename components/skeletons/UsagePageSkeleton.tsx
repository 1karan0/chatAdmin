"use client";

export default function UsagePageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="w-48 h-8 bg-zinc-700 rounded mb-2 animate-pulse"></div>
          <div className="w-64 h-4 bg-zinc-700 rounded animate-pulse"></div>
        </div>
        <div className="w-32 h-10 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      {/* Usage Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-20 h-4 bg-zinc-700 rounded"></div>
              <div className="w-4 h-4 bg-zinc-700 rounded"></div>
            </div>
            <div className="mb-4">
              <div className="w-16 h-8 bg-zinc-700 rounded mb-1"></div>
              <div className="w-24 h-4 bg-zinc-700 rounded"></div>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2"></div>
            <div className="w-20 h-3 bg-zinc-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="w-32 h-5 bg-zinc-700 rounded"></div>
              <div className="w-5 h-5 bg-zinc-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="w-8 h-4 bg-zinc-700 rounded"></div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-zinc-700 rounded-full h-2"></div>
                  </div>
                  <div className="w-12 h-4 bg-zinc-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Skeleton */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
        <div className="w-32 h-5 bg-zinc-700 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-8 bg-zinc-700 rounded mb-1 mx-auto"></div>
              <div className="w-24 h-4 bg-zinc-700 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}