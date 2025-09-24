"use client";

import { useState } from 'react';
import { Code, Copy, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/common/components/Button';

interface WidgetSettingsProps {
  userId: string;
}

export default function WidgetSettings({ userId }: WidgetSettingsProps) {
  const [widgetConfig, setWidgetConfig] = useState({
    position: 'bottom-right',
    primaryColor: '#0ea5e9',
    size: 'medium',
    showBranding: true,
  });

  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
  ];

  const sizes = [
    { value: 'small', label: 'Small', width: '320px', height: '450px' },
    { value: 'medium', label: 'Medium', width: '400px', height: '600px' },
    { value: 'large', label: 'Large', width: '480px', height: '700px' },
  ];

  const generateEmbedCode = () => {
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js';
    script.setAttribute('data-user-id', '${userId}');
    script.setAttribute('data-position', '${widgetConfig.position}');
    script.setAttribute('data-color', '${widgetConfig.primaryColor}');
    script.setAttribute('data-size', '${widgetConfig.size}');
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Widget Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Position
            </label>
            <select
              value={widgetConfig.position}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, position: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Size
            </label>
            <select
              value={widgetConfig.size}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, size: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label} ({size.width} × {size.height})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={widgetConfig.primaryColor}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-10 rounded border border-zinc-600 cursor-pointer"
              />
              <input
                type="text"
                value={widgetConfig.primaryColor}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Show Branding
              </label>
              <p className="text-xs text-zinc-500">Display "Powered by BotAgent"</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={widgetConfig.showBranding}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, showBranding: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-white mb-3 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          Embed Code
        </h4>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
          <pre className="text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {generateEmbedCode()}
          </pre>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="border-zinc-600 text-zinc-300 hover:text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-600 text-zinc-300 hover:text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}