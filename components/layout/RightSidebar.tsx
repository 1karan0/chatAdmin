"use client";

import { TrendingUp, MessageSquare, Sparkles, HardDrive, ExternalLink, RefreshCw } from 'lucide-react';
import { UsageStat, Activity } from '@/types';
import UsageCard from '@/components/ui/UsageCard';
import ActivityItem from '@/components/ui/ActivityItem';
import UsageCardSkeleton from '@/components/skeletons/UsageCardSkeleton';
import ActivityItemSkeleton from '@/components/skeletons/ActivityItemSkeleton';
import { useState } from 'react';

interface RightSidebarProps {
  usageStats: UsageStat[];
  activities: Activity[];
  loading?: boolean;
}

export default function RightSidebar({ usageStats, activities, loading = false }: RightSidebarProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshUsage = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="hidden xl:block w-80 bg-black border-l border-gray-700 overflow-y-auto">
      <div className="p-6">
        {/* Usage Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Usage</h3>
            <button 
              onClick={handleRefreshUsage}
              disabled={refreshing}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <UsageCardSkeleton key={index} />
              ))
            ) : (
              usageStats.map((stat, index) => (
                <UsageCard key={index} stat={stat} />
              ))
            )}
          </div>
          
          <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1 transition-colors group">
            <span>View all usages</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Recent Changes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent changes</h3>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
              {activities.length}
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <ActivityItemSkeleton key={index} />
              ))
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>
          
          {activities.length > 5 && (
            <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1 transition-colors">
              <span>View all activity</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}