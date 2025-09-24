"use client";

import { Bot, MessageSquare, ShoppingCart, HeadphonesIcon, Users, Briefcase, Zap } from "lucide-react";
import { BotFormData } from "../CreateBotWizard";

interface Props {
  formData: BotFormData;
  updateFormData: (field: keyof BotFormData, value: any) => void;
}

const botTypes = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Help customers resolve issues and answer questions",
    icon: HeadphonesIcon,

  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    description: "Capture and qualify potential customers",
    icon: Users,
  
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Provide information from your documentation",
    icon: MessageSquare,
 
  },
  {
    id: "other",
    name: "other",
    description: "Define a custom behavior",
    icon: Zap,
  
  }
];

export default function BotTypeStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
       
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Bot Type</h2>
        <p className="text-zinc-400">Select the type of bot that best fits your needs</p>
      </div>

      <div className="flex flex-col gap-5 border rounded-lg p-6">
        {botTypes.map((botType) => {
          const IconComponent = botType.icon;
          return (
            <div
              key={botType.id}
              onClick={() => updateFormData("botType", botType.id)}
              className={`p-3  border rounded-lg cursor-pointer transition-all group hover:bg-zinc-800 transition-all duration-300 ${
                formData.botType === botType.id
                  ? "border-blue-500 bg-blue-500/10 transition-all duration-300"
                  : "border-zinc-600 group-hover:bg-zinc-500 transition-all duration-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg  ${
                  formData.botType === botType.id ? "bg-blue-600" : "bg-zinc-700 group-hover:bg-blue-200 transition-all duration-300"
                }`}>
                  <IconComponent className={`w-5 h-5 ${formData.botType === botType.id?"text-white":"group-hover:text-blue-500"}  transition-all duration-300`} />
                </div>
                <div className="">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-500 transition-all duration-300">{botType.name}</h3>
                  <p className="text-zinc-400 text-sm ">{botType.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {formData.botType && (
        <div className="space-y-4 mt-8">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Bot Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="Enter your bot name"
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Describe what your bot does"
              rows={3}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}