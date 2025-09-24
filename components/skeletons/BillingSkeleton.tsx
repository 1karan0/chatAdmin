"use client";

export default function BillingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-48 h-8 bg-zinc-700 rounded mb-2 animate-pulse"></div>
        <div className="w-64 h-4 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      {/* Current Plan Skeleton */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="w-32 h-5 bg-zinc-700 rounded mb-2"></div>
            <div className="w-48 h-4 bg-zinc-700 rounded"></div>
          </div>
          <div className="text-right">
            <div className="w-12 h-8 bg-zinc-700 rounded mb-1"></div>
            <div className="w-16 h-4 bg-zinc-700 rounded"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-2 bg-zinc-700 rounded-full"></div>
            <div className="w-20 h-4 bg-zinc-700 rounded"></div>
          </div>
          <div className="w-24 h-10 bg-zinc-700 rounded"></div>
        </div>
      </div>

      {/* Plans Skeleton */}
      <div className="mb-8">
        <div className="w-32 h-6 bg-zinc-700 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
              <div className="text-center mb-6">
                <div className="w-16 h-5 bg-zinc-700 rounded mb-2 mx-auto"></div>
                <div className="w-20 h-8 bg-zinc-700 rounded mx-auto"></div>
              </div>
              <div className="space-y-3 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-4 h-4 bg-zinc-700 rounded mr-3"></div>
                    <div className="w-32 h-4 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="w-full h-10 bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History Skeleton */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-5 bg-zinc-700 rounded"></div>
          <div className="w-24 h-8 bg-zinc-700 rounded"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-700">
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 bg-zinc-700 rounded"></div>
                <div>
                  <div className="w-48 h-4 bg-zinc-700 rounded mb-1"></div>
                  <div className="w-24 h-3 bg-zinc-700 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-4 bg-zinc-700 rounded"></div>
                <div className="w-12 h-6 bg-zinc-700 rounded"></div>
                <div className="w-8 h-8 bg-zinc-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}