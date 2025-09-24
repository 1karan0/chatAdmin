"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';
import ProfileForm from '@/app/(dashboard)/settings/components/ProfileForm';
import WidgetSettings from '@/app/(dashboard)/settings/components/WidgetSettings';
import SecuritySettings from '@/app/(dashboard)/settings/components/SecuritySettings';
import NotificationSettings from '@/app/(dashboard)/settings/components/NotificationSettings';
import { AlertCircle } from 'lucide-react';
import { signOut } from "next-auth/react";
import { User, Wrench, Bell, Shield } from "lucide-react";



export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'widget', name: 'Widget', icon: Wrench },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];


  const handleSaveProfile = async (data: any) => {
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await update();
      }

      if (!response.ok) throw new Error('Failed to save settings');

      // Optionally refresh session or show success message
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (userId: string) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to delete account');

      const result = await response.json();
      console.log('Account deleted successfully', result);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileForm
            session={session}
            onSave={handleSaveProfile}
            saving={saving}
          />
        );
      case 'widget':
        return <WidgetSettings userId={session?.user?.id || ''} />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };
  if (status === 'loading') {
    return (
      <Layout>
        <SettingsSkeleton />
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Authentication Required</h3>
              <p className="text-zinc-400">Please log in to access settings</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your account and bot configurations</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-black border border-zinc-700 rounded-lg p-6">
              {saveError && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-300 text-sm">{saveError}</p>
                </div>
              )}

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}