"use client";

import BotCardSkeleton from './BotCardSkeleton';

export default function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Workspace Profile Skeleton */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-20 h-20 bg-zinc-700 rounded-xl animate-pulse"></div>
          <div>
            <div className="w-48 h-6 bg-zinc-700 rounded mb-2 animate-pulse"></div>
            <div className="w-64 h-4 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Search and Create Button Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-32 h-6 bg-zinc-700 rounded animate-pulse"></div>
        <div className="w-24 h-10 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 h-12 bg-zinc-700 rounded-lg animate-pulse"></div>
        <div className="w-20 h-12 bg-zinc-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Bot Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <BotCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}