"use client"

import { Settings, BarChart3, Code } from "lucide-react";

const tabs = [
  { id: "settings", name: "Settings", icon: Settings },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "deploy", name: "Deploy", icon: Code },
];

export default function BotTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="bg-black border-b border-zinc-700 px-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}