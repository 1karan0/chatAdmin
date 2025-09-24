"use client"

import { Save, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import { Bot } from "@/types";
import DeleteBotModal from "@/components/common/modals/DeleteBotModal";
import { useState } from "react";

interface Props {
  bot: Bot;
  onSave: () => void;
  saving: boolean;
  onDeploy: () => void;
  deploying: boolean;
  onDelete: () => void;
}

export default function BotHeader({ bot, onSave, saving, onDeploy, deploying, onDelete }: Props) {
    const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);


  
  return (
    <div className="bg-black border-b border-zinc-700 px-6 py-4">
      <div className="lg:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          </div>
          <div>
            <h1 className="lg:text-xl font-bold text-white">{bot.name}</h1>
            <p className="lg:text-sm text-xs text-zinc-400 mt-2 lg:mt-0">
              {bot.status} • {bot.totalMessages} messages • {bot.totalConversations} conversations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={onSave} disabled={saving}>
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save"}</span>
          </Button>
          <Button onClick={onDeploy} disabled={deploying} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4" />
            <span>{deploying ? "Deploying..." : "Deploy"}</span>
          </Button>
          <Button variant="destructive" onClick={()=>setDeleteModalOpen(true)} className="bg-red-600 hover:bg-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
              {
        deleteModalOpen && <DeleteBotModal bot={bot} setShowDeleteModal={setDeleteModalOpen} confirmDelete={()=>{
            onDelete();
            setDeleteModalOpen(false);
        }} />
              }

    </div>
  );
}