"use client";

export default function SettingsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-32 h-8 bg-zinc-700 rounded mb-2 animate-pulse"></div>
        <div className="w-64 h-4 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-full h-10 bg-zinc-700 rounded-md animate-pulse"></div>
            ))}
          </nav>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-zinc-700 rounded-full"></div>
                <div>
                  <div className="w-24 h-8 bg-zinc-700 rounded mb-1"></div>
                  <div className="w-32 h-3 bg-zinc-700 rounded"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="w-20 h-4 bg-zinc-700 rounded mb-2"></div>
                  <div className="w-full h-10 bg-zinc-700 rounded"></div>
                </div>
                <div>
                  <div className="w-16 h-4 bg-zinc-700 rounded mb-2"></div>
                  <div className="w-full h-10 bg-zinc-700 rounded"></div>
                </div>
              </div>
              
              <div>
                <div className="w-32 h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="w-full h-10 bg-zinc-700 rounded"></div>
              </div>
              
              <div>
                <div className="w-8 h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="w-full h-24 bg-zinc-700 rounded"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-700">
              <div className="w-32 h-10 bg-zinc-700 rounded"></div>
              <div className="w-28 h-10 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}