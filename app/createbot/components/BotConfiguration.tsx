"use client";

import { Button } from "@/components/common/components/Button";
import { BotTemplate, SimpleBotFormData } from "@/types/bot-creation";

export default function BotConfiguration({
  selectedTemplate,
  formData,
  setFormData,
  setStep
}: {
  selectedTemplate: BotTemplate,
  formData: SimpleBotFormData,
  setFormData: any,
  setStep: any
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{selectedTemplate.name}</h1>
        <p className="text-gray-400">Configure your bot's basic settings</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Bot Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Bot Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            placeholder="My Customer Service Bot"
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what your bot does..."
            rows={3}
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Welcome Message */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Welcome Message</label>
          <textarea
            value={formData.welcomeMessage}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, welcomeMessage: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Personality */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Personality</label>
          <select
            value={formData.personality}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, personality: e.target.value as any }))}
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="helpful">Helpful</option>
          </select>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => setStep(1)} className="border-gray-800 text-gray-400 hover:text-white">
            Back
          </Button>
          <Button onClick={() => setStep(3)} disabled={!formData.name.trim()} className="bg-purple-600 hover:bg-purple-700">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
