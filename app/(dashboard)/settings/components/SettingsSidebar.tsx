import { Settings, User, Bell, Shield, Key } from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'api', name: 'API Keys', icon: Key },
];

const SettingsSidebar = ({ activeTab, setActiveTab }: SettingsSidebarProps) => {
  return (
    <div className="lg:w-64">
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <tab.icon className="mr-3 h-5 w-5" />
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;