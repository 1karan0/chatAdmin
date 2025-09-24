"use client";

import { useState } from 'react';
import MainContent from './components/MainContent';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { getBots } from '@/lib/api';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Fetch bots data
  const { data: bots, loading: botsLoading, error: botsError, refetch: refetchBots } = useApi(getBots);

  const handleCreateBot = () => {
    router.push('/create-bot');
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
    refetchBots();
  };

  const filteredBots = bots?.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (botsLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex overflow-hidden">
        <MainContent
          bots={filteredBots}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateBot={handleCreateBot}
          onDeleteBot={handleDeleteBot}
          onDeployBot={handleDeployBot}
          loading={botsLoading}
        />
      </div>
    </Layout>
  );
}