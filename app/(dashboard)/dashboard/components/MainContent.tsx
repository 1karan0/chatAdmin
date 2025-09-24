"use client";

import { Search, Plus, Clock, Zap, Filter } from 'lucide-react';
import { Bot } from '@/types';
import BotCard from './BotCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/components/Avatar';
import { useRouter } from 'next/navigation';
import { DiAptana } from "react-icons/di";

interface MainContentProps {
  bots: Bot[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateBot: () => void;
  onDeleteBot: (botId: string) => void;
  onDeployBot: (botId: string) => void;
  onLikeBot: (botId: string) => void;
  loading: boolean;
}

export default function MainContent({
  bots,
  searchQuery,
  onSearchChange,
  onCreateBot,
  onDeleteBot,
  onDeployBot,
  onLikeBot,
  loading
}: MainContentProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center justify-center">
              <Avatar className="w-20 h-20 rounded-xl">
                <AvatarImage
                  src={session?.user?.image || ''}
                  alt={session?.user?.name || 'User'}
                />
                <AvatarFallback className="bg-blue-600 text-white">
                  {session?.user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{session?.user?.name}'s Workspace</h1>
              <p className="text-zinc-400 text-xs">
                Workspace profile not set.
                <p className='text-xs'>
                  To edit go to <span className="text-blue-400 ml-1 cursor-pointer" onClick={() => router.push('/settings')}>settings</span>
                </p>
              </p>
            </div>
          </div>
        </div>

        {/* Recent Section */}
        {bots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">Recent</h2>
            </div>

            <div className="space-y-3">
              {bots.slice(0, 3).map((bot) => (
                <div key={bot.id} className="bg-black rounded-lg border border-zinc-700 p-4 hover:bg-zinc-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{bot.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-zinc-400">
                          <span className="flex items-center space-x-1">
                            <span>{bot.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{bot.likes} likes</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bot.status === 'DEPLOYED'
                        ? 'bg-green-900 text-green-300'
                        : bot.status === 'DRAFT'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-blue-900 text-blue-300'
                        }`}>
                        {bot.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bots Section */}
        <div>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative bg-black flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Find a bot"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 bg-black border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Bot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onDelete={onDeleteBot}
                onDeploy={onDeployBot}
                onLike={onLikeBot}
              />
            ))}

            {/* Create Bot Card */}
            {bots.length > 0 && (
              <div
                onClick={onCreateBot}
                className="border-2 border-dashed border-zinc-800 rounded-lg p-8 flex items-center justify-center gap-2 hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <Plus className="w-3 h-3 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-zinc-400 font-sm text-xs group-hover:text-blue-500 transition-colors">Create Bot</span>
              </div>
            )}
          </div>

          {bots.length === 0 && (
            <div>
              <div className='w-full h-[300px] rounded-xl border flex items-center justify-center '>
                <div className='text-center items-center flex flex-col gap-5'>
                  <DiAptana className='text-7xl text-green-500 animate-slow-spin' />
                  <h1 className='font-bold text-xl'>Workspace has no bots</h1>
                  <p className='text-zinc-500 text-sm'>Your workspace has no bots. Get started by creating a new bot</p>
                  <button
                    onClick={onCreateBot}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Bot</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {bots.length > 0 && searchQuery && bots.filter(bot =>
            bot.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-zinc-400 mb-2">No bots found</h3>
                <p className="text-zinc-500">Try adjusting your search terms</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}