"use client";

import { Zap, Plus, Settings, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/components/Button';
import { useApi } from '@/hooks/useApi';
import IntegrationsSkeleton from '@/components/skeletons/IntegrationsSkeleton';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { data: integrationsData, loading, error } = useApi(async () => {
    // Mock integrations data - replace with actual API call
    return {
      data: {
        integrations: [
          {
            id: '1',
            name: 'Slack',
            description: 'Connect your bots to Slack channels',
            icon: '💬',
            status: 'available',
            category: 'Communication',
            connected: false,
          },
          {
            id: '2',
            name: 'Discord',
            description: 'Deploy bots to Discord servers',
            icon: '🎮',
            status: 'available',
            category: 'Communication',
            connected: false,
          },
          {
            id: '3',
            name: 'WhatsApp',
            description: 'Connect to WhatsApp Business API',
            icon: '📱',
            status: 'coming-soon',
            category: 'Communication',
            connected: false,
          },
          {
            id: '4',
            name: 'Telegram',
            description: 'Deploy bots to Telegram',
            icon: '✈️',
            status: 'available',
            category: 'Communication',
            connected: false,
          },
          {
            id: '5',
            name: 'Webhook',
            description: 'Custom webhook integrations',
            icon: '🔗',
            status: 'available',
            category: 'API',
            connected: false,
          },
          {
            id: '6',
            name: 'Zapier',
            description: 'Connect with 5000+ apps',
            icon: '⚡',
            status: 'available',
            category: 'Automation',
            connected: false,
          }
        ]
      }
    };
  });

  const categories = ['All', 'Communication', 'API', 'Automation'];
  
  const handleConnectIntegration = async (integrationId: string) => {
    try {
      console.log('Connecting integration:', integrationId);
    } catch (error) {
      console.error('Error connecting integration:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <IntegrationsSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Failed to load integrations</h3>
              <p className="text-zinc-400">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const integrations = integrationsData?.integrations || [];
  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-zinc-400">Connect your bots to external platforms and services</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={category === selectedCategory ? 'default' : 'outline'}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:bg-zinc-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{integration.icon}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'available'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
              <p className="text-zinc-400 text-sm mb-4">{integration.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">
                  {integration.category}
                </span>
                <Button
                  size="sm"
                  disabled={integration.status !== 'available'}
                  onClick={() => handleConnectIntegration(integration.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {integration.connected ? 'Connected' : integration.status === 'available' ? 'Connect' : 'Soon'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Integration */}
        <div className="mt-12 bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center">
          <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Need a Custom Integration?</h3>
          <p className="text-zinc-400 mb-6">
            Can't find what you're looking for? We can help you build custom integrations.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
}