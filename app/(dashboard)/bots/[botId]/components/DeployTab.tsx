"use client"

import { Bot } from "@/types";
import { Button } from "@/components/common/components/Button";

export default function DeployTab({ bot }: { bot: Bot }) {
  return (
    <div className="h-full p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Deployment Status */}
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Deployment Status</h3>
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                bot.status === "DEPLOYED" ? "bg-green-500" : "bg-zinc-500"
              }`}
            ></div>
            <span className="text-white font-medium">
              {bot.status === "DEPLOYED" ? "Deployed" : "Not Deployed"}
            </span>
          </div>
          {bot.deploymentUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Bot URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={bot.deploymentUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-black border border-zinc-600 rounded-md text-white"
                />
                <Button onClick={() => window.open(bot.deploymentUrl!, "_blank")} className="bg-blue-600 hover:bg-blue-700">
                  Open
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Embed Code */}
        <div className="bg-black border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Embed Code</h3>
          <p className="text-zinc-400 mb-4">Copy this code to embed the chat widget on your website:</p>
          <div className="bg-zinc-900 rounded-lg p-4">
            <code className="text-green-400 text-sm">
              {`<script src="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/embed/${bot.id}/widget.js"></script>`}
            </code>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">API Key</h3>
          <p className="text-zinc-400 mb-4">Use this API key to integrate with your bot programmatically:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={bot.apiKey}
              readOnly
              className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white font-mono text-sm"
            />
            <Button onClick={() => navigator.clipboard.writeText(bot.apiKey)} variant="outline">
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}