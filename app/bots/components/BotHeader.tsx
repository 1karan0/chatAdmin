"use client"

import { Bot, Save, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import { BotData } from "@/types";

interface Props {
  bot: BotData;
  onSave: () => void;
  saving: boolean;
  onDeploy: () => void;
  deploying: boolean;
  onDelete: () => void;
}

export default function BotHeader({ bot, onSave, saving, onDeploy, deploying, onDelete }: Props) {
  return (
    <div className="bg-black border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{bot.name}</h1>
            <p className="text-sm text-gray-400">
              {bot.status} • {bot.totalMessages} messages • {bot.totalConversations} conversations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onSave} disabled={saving}>
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save"}</span>
          </Button>
          <Button onClick={onDeploy} disabled={deploying} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4" />
            <span>{deploying ? "Deploying..." : "Deploy"}</span>
          </Button>
          <Button variant="destructive" onClick={onDelete} className="bg-red-600 hover:bg-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
