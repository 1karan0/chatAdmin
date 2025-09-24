"use client";

import { useState } from 'react';
import { Button } from '@/components/common/components/Button';
import ProfileImageUpload from './ProfileImageUpload';

interface ProfileFormProps {
  session: any;
  onSave: (data: any) => void;
  saving: boolean;
}

export default function ProfileForm({ session, onSave, saving }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    image: session?.user?.image || '',
    bio: session?.user?.bio || '',
    workspace: ` ${session?.user?.workspace}` || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        
        <div className="space-y-6">
          <ProfileImageUpload
            currentImage={formData.image}
            userName={formData.name}
            onImageChange={(imageUrl) => updateField('image', imageUrl)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={formData.workspace}
              onChange={(e) => updateField('workspace', e.target.value)}
              className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter workspace name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-700">
        <Button 
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}