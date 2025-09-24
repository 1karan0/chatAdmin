const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Bot deployment notifications', description: 'Get notified when your bots are deployed' },
            { label: 'Usage alerts', description: 'Receive alerts when approaching usage limits' },
            { label: 'Security notifications', description: 'Important security updates and alerts' },
            { label: 'Marketing emails', description: 'Product updates and promotional content' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-700 last:border-b-0">
              <div>
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-sm text-zinc-400">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;