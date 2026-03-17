"use client";

import { Bot, MessageSquare, ShoppingCart, HeadphonesIcon, Users, Briefcase, Zap } from "lucide-react";
import { BotFormData } from "../CreateBotWizard";
import { useSession } from "next-auth/react";

interface Props {
  formData: BotFormData;
  updateFormData: (field: keyof BotFormData, value: any) => void;
}


const websiteTypes = [
  {
    id: "Service Business",
    name: "Service Business",
    description: "Businesses offering services like consulting, agencies, etc.",
    icon: Briefcase,
  },
  {
    id: "E-commerce Store",
    name: "E-commerce Store",
    description: "Online stores selling products",
    icon: ShoppingCart,
  },
  {
    id: "SaaS / Product",
    name: "SaaS / Product",
    description: "Software as a service or product websites",
    icon: Zap,
  },
  {
    id: "Educational / Blog",
    name: "Educational / Blog",
    description: "Educational content, blogs, or learning platforms",
    icon: Bot,
  },
  {
    id: "Internal / Intranet",
    name: "Internal / Intranet",
    description: "Internal company tools or intranet sites",
    icon: Users,
  },
  {
    id: "Portfolio / Personal",
    name: "Portfolio / Personal",
    description: "Personal portfolios or individual websites",
    icon: MessageSquare,
  },
];


export default function BotTypeStep({ formData, updateFormData }: Props) {

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">

        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Website Type</h2>
        <p className="text-zinc-400">Select the type of website your bot will be used on</p>
      </div>

      <div className="flex flex-col gap-5 border rounded-lg p-6">
        {websiteTypes.map((websiteType) => {
          const IconComponent = websiteType.icon;
          return (
            <div
              key={websiteType.id}
              onClick={() => updateFormData("websiteType", websiteType.id)}
              className={`p-3  border rounded-lg cursor-pointer  group hover:bg-zinc-800 transition-all duration-300 ${formData.websiteType === websiteType.id
                ? "border-blue-500 bg-blue-500/10 transition-all duration-300"
                : "border-zinc-600 group-hover:bg-zinc-500 transition-all duration-300"
                }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg  ${formData.websiteType === websiteType.id ? "bg-blue-600" : "bg-zinc-700 group-hover:bg-blue-200 transition-all duration-300"
                  }`}>
                  <IconComponent className={`w-5 h-5 ${formData.websiteType === websiteType.id ? "text-white" : "group-hover:text-blue-500"}  transition-all duration-300`} />
                </div>
                <div className="">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-500 transition-all duration-300">{websiteType.name}</h3>
                  <p className="text-zinc-400 text-sm ">{websiteType.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {formData.websiteType && (
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

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Primary Goal
            </label>
            <select
              value={formData.primaryGoal}
              onChange={(e) => updateFormData("primaryGoal", e.target.value)}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => updateFormData("tone", e.target.value)}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select tone</option>
              <option value="Friendly & Professional">Friendly & Professional</option>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
              <option value="Technical & Precise">Technical & Precise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Extra Instructions (optional)
            </label>
            <textarea
              value={formData.extraInstructions}
              onChange={(e) => updateFormData("extraInstructions", e.target.value)}
              placeholder="Any additional instructions for the bot behavior"
              rows={3}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}