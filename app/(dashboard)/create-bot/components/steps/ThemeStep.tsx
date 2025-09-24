"use client";

import { Palette, Monitor, Smartphone, Eye, Settings, Sparkles, Brush, Type, Layout, Code } from "lucide-react";
import { BotFormData } from "../CreateBotWizard";
import { useState } from "react";

interface Props {
  formData: BotFormData;
  updateFormData: (field: keyof BotFormData, value: any) => void;
}

const fontFamilies = [
  { value: 'Inter', label: 'Inter', preview: 'Aa' },
  { value: 'Roboto', label: 'Roboto', preview: 'Aa' },
  { value: 'Open Sans', label: 'Open Sans', preview: 'Aa' },
  { value: 'Lato', label: 'Lato', preview: 'Aa' },
  { value: 'Poppins', label: 'Poppins', preview: 'Aa' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'Aa' },
];

const chatPositions = [
  { value: 'bottom-right', label: 'Bottom Right', icon: '↘️' },
  { value: 'bottom-left', label: 'Bottom Left', icon: '↙️' },
  { value: 'top-right', label: 'Top Right', icon: '↗️' },
  { value: 'top-left', label: 'Top Left', icon: '↖️' },
];

const presetThemes = [
  {
    name: 'Ocean Blue',
    gradient: 'from-blue-500 to-cyan-400',
    colors: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
    }
  },
  {
    name: 'Midnight',
    gradient: 'from-purple-600 to-gray-800',
    colors: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#6b7280',
      backgroundColor: '#111827',
      textColor: '#f9fafb',
    }
  },
  {
    name: 'Forest',
    gradient: 'from-green-500 to-emerald-600',
    colors: {
      primaryColor: '#10b981',
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    }
  },
  {
    name: 'Sunset',
    gradient: 'from-orange-400 to-red-500',
    colors: {
      primaryColor: '#f59e0b',
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    }
  },
  {
    name: 'Lavender',
    gradient: 'from-purple-400 to-pink-400',
    colors: {
      primaryColor: '#a855f7',
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    }
  },
  {
    name: 'Mint',
    gradient: 'from-teal-400 to-green-400',
    colors: {
      primaryColor: '#14b8a6',
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    }
  },
];

export default function ThemeStep({ formData, updateFormData }: Props) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<string>('themes');

  const updateTheme = (field: string, value: string) => {
    updateFormData('theme', {
      ...formData.theme,
      [field]: value,
    });
  };

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    updateFormData('theme', {
      ...formData.theme,
      ...preset.colors,
    });
  };

  const tabs = [
    { id: 'themes', label: 'Quick Themes', icon: Sparkles },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Customize Chat Theme</h2>
        <p className="text-zinc-400 text-lg">Design a beautiful and engaging chat experience</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-2 border border-zinc-700/50">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/30">
            {activeTab === 'themes' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                  Quick Theme Presets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presetThemes.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPresetTheme(preset)}
                      className="group relative p-4 rounded-xl border border-zinc-600/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-10 group-hover:opacity-20 transition-opacity rounded-xl`}></div>
                      <div className="relative">
                        <div className="flex items-center space-x-2 mb-3">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: preset.colors.primaryColor }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: preset.colors.backgroundColor }}
                          ></div>
                        </div>
                        <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                          {preset.name}
                        </p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs text-zinc-400">Click to apply</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-400" />
                  Color Palette
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { key: 'primaryColor', label: 'Primary Color', desc: 'Main accent color' },
                    { key: 'secondaryColor', label: 'Secondary Color', desc: 'Supporting elements' },
                    { key: 'backgroundColor', label: 'Background Color', desc: 'Chat background' },
                    { key: 'textColor', label: 'Text Color', desc: 'Main text color' }
                  ].map((color) => (
                    <div key={color.key} className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        {color.label}
                      </label>
                      <p className="text-xs text-zinc-500 mb-3">{color.desc}</p>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={formData.theme[color.key as keyof typeof formData.theme]}
                            onChange={(e) => updateTheme(color.key, e.target.value)}
                            className="w-12 h-12 rounded-xl border-2 border-zinc-600 cursor-pointer"
                          />
                          <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/50 transition-all pointer-events-none"></div>
                        </div>
                        <input
                          type="text"
                          value={formData.theme[color.key as keyof typeof formData.theme]}
                          onChange={(e) => updateTheme(color.key, e.target.value)}
                          className=" w-full px-2 py-3 bg-black/50 border border-zinc-600/50 rounded-xl text-white text-sm "
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Type className="w-5 h-5 mr-2 text-blue-400" />
                  Typography Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      Font Family
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {fontFamilies.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => updateTheme('fontFamily', font.value)}
                          className={`p-3 rounded-lg border transition-all ${formData.theme.fontFamily === font.value
                              ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                              : 'border-zinc-600 hover:border-zinc-500 text-zinc-300'
                            }`}
                        >
                          <div className="text-lg mb-1" style={{ fontFamily: font.value }}>
                            {font.preview}
                          </div>
                          <div className="text-xs">{font.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      Font Size
                    </label>
                    <select
                      value={formData.theme.fontSize}
                      onChange={(e) => updateTheme('fontSize', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-zinc-600/50 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="12px">Small (12px)</option>
                      <option value="14px">Medium (14px)</option>
                      <option value="16px">Large (16px)</option>
                      <option value="18px">Extra Large (18px)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Layout className="w-5 h-5 mr-2 text-blue-400" />
                  Layout & Positioning
                </h3>

                <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Chat Position
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {chatPositions.map((position) => (
                      <button
                        key={position.value}
                        onClick={() => updateTheme('chatPosition', position.value)}
                        className={`p-4 rounded-xl border transition-all ${formData.theme.chatPosition === position.value
                            ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                            : 'border-zinc-600 hover:border-zinc-500 text-zinc-300'
                          }`}
                      >
                        <div className="text-2xl mb-2">{position.icon}</div>
                        <div className="text-sm">{position.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      Chat Width
                    </label>
                    <input
                      type="text"
                      value={formData.theme.chatWidth}
                      onChange={(e) => updateTheme('chatWidth', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-zinc-600/50 rounded-lg text-white text-sm focus:border-blue-500"
                      placeholder="400px"
                    />
                  </div>

                  <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      Chat Height
                    </label>
                    <input
                      type="text"
                      value={formData.theme.chatHeight}
                      onChange={(e) => updateTheme('chatHeight', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-zinc-600/50 rounded-lg text-white text-sm focus:border-blue-500"
                      placeholder="600px"
                    />
                  </div>

                  <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/30">
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      Border Radius
                    </label>
                    <select
                      value={formData.theme.borderRadius}
                      onChange={(e) => updateTheme('borderRadius', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-zinc-600/50 rounded-lg text-white text-sm focus:border-blue-500"
                    >
                      <option value="0px">None (0px)</option>
                      <option value="4px">Small (4px)</option>
                      <option value="8px">Medium (8px)</option>
                      <option value="12px">Large (12px)</option>
                      <option value="16px">Extra Large (16px)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/30 sticky top-6">  

            <div className={`bg-zinc-900/50 rounded-xl p-6 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
              <div
                className="rounded-xl shadow-2xl border border-zinc-600/30"
                style={{
                  width: previewMode === 'mobile' ? '280px' : formData.theme.chatWidth,
                  height: previewMode === 'mobile' ? '400px' : formData.theme.chatHeight,
                  backgroundColor: formData.theme.backgroundColor,
                  fontFamily: formData.theme.fontFamily,
                  fontSize: formData.theme.fontSize,
                  borderRadius: formData.theme.borderRadius,
                }}
              >
                {/* Chat Header */}
                <div
                  className="p-4 flex  space-x-3 relative overflow-hidden"
                  style={{ backgroundColor: formData.theme.primaryColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                  <div className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-sm font-bold">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                  <div className="relative">
                    <h4 className="text-white font-semibold text-sm">
                      {formData.name || 'AI Assistant'}
                    </h4>
                    <p className="text-white/80 text-xs flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Online now
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                      style={{
                        backgroundColor: formData.theme.primaryColor,
                        color: formData.theme.textColor
                      }}
                    >
                      AI
                    </div>
                    <div
                      className="max-w-xs p-3 rounded-2xl text-sm shadow-md"
                      style={{
                        backgroundColor: formData.theme.secondaryColor + "20",
                        color: formData.theme.textColor,
                        borderRadius: formData.theme.borderRadius,
                      }}
                    >
                      Hello! I'm your AI assistant. How can I help you today?
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 justify-end">
                    <div
                      className="max-w-xs p-3 rounded-2xl text-sm shadow-md"
                      style={{
                        backgroundColor: formData.theme.primaryColor,
                        color: 'white',
                        borderRadius: formData.theme.borderRadius,
                      }}
                    >
                      I need help with my account settings
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"></div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                      style={{
                        backgroundColor: formData.theme.primaryColor,
                        color: 'white'
                      }}
                    >
                      AI
                    </div>
                    <div
                      className="max-w-xs p-3 rounded-2xl text-sm shadow-md"
                      style={{
                        backgroundColor: formData.theme.secondaryColor + '20',
                        color: formData.theme.textColor,
                        borderRadius: formData.theme.borderRadius,
                      }}
                    >
                      I'd be happy to help you with your account! What specific settings would you like to modify? 🔧
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t mt-40  border-zinc-200/20">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border rounded-full text-sm bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      style={{
                        borderColor: formData.theme.secondaryColor + '40',
                        borderRadius: formData.theme.borderRadius,
                        fontSize: formData.theme.fontSize,
                      }}
                      readOnly
                    />
                    <button
                      className="px-6 py-3 rounded-full text-white text-sm font-medium shadow-lg "
                      style={{
                        backgroundColor: formData.theme.primaryColor,
                        borderRadius: formData.theme.borderRadius,
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}