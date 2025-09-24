"use client";

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Bot, Activity, UsageStat } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStat[]>([]);

  // Initialize usage stats
  useEffect(() => {
    setUsageStats([
      {
        label: 'Bot Count',
        value: 1,
        max: 1,
        color: 'red',
        percentage: 100,
        unit: ''
      },
      {
        label: 'Incoming Messages & Events',
        value: 24,
        max: 500,
        color: 'blue',
        percentage: 4.8,
        unit: ''
      },
      {
        label: 'AI Spend',
        value: 0.34,
        max: 5.00,
        color: 'green',
        percentage: 6.8,
        unit: '$'
      },
      {
        label: 'File Storage',
        value: 946.3,
        max: 100000,
        color: 'blue',
        percentage: 0.9,
        unit: 'kB'
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMobileClose={() => setMobileMenuOpen(false)}
          usageStats={usageStats}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          <main className="flex-1 overflow-y-auto bg-black">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}