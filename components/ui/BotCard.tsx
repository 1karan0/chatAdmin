"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Play, Trash2, Heart, Eye, Calendar, ExternalLink, Settings } from 'lucide-react';
import { Bot } from '@/types';
import { Button } from '@/components/common/components/Button';
import DeleteBotModal from '../common/modals/DeleteBotModal';

interface BotCardProps {
  bot: Bot;
  onDelete: (botId: string) => void;
  onDeploy: (botId: string) => void;
  onLike: (botId: string) => void;
}

export default function BotCard({ bot, onDelete, onDeploy, onLike }: BotCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const handleEdit = () => {
    router.push(`/bots/${bot.id}`);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const response = await fetch(`/api/bots/${bot.id}/deploy`, {
        method: 'POST',
      });
      if (response.ok) {
        onDeploy(bot.id);
      }
    } catch (error) {
      console.error('Error deploying bot:', error);
    } finally {
      setDeploying(false);
    }
  };

   const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(bot.id);
    setShowDeleteModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'DEPLOYED':
        return 'bg-green-900 text-green-300';
      case 'DRAFT':
        return 'bg-yellow-900 text-yellow-300';
      case 'ERROR':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="bg-black border border-gray-700 rounded-lg p-5   transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {bot.image ? (
            <img src={bot.image} alt={bot.name} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {bot.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-white font-semibold">{bot.name}</h3>
            <p className="text-xs text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(bot.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Bot
              </button>
              <button
                onClick={() => window.open(`/embed/${bot.id}`, '_blank')}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-300 text-sm line-clamp-2 mb-2">
          {bot.description || "No description provided"}
        </p>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
          {bot.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {bot.views}
          </span>
          <span className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {bot.likes}
          </span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          Edit
        </Button>
        
        <Button
          onClick={handleDeploy}
          disabled={deploying || bot.status.toLocaleLowerCase() === 'deployed'}
          size="sm"
          className={`flex-1 text-xs ${
            bot.status.toLowerCase() === 'deployed' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {deploying ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          {bot.status.toLowerCase() === 'deployed' ? 'Deployed' : 'Deploy'}
        </Button>
        
        <Button
          onClick={() => onLike(bot.id)}
          variant="ghost"
          size="sm"
          className="px-2"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
       {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteBotModal setShowDeleteModal ={setShowDeleteModal} confirmDelete={confirmDelete} bot ={bot}/>
      )}
    </div>
  );
}