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

        {/* Chatbot Behavior */}
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Chatbot Behavior</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Website Type</label>
              <select
                value={bot.config?.websiteType || ""}
                onChange={(e) => setBot({ ...bot, config: { ...bot.config, websiteType: e.target.value } })}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              >
                <option value="">Select website type</option>
                <option value="Service Business">Service Business</option>
                <option value="E-commerce Store">E-commerce Store</option>
                <option value="SaaS / Product">SaaS / Product</option>
                <option value="Educational / Blog">Educational / Blog</option>
                <option value="Internal / Intranet">Internal / Intranet</option>
                <option value="Portfolio / Personal">Portfolio / Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Primary Goal</label>
              <select
                value={bot.config?.primaryGoal || ""}
                onChange={(e) => setBot({ ...bot, config: { ...bot.config, primaryGoal: e.target.value } })}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              >
                <option value="">Select primary goal</option>
                <option value="Sales + Support">Sales + Support</option>
                <option value="Support only">Support only</option>
                <option value="FAQ only">FAQ only</option>
                <option value="Education / Content">Education / Content</option>
                <option value="Internal Helpdesk">Internal Helpdesk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tone</label>
              <select
                value={bot.config?.tone || ""}
                onChange={(e) => setBot({ ...bot, config: { ...bot.config, tone: e.target.value } })}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              >
                <option value="">Select tone</option>
                <option value="Friendly & Professional">Friendly & Professional</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Technical & Precise">Technical & Precise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Extra Instructions</label>
              <textarea
                value={bot.config?.extraInstructions || ""}
                onChange={(e) => setBot({ ...bot, config: { ...bot.config, extraInstructions: e.target.value } })}
                rows={3}
                placeholder="Any additional instructions for the bot behavior"
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}