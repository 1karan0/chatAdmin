"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Zap, 
  BarChart3, 
  CreditCard, 
  Settings, 
  ChevronLeft,
  Bot,
  Sparkles
} from 'lucide-react';
import { UsageStat } from '@/types';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
  usageStats: UsageStat[];
}

const navigation = [
  { name: 'Dashboard', icon: Home, current: true, href: '/dashboard' },
  { name: 'Create Bot', icon: Zap, current: false, href: '/create-bot' },
  // { name: 'Usage', icon: BarChart3, current: false, href: '/usage' },
  // { name: 'Billing', icon: CreditCard, current: false, href: '/billing' },
  { name: 'Settings', icon: Settings, current: false, href: '/settings' },
];

export default function Sidebar({ collapsed, mobileOpen, onCollapse, onMobileClose, usageStats }: SidebarProps) {
  const {data:session}=useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const aiSpendStat = usageStats.find(stat => stat.label === 'AI Spend');

  const handleNavClick = (href: string) => {
    router.push(href);
    onMobileClose();
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      } bg-black border-r border-zinc-700`}>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Workspace header */}
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-2 gap-4">
              <div className=" h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src="/chatbot-logo.png" alt="" />
              </div>
              {!collapsed && (
                <div className="">
                  <p className="text-sm font-medium text-white truncate">codedrill agent</p>
                  <p className="text-xs text-zinc-400">Admin</p>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  {!collapsed && item.name}
                </button>
              ))}
            </nav>
            
            {/* AI Spend section */}
            {!collapsed && aiSpendStat && (
              <div className="mt-auto px-4 py-4 border-t border-zinc-800">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm text-zinc-300">AI Spend</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${aiSpendStat.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    ${aiSpendStat.value.toFixed(2)} of ${aiSpendStat.max.toFixed(2)} used
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Collapse button */}
          <div className="flex-shrink-0 p-4 border-t border-zinc-800">
            <button
              onClick={onCollapse}
              className="w-full flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-black transform transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src="/chatbot-logo.png" alt="" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">codedrill agent</p>
                <p className="text-xs text-zinc-400">Admin</p>
              </div>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  {item.name}
                </button>
              ))}
            </nav>
            
            {aiSpendStat && (
              <div className="mt-auto px-4 py-4 border-t border-zinc-800">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm text-zinc-300">AI Spend</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${aiSpendStat.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    ${aiSpendStat.value.toFixed(2)} of ${aiSpendStat.max.toFixed(2)} used
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}