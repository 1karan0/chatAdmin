"use client";

import { Bell, Mail, MessageSquare, AlertCircle } from 'lucide-react';

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function NotificationSettings() {
  const notifications: NotificationOption[] = [
    {
      id: 'bot-deployment',
      label: 'Bot Deployments',
      description: 'Get notified when your bots are deployed or updated',
      icon: <MessageSquare className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'usage-alerts',
      label: 'Usage Alerts',
      description: 'Receive alerts when approaching usage limits',
      icon: <AlertCircle className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'security',
      label: 'Security Notifications',
      description: 'Important security updates and alerts',
      icon: <AlertCircle className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'marketing',
      label: 'Product Updates',
      description: 'New features and product announcements',
      icon: <Mail className="w-4 h-4" />,
      enabled: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-black border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
                    {notification.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{notification.label}</h4>
                    <p className="text-sm text-zinc-400">{notification.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={notification.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}