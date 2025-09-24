import { Bot } from "@/types";
import { BarChart3 } from "lucide-react";

export default function AnalyticsTab({ bot }: { bot: Bot }) {
  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Messages</h3>
          <p className="text-3xl font-bold text-white">{bot.totalMessages}</p>
        </div>
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Conversations</h3>
          <p className="text-3xl font-bold text-white">{bot.totalConversations}</p>
        </div>
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Status</h3>
          <p className="text-3xl font-bold text-white">{bot.status}</p>
        </div>
      </div>
      <div className="bg-black border rounded-lg p-8 text-center">
        <BarChart3 className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics</h3>
        <p className="text-zinc-400">Advanced analytics and insights will be available here.</p>
      </div>
    </div>
  );
}