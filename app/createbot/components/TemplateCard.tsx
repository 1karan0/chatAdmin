"use client";

import { BotTemplate } from "@/types/bot-creation";

export default function TemplateCard({ template, onSelect }: { template: BotTemplate, onSelect: (template: BotTemplate) => void }) {
    return (
        <div
            onClick={() => onSelect(template)}
            className="bg-black w-full flex flex-col items-start border border-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-900 transition-all group "
        >
            <div className="text-xl flex gap-3 items-center"><span className="bg-gray-700 p-1 group-hover:bg-purple-500 rounded-md">{template.icon}</span>  <div className="text-start"><h3 className="text-sm font-semibold text-white mb-2 group-hover:text-purple-400">
                {template.name}
            </h3>

                <p className="text-gray-400 text-sm ">{template.description}</p>
                </div>
            </div>
            {/* <div className="flex flex-wrap gap-2">
        {template.features.map((feature, index) => (
          <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
            {feature}
          </span>
        ))}
      </div> */}
        </div>
    );
}
