"use client"

import { Bot } from "@/types";

export default function SettingsTab({
  bot,
  setBot,
}: {
  bot: Bot;
  setBot: (bot: Bot) => void;
}) {
  console.log("bot in setting tab =",bot);
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Bot Info */}
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bot Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Bot Name</label>
              <input
                type="text"
                value={bot.name}
                onChange={(e) => setBot({ ...bot, name: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                value={bot.description}
                onChange={(e) => setBot({ ...bot, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Messages</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Welcome Message</label>
              <input
                type="text"
                value={bot.config?.welcomeMessage || ""}
                onChange={(e) =>
                  setBot({
                    ...bot,
                    config: { ...bot.config, welcomeMessage: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Fallback Message</label>
              <input
                type="text"
                value={bot.config?.fallbackMessage || ""}
                onChange={(e) =>
                  setBot({
                    ...bot,
                    config: { ...bot.config, fallbackMessage: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}