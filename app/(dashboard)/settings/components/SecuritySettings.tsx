"use client";

import { Shield, Key, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/components/Button';
import DeleteAccountModal from '@/components/common/modals/DeleteAccountModal';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";


export default function SecuritySettings() {

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  const handleDeleteAccount = async () => {

    try {
      const response = await fetch('/api/user/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId }) // pass userId here
      });
      if (response.ok) {
        setDeleteModalOpen(false);
        Cookies.remove('next-auth.session-token');
        Cookies.remove('__Secure-next-auth.session-token');
        await signOut({ callbackUrl: '/' });
      }
      if (!response.ok) throw new Error('Failed to delete account');
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h3>

        <div className="space-y-4">
          <div className="bg-black border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-zinc-400">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300">
                Enable 2FA
              </Button>
            </div>
          </div>

          <div className="bg-black border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Active Sessions</h4>
                  <p className="text-sm text-zinc-400">Manage your login sessions</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300">
                View Sessions
              </Button>
            </div>
          </div>

          <div className="bg-black border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">API Keys</h4>
                  <p className="text-sm text-zinc-400">Manage your API access</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300">
                Manage Keys
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <h4 className="text-red-300 font-medium mb-1">Danger Zone</h4>
            <p className="text-red-400 text-sm mb-3">
              These actions are irreversible. Please proceed with caution.
            </p>
            <Button
              onClick={() => setDeleteModalOpen(true)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      {deleteModalOpen && (
        <DeleteAccountModal
          setDeleteAccountModal={setDeleteModalOpen}
          confirmDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
}