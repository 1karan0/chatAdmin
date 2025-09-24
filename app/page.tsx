"use client";

import { useState } from 'react';
import MainContent from '@/components/layout/MainContent';
import RightSidebar from '@/components/layout/RightSidebar';
import Layout from '@/components/layout/Layout';
import { Activity, UsageStat } from '@/types';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { getBots } from '@/lib/api';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  // Fetch bots data
  const { data: bots, loading: botsLoading, error: botsError, refetch: refetchBots } = useApi(getBots);
  
  // Fetch usage stats
  const { data: usageData, loading: usageLoading } = useApi(async () => {
    const response = await fetch('/api/usage');
    if (!response.ok) throw new Error('Failed to fetch usage data');
    return response.json();
  });
  
  // Fetch activities
  const { data: activitiesData, loading: activitiesLoading } = useApi(async () => {
    const response = await fetch('/api/activities?limit=10');
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  });

  const handleCreateBot = () => {
    router.push('/createbot');
  };

  const handleDeleteBot = async (botId: string) => {
    const bot = bots?.find(b => b.id === botId);
    if (!bot) return;

    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refetchBots();
      } else {
        alert('Failed to delete bot.');
      }
    } catch (error) {
      alert('Error deleting bot.');
    }
  };

  const handleDeployBot = (botId: string) => {
    // Deploy bot logic will be handled in the BotCard component
    refetchBots();
  };

  const handleLikeBot = (botId: string) => {
    // Like functionality can be implemented later
    console.log('Liked bot:', botId);
  };

  const filteredBots = bots?.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const loading = botsLoading || usageLoading || activitiesLoading;

  if (loading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <MainContent
          bots={filteredBots}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateBot={handleCreateBot}
          onDeleteBot={handleDeleteBot}
          onDeployBot={handleDeployBot}
          onLikeBot={handleLikeBot}
          loading={loading}
        />

        {/* Right sidebar */}
        {/* <RightSidebar
          usageStats={usageData?.usageStats || []}
          activities={activitiesData?.activities || []}
        /> */}
      </div>
    </Layout>
  );
}