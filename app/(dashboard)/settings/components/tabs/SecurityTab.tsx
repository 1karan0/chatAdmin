import { Button } from '@/components/common/components/Button';

const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="bg-black border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-zinc-400">Add an extra layer of security to your account</div>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
          </div>
          
          <div className="bg-black border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Active Sessions</div>
                <div className="text-sm text-zinc-400">Manage your active login sessions</div>
              </div>
              <Button variant="outline" size="sm">View Sessions</Button>
            </div>
          </div>
          
          <div className="bg-black border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Login History</div>
                <div className="text-sm text-zinc-400">Review recent login activity</div>
              </div>
              <Button variant="outline" size="sm">View History</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;