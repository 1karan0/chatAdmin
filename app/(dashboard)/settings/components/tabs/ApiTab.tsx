import { Shield, Key } from 'lucide-react';
import { Button } from '@/components/common/components/Button';

const ApiTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-300 text-sm">Keep your API keys secure and never share them publicly</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Production API Key</div>
              <Button variant="outline" size="sm">Regenerate</Button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-zinc-800 px-3 py-1 rounded text-sm text-zinc-300 flex-1">
                bp_prod_••••••••••••••••••••••••••••••••
              </code>
              <Button variant="ghost" size="sm">Copy</Button>
            </div>
            <div className="text-xs text-zinc-400 mt-2">Created on Jan 15, 2024</div>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Key className="w-4 h-4 mr-2" />
            Generate New API Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiTab;