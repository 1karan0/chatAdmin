"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Play,
  Trash2,
  Heart,
  Eye,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Bot } from "@/types";
import { Button } from "@/components/common/components/Button";
import DeleteBotModal from "@/components/common/modals/DeleteBotModal";
import { useRouter } from "next/navigation";

interface BotCardProps {
  bot: Bot;
  onDelete: (botId: string) => void;
  onDeploy: (botId: string) => void;
  onLike: (botId: string) => void;
}

export default function BotCard({
  bot,
  onDelete,
  onDeploy,
  onLike,
}: BotCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // 👇 NEW: ref + effect for outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleEdit = () => {
    router.push(`/bots/${bot.id}`);
    setShowDropdown(false);
  };

  const handleDeploy = async () => {
    try {
      const response = await fetch(`/api/bots/${bot.id}/deploy`, {
        method: "POST",
      });
      if (response.ok) {
        onDeploy(bot.id);
      }
    } catch (error) {
      console.error("Error deploying bot:", error);
    }
  };

  const confirmDelete = () => {
    onDelete(bot.id);
    setShowDeleteModal(false);
    setShowDropdown(false);
  };
  const handleViewLive = () => { 
    window.open(bot.deploymentUrl, "_blank");
    setShowDropdown(false);
   }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "deployed":
        return "bg-green-900 text-green-300";
      case "draft":
        return "bg-zinc-900 text-zinc-300";
      case "error":
        return "bg-red-900 text-red-300";
      default:
        return "bg-blue-900 text-blue-300";
    }
  };

  return (
    <>
      <div className="bg-black border border-zinc-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-2" ref={dropdownRef}>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                bot.status
              )}`}
            >
              {bot.status}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-zinc-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Edit Bot
                  </button>
                  {bot.status === "DEPLOYED" && (
                    <button
                      onClick={handleViewLive}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
                  >
                    Delete Bot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {bot.name}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2">
            {bot.description || "No description provided"}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{bot.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{bot.likes}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="flex-1 border-zinc-600 text-zinc-300 hover:text-white hover:border-blue-500"
          >
            Edit
          </Button>
          {bot.status !== "DEPLOYED" && (
            <Button
              onClick={handleDeploy}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-1" />
              Deploy
            </Button>
          )}
          <Button
            onClick={() => onLike(bot.id)}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-red-400"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteBotModal
          bot={bot}
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
        />
      )}
    </>
  );
}
