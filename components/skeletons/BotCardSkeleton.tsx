"use client";

export default function BotCardSkeleton() {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-zinc-700 rounded-lg"></div>
        <div className="w-16 h-6 bg-zinc-700 rounded-full"></div>
      </div>
      
      <div className="mb-4">
        <div className="w-3/4 h-5 bg-zinc-700 rounded mb-2"></div>
        <div className="w-full h-4 bg-zinc-700 rounded mb-1"></div>
        <div className="w-2/3 h-4 bg-zinc-700 rounded"></div>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex space-x-4">
          <div className="w-12 h-4 bg-zinc-700 rounded"></div>
          <div className="w-12 h-4 bg-zinc-700 rounded"></div>
        </div>
        <div className="w-16 h-4 bg-zinc-700 rounded"></div>
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-1 h-8 bg-zinc-700 rounded"></div>
        <div className="w-8 h-8 bg-zinc-700 rounded"></div>
        <div className="w-8 h-8 bg-zinc-700 rounded"></div>
      </div>
    </div>
  );
}