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
];

const presetThemes = [
  {
    name: 'Ocean Blue',
    gradient: 'from-blue-500 to-cyan-400',
    colors: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#e0f2fe',
      backgroundColor: '#ffffff',
      yourtextColor: '#ffffff',
      chattextColor: '#1e293b',
      bottomColor: '#0ea5e9',
    }
  },
  {
    name: 'Midnight',
    gradient: 'from-purple-600 to-gray-800',
    colors: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#6b7280',
      backgroundColor: '#111827',
      yourtextColor: '#f9fafb',
      chattextColor: '#ffffff',
      bottomColor: '#8b5cf6',
    }
  },
  {
    name: 'Forest',
    gradient: 'from-green-500 to-emerald-600',
    colors: {
      primaryColor: '#10b981',
      secondaryColor: '#d1fae5',
      backgroundColor: '#ffffff',
      yourtextColor: '#ffffff',
      chattextColor: '#1f2937',
      bottomColor: '#10b981',
    }
  },
  {
    name: 'Sunset',
    gradient: 'from-orange-400 to-red-500',
    colors: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fed7aa',
      backgroundColor: '#ffffff',
      yourtextColor: '#ffffff',
      chattextColor: '#1e293b',
      bottomColor: '#f59e0b',
    }
  },
  {
    name: 'Lavender',
    gradient: 'from-purple-400 to-pink-400',
    colors: {
      primaryColor: '#a855f7',
      secondaryColor: '#f3e8ff',
      backgroundColor: '#ffffff',
      yourtextColor: '#ffffff',
      chattextColor: '#1f2937',
      bottomColor: '#a855f7',
    }
  },
  {
    name: 'Mint',
    gradient: 'from-teal-400 to-green-400',
    colors: {
      primaryColor: '#14b8a6',
      secondaryColor: '#ccfbf1',
      backgroundColor: '#ffffff',
      yourtextColor: '#ffffff',
      chattextColor: '#1f2937',
      bottomColor: '#14b8a6',
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
                    { key: 'secondaryColor', label: 'Secondary Color', desc: 'Bot message background' },
                    { key: 'backgroundColor', label: 'Background Color', desc: 'Chat background' },
                    { key: 'yourtextColor', label: 'Your Text Color', desc: 'User message text' },
                    { key: 'chattextColor', label: 'Chat Text Color', desc: 'Bot message text' },
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

        {/* Live Preview Panel - UPDATED */}
        <div className="space-y-6">
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/30 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-400" />
                Live Preview
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-lg transition-all ${previewMode === 'desktop'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-lg transition-all ${previewMode === 'mobile'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`bg-zinc-900/50 rounded-xl p-6 flex items-center justify-center`}
              style={{
                maxWidth: previewMode === 'mobile' ? '350px' : '600px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <div
                className={`flex flex-col border overflow-hidden shadow-2xl xl:ml-10`}
                style={{
                  width: previewMode === 'mobile' ? '320px' : formData.theme.chatWidth || '380px',
                  height: previewMode === 'mobile' ? '500px' : formData.theme.chatHeight || '600px',
                  backgroundColor: formData.theme.backgroundColor || '#ffffff',
                  fontFamily: formData.theme.fontFamily || 'Inter',
                  borderRadius: formData.theme.borderRadius || '16px',
                  minWidth: '350px',
                  maxWidth: '100%',
                }}
              >
                {/* Chat Header with Gradient */}
                <div
                  className="p-5 flex items-center gap-3 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${formData.theme.primaryColor || '#667eea'}, ${formData.theme.primaryColor ? `color-mix(in srgb, ${formData.theme.primaryColor} 80%, #000)` : '#764ba2'})`,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    color: formData.theme.yourtextColor || '#ffffff',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: formData.theme.yourtextColor || '#ffffff',
                    }}
                  >
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                  </div>

                  {/* Bot Info */}
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-base"
                      style={{
                        color: formData.theme.yourtextColor || '#ffffff',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {formData.name || 'AI Assistant'}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: '#4ade80',
                          boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.7)',
                          animation: 'pulse 2s infinite',
                        }}
                      ></div>
                      <p
                        className="text-xs opacity-90"
                        style={{ color: formData.theme.yourtextColor || '#ffffff' }}
                      >
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  className="flex-1 p-5 space-y-3.5 overflow-y-auto"
                  style={{
                    background: formData.theme.backgroundColor ,
                  }}
                >
                  {/* Bot Message */}
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <div
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        background: formData.theme.secondaryColor || '#ffffff',
                        color: formData.theme.chattextColor || '#1a1a1a',
                        fontSize: formData.theme.fontSize || '14px',
                        lineHeight: '1.5',
                        borderBottomLeftRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      Hey! How can I help you today?
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start gap-2 max-w-[75%] ml-auto justify-end">
                    <div
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        background:`${formData.theme.primaryColor || '#667eea'}`,
                        color: formData.theme.yourtextColor || '#ffffff',
                        fontSize: formData.theme.fontSize || '14px',
                        lineHeight: '1.5',
                        borderBottomRightRadius: '4px',
                        boxShadow: '0 2px 12px rgba(102, 126, 234, 0.2)',
                      }}
                    >
                      I need help with my account
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <div
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        background: formData.theme.secondaryColor || '#ffffff',
                        color: formData.theme.chattextColor || '#1a1a1a',
                        fontSize: formData.theme.fontSize || '14px',
                        lineHeight: '1.5',
                        borderBottomLeftRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      I'd be happy to help you! 🔧
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl w-16"
                    style={{
                      background: formData.theme.secondaryColor || '#ffffff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderBottomLeftRadius: '4px',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: formData.theme.primaryColor || '#667eea',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.32s',
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: formData.theme.primaryColor || '#667eea',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.16s',
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: formData.theme.primaryColor || '#667eea',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                      }}
                    ></div>
                  </div>
                </div>

                {/* Input Area */}
                <div
                  className="p-4 border-t"
                  style={{
                    background: formData.theme.backgroundColor || '#ffffff',
                    borderColor: 'rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="flex items-center gap-2.5 p-2 rounded-3xl"
                    style={{
                      background: formData.theme.secondaryColor || '#f1f3f5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 bg-transparent border-0 outline-none"
                      style={{
                        color: formData.theme.chattextColor || '#1a1a1a',
                        fontSize: formData.theme.fontSize || '14px',
                      }}
                      readOnly
                    />
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${formData.theme.primaryColor || '#667eea'}, ${formData.theme.primaryColor ? `color-mix(in srgb, ${formData.theme.primaryColor} 80%, #000)` : '#764ba2'})`,
                        color: formData.theme.yourtextColor || '#ffffff',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="text-center text-[11px] mt-2 opacity-40">
                    Powered by AI • Press Enter to send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.8;
            box-shadow: 0 0 0 4px rgba(74, 222, 128, 0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}