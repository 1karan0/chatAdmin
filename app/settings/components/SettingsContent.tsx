import { Save, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/components/Button';
import ProfileTab from './tabs/ProfileTab';
import NotificationsTab from './tabs/NotificationsTab';
import SecurityTab from './tabs/SecurityTab';
import ApiTab from './tabs/ApiTab';

interface SettingsContentProps {
  activeTab: string;
  session: any;
  formData: any;
  setFormData: (data: any) => void;
  saving: boolean;
  saveError: string | null;
  onSaveSettings: () => void;
}

const SettingsContent = ({
  activeTab,
  session,
  formData,
  setFormData,
  saving,
  saveError,
  onSaveSettings
}: SettingsContentProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab 
            session={session} 
            formData={formData} 
            setFormData={setFormData} 
          />
        );
      
      case 'notifications':
        return <NotificationsTab />;
      
      case 'security':
        return <SecurityTab />;
      
      case 'api':
        return <ApiTab />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      <div className="bg-black border border-gray-700 rounded-lg p-6">
        {renderTabContent()}
        
        {/* Save Button */}
        {saveError && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
            <p className="text-red-300 text-sm">{saveError}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
          <Button 
            onClick={onSaveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;