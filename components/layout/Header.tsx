"use client";

import { Menu, Bell, Search, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession,signOut } from 'next-auth/react';
import { Button } from '../common/components/Button';
import AuthModal from '../common/modals/AuthModal';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '../common/components/Avatar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { FiSidebar } from "react-icons/fi";



interface HeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ onMobileMenuToggle, sidebarCollapsed }: HeaderProps) {
  const [notifications, setNotifications] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const {data:session}=useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

    const router = useRouter();

  // Simulate notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  const handleLogout = async () => {
    // Clear the authToken cookie
    Cookies.remove('authToken', {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });

    // Sign out from NextAuth
    await signOut({ redirect: false });

    // Refresh the page to clear any client-side state
    router.push('/');
    router.refresh();
  };

  return (
    <>

      {/* Main header */}
      <header className="bg-black border-b border-zinc-700">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
       {/* <button className='hidden lg:block'>
         <FiSidebar className='text-zinc300 cursor-pointer '/>
       </button> */}
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-2 mr-2 h-12 w-12 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
                onClick={onMobileMenuToggle}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
             

              {/* Notifications */}
              <div className="relative">
                <button className="text-zinc-400 hover:text-white p-2 rounded-md hover:bg-black transition-colors">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* User Profile */}
             {session?( <div className="flex items-center space-x-4">
                  <div
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || 'User'}
                        className='rounded-full'
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {session?.user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{session?.user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white font-medium flex items-center space-x-2"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                  </Button>
                </div>): (
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => setShowAuthModal(true)}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

