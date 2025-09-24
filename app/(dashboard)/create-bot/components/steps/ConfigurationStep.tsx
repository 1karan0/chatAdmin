"use client";

import { MessageSquare, Settings, Globe } from "lucide-react";
import { BotFormData } from "../CreateBotWizard";

interface Props {
  formData: BotFormData;
  updateFormData: (field: keyof BotFormData, value: any) => void;
}

const personalities = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-like tone',
    example: 'Good day! I am here to assist you with your inquiries.'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and approachable tone',
    example: 'Hi there! I\'m excited to help you out today!'
  },
  {
    id: 'helpful',
    name: 'Helpful',
    description: 'Supportive and solution-focused tone',
    example: 'Hello! I\'m here to help you find exactly what you need.'
  }
];

export default function ConfigurationStep({ formData, updateFormData }: Props) {
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      updateFormData('tags', [...formData.tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
      
        <h2 className="text-2xl font-bold text-white mb-2">Configure Your Bot</h2>
        <p className="text-zinc-400">Set up how your bot communicates and behaves</p>
      </div>

      <div className="space-y-8">
       

        {/* Personality Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Bot Personality
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalities.map((personality) => (
              <div
                key={personality.id}
                onClick={() => updateFormData("personality", personality.id as any)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.personality === personality.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-600 hover:border-zinc-500"
                }`}
              >
                <h3 className="text-white font-medium mb-1">{personality.name}</h3>
                <p className="text-sm text-zinc-400 mb-2">{personality.description}</p>
                <div className="bg-zinc-800 rounded p-2">
                  <p className="text-xs text-zinc-300 italic">"{personality.example}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Welcome Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.welcomeMessage}
              onChange={(e) => updateFormData("welcomeMessage", e.target.value)}
              placeholder="Hello! How can I help you today?"
              rows={3}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">First message users see</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Fallback Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.fallbackMessage}
              onChange={(e) => updateFormData("fallbackMessage", e.target.value)}
              placeholder="I'm sorry, I didn't understand that. Could you please rephrase?"
              rows={3}
              className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">When bot doesn't understand</p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-200 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-500 mt-1">Help users discover your bot</p>
        </div>

        {/* Visibility */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Make bot public</h4>
              <p className="text-sm text-zinc-400">Allow others to discover and use your bot</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => updateFormData("isPublic", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          <div className="bg-white rounded-lg p-4 max-w-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-800">{formData.name || 'Your Bot'}</div>
                <div className="text-xs text-zinc-500">Online</div>
              </div>
            </div>
            <div className="bg-zinc-100 rounded-lg p-3">
              <p className="text-sm text-zinc-800">{formData.welcomeMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}