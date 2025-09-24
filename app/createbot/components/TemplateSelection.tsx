"use client";

import { BotTemplate } from "@/types/bot-creation";
import TemplateCard from "./TemplateCard";
import { Bot } from "lucide-react";

export default function TemplateSelection({ botTemplates, handleTemplateSelect }: { botTemplates: BotTemplate[], handleTemplateSelect: (template: BotTemplate) => void }) {
  return (
    <div className="text-center flex flex-col items-center mb-12">
      <h1 className="text-2xl font-bold text-white mb-4">Create a new bot</h1>
      <p className="text-gray-400 text-sm ">Choose a template to get started quickly</p>
      <div className="flex flex-col items-start gap-6 mt-10 border rounded-xl p-8 ">
        <div className="text-start mb-2">
          <h2 className="font-bold text-xl">Choose an agent</h2>
        <p className="text-sm text-gray-400">This will configure how your bot behaves</p>
        </div>
        {botTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} onSelect={handleTemplateSelect} />
        ))}
      </div>
    </div>
  );
}
