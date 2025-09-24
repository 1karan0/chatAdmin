'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';
import { Button } from '@/components/common/components/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/common/components/Dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  callbackUrl?: string;
}

const AuthModal = ({
  isOpen,
  onClose,
  title = 'Welcome Back',
  callbackUrl = '/',
}: AuthModalProps) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);

    try {
      await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      setLoadingProvider(null);
    }
  };

  const isLoading = (provider: string) => loadingProvider === provider;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md  glass-effect">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-white text-center mb-6">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            onClick={() => handleSocialLogin('google')}
            disabled={!!loadingProvider}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 h-12"
          >
            {isLoading('google') ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaGoogle className="w-5 h-5" />
            )}
            <span>Continue with Gmail</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin('github')}
            disabled={!!loadingProvider}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 h-12"
          >
            {isLoading('github') ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaGithub className="w-5 h-5" />
            )}
            <span>Continue with GitHub</span>
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
