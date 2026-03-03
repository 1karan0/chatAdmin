"use client"

import { Settings, BarChart3, Code, Library } from "lucide-react";
import CustomDropdown from "../../../../../components/common/components/CustomDropdown";

const tabs = [
  { id: "settings", name: "Settings", icon: Settings },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "deploy", name: "Deploy", icon: Code },
  { id: "integrations", name: "Add knowledge", icon: Library },
  { id: "conversation", name: "Conversation", icon: Library },
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
      {/* mobile dropdown */}
      <div className="block sm:hidden py-3">
        <label htmlFor="bot-tab-select" className="sr-only">
          Select tab
        </label>
        {/* mobile dropdown */}
        <div className="block sm:hidden py-3 relative">
          <CustomDropdown
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* desktop tabs */}
      <nav className="hidden sm:flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
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