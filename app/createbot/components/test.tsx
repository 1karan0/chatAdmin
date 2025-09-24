"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Plus, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import { SimpleBotFormData, BotTemplate, KnowledgeBaseItem } from "@/types/bot-creation";

const botTemplates: BotTemplate[] = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Help customers with common questions and support requests',
    icon: '🎧',
    category: 'customer-service',
    features: ['24/7 Support', 'FAQ Handling', 'Ticket Creation'],
    config: {
      welcomeMessage: "Hi! I'm here to help you with any questions or issues you might have.",
      fallbackMessage: "I'm not sure about that. Let me connect you with a human agent.",
      personality: 'professional'
    }
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Guide prospects through your sales process',
    icon: '💼',
    category: 'sales',
    features: ['Lead Qualification', 'Product Info', 'Demo Booking'],
    config: {
      welcomeMessage: "Hello! I'd love to help you learn more about our products and services.",
      fallbackMessage: "Let me get you in touch with our sales team for more details.",
      personality: 'friendly'
    }
  },
  {
    id: 'knowledge-bot',
    name: 'Knowledge Bot',
    description: 'Answer questions from your documentation and content',
    icon: '📚',
    category: 'custom',
    features: ['Document Search', 'Smart Answers', 'Content Discovery'],
    config: {
      welcomeMessage: "Hi! I can help you find information from our knowledge base.",
      fallbackMessage: "I couldn't find that information. Try rephrasing your question.",
      personality: 'helpful'
    }
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Create a custom bot with your own configuration',
    icon: '⚡',
    category: 'custom',
    features: ['Full Customization', 'Custom Flows', 'Advanced Features'],
    config: {
      welcomeMessage: "Hello! How can I help you today?",
      fallbackMessage: "I'm sorry, I didn't understand that. Could you please rephrase?",
      personality: 'friendly'
    }
  }
];

export default function CreateBotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<SimpleBotFormData>({
    name: "",
    description: "",
    template: "",
    knowledgeBase: [],
    welcomeMessage: "",
    personality: "friendly",
    language: "en"
  });

  const selectedTemplate = botTemplates.find(t => t.id === formData.template);

  const handleTemplateSelect = (template: BotTemplate) => {
    setFormData(prev => ({
      ...prev,
      template: template.id,
      welcomeMessage: template.config.welcomeMessage,
      personality: template.config.personality as any
    }));
    setStep(2);
  };

  const handleAddKnowledge = (type: 'url' | 'text') => {
    const content = type === 'url' 
      ? prompt('Enter website URL:')
      : prompt('Enter text content:');
    
    if (content) {
      const newItem: KnowledgeBaseItem = {
        id: Date.now().toString(),
        type,
        content,
        status: 'pending'
      };
      setFormData(prev => ({
        ...prev,
        knowledgeBase: [...prev.knowledgeBase, newItem]
      }));
    }
  };

  const handleRemoveKnowledge = (id: string) => {
    setFormData(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Bot name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          config: {
            template: formData.template,
            welcomeMessage: formData.welcomeMessage,
            personality: formData.personality,
            language: formData.language,
          },
          knowledgeBase: formData.knowledgeBase,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/bots/${data.bot.id}`);
      } else {
        setError(data.error || "Failed to create bot");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
            className="text-gray-400 hover:text-white flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step > 1 ? 'Back' : 'Back to Dashboard'}
          </Button>
          <div className="text-sm text-gray-400">
            Step {step} of 3
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Create a new bot</h1>
            <p className="text-gray-400 text-lg">Choose a template to get started quickly</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {botTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-black border border-gray-800 rounded-lg p-8 cursor-pointer hover:border-purple-500 transition-all group"
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Configuration */}
        {step === 2 && selectedTemplate && (
          <div>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{selectedTemplate.icon}</div>
              <h1 className="text-2xl font-bold text-white mb-2">{selectedTemplate.name}</h1>
              <p className="text-gray-400">Configure your bot's basic settings</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bot Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Customer Service Bot"
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your bot does..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Welcome Message
                </label>
                <textarea
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Personality
                </label>
                <select
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="helpful">Helpful</option>
                </select>
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-gray-800 text-gray-400 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.name.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge Base (Optional) */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Add Knowledge (Optional)</h1>
              <p className="text-gray-400">Train your bot with your content to make it smarter</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Add Knowledge Buttons */}
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => handleAddKnowledge('url')}
                  variant="outline"
                  className="flex-1 border-gray-800 text-gray-400 hover:text-white hover:border-blue-500"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Add Website
                </Button>
                <Button
                  onClick={() => handleAddKnowledge('text')}
                  variant="outline"
                  className="flex-1 border-gray-800 text-gray-400 hover:text-white hover:border-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
              </div>

              {/* Knowledge Base Items */}
              {formData.knowledgeBase.length > 0 && (
                <div className="space-y-3 mb-8">
                  {formData.knowledgeBase.map((item) => (
                    <div key={item.id} className="bg-black border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.type === 'url' ? (
                          <Globe className="w-5 h-5 text-blue-400" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-green-400" />
                        )}
                        <div>
                          <p className="text-white font-medium truncate max-w-xs">
                            {item.content}
                          </p>
                          <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveKnowledge(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {formData.knowledgeBase.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-lg mb-8">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No knowledge added yet</h3>
                  <p className="text-gray-500">Add websites or text content to train your bot</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-gray-800 text-gray-400 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create Bot</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}