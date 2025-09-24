"use client";

export default function IntegrationsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-32 h-8 bg-zinc-700 rounded mb-2 animate-pulse"></div>
        <div className="w-64 h-4 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      {/* Categories Skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-20 h-8 bg-zinc-700 rounded-full animate-pulse"></div>
        ))}
      </div>

      {/* Integrations Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 bg-zinc-700 rounded"></div>
              <div className="w-16 h-6 bg-zinc-700 rounded-full"></div>
            </div>
            
            <div className="w-24 h-5 bg-zinc-700 rounded mb-2"></div>
            <div className="w-full h-4 bg-zinc-700 rounded mb-4"></div>
            
            <div className="flex items-center justify-between">
              <div className="w-20 h-6 bg-zinc-700 rounded"></div>
              <div className="w-16 h-8 bg-zinc-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Integration Skeleton */}
      <div className="mt-12 bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center animate-pulse">
        <div className="w-12 h-12 bg-zinc-700 rounded mx-auto mb-4"></div>
        <div className="w-48 h-6 bg-zinc-700 rounded mb-2 mx-auto"></div>
        <div className="w-64 h-4 bg-zinc-700 rounded mb-6 mx-auto"></div>
        <div className="w-32 h-10 bg-zinc-700 rounded mx-auto"></div>
      </div>
    </div>
  );
}