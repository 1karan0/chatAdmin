"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';
import SettingsHeader from './components/SettingsHeader';
import SettingsSidebar from './components/SettingsSidebar';
import SettingsContent from './components/SettingsContent';
import { useAsyncAction } from '@/hooks/useApi';
import { AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    workspace: '',
    bio: '',
  });

  const { execute: saveSettings, loading: saving, error: saveError } = useAsyncAction(
    async (data: any) => {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    }
  );

  // Initialize form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        workspace: `${session.user.name}'s Workspace`,
        bio: '',
      });
    }
  }, [session]);

  const handleSaveSettings = async () => {
    const result = await saveSettings(formData);
    if (result) {
      // Show success message
      console.log('Settings saved successfully');
    }
  };

  if (status === 'loading') {
    return <SettingsSkeleton />;
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Authentication Required</h3>
            <p className="text-gray-400">Please log in to access settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-10 py-8 ">
      <SettingsHeader />
      
      <div className="flex flex-col lg:flex-row gap-20 ">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className=' w-[60%]'>
          <SettingsContent 
          activeTab={activeTab}
          session={session}
          formData={formData}
          setFormData={setFormData}
          saving={saving}
          saveError={saveError}
          onSaveSettings={handleSaveSettings}
        />
        </div>
      </div>
    </div>
  );
}