'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Button } from '@/components/common/components/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/common/components/Dialog';
import { Lock } from 'lucide-react';

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
      <DialogContent
        className="
        sm:max-w-md
        p-8
        rounded-2xl
        border border-white/10
        bg-gradient-to-b from-zinc-900 to-[#112c5c]
        backdrop-blur-xl
        shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
      "
      >
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              <Lock/>
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center text-white">
            {title}
          </DialogTitle>

          <p className="text-center text-zinc-400 text-sm mt-2">
            Sign in to continue
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Google Button */}
          <Button
            onClick={() => handleSocialLogin('google')}
            disabled={!!loadingProvider}
            className="
            w-full
            bg-white
            text-black
            hover:bg-zinc-100
            font-medium
            py-3
            rounded-xl
            flex
            items-center
            justify-center
            gap-3
            transition-all
            duration-200
            hover:scale-[1.02]
          "
          >
            {isLoading('google') ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaGoogle className="w-5 h-5 text-red-500" />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-zinc-700"></div>
            <span className="px-3 text-zinc-400 text-xs">OR</span>
            <div className="flex-1 border-t border-zinc-700"></div>
          </div> 

          {/* GitHub Button */}
          <Button
            onClick={() => handleSocialLogin('github')}
            disabled={!!loadingProvider}
            className="
            w-full
            bg-black
            hover:bg-zinc-900
            text-white
            font-medium
            py-3
            rounded-xl
            flex
            items-center
            justify-center
            gap-3
            transition-all
            duration-200
            hover:scale-[1.02]
          "
          >
            {isLoading('github') ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaGithub className="w-5 h-5" />
            )}
            Continue with GitHub
          </Button>


          {/* Footer */}
          <p className="text-xs text-center text-zinc-500 mt-6 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-white cursor-pointer hover:underline">
              Terms
            </span>{' '}
            and{' '}
            <span className="text-white cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;