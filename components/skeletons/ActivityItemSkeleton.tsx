"use client";

export default function ActivityItemSkeleton() {
  return (
    <div className="flex items-start space-x-3 animate-pulse">
      <div className="w-8 h-8 bg-zinc-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="w-full h-4 bg-zinc-700 rounded mb-1"></div>
        <div className="w-3/4 h-4 bg-zinc-700 rounded mb-2"></div>
        <div className="w-16 h-3 bg-zinc-700 rounded"></div>
      </div>
    </div>
  );
}