"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleBotFormData, BotTemplate, KnowledgeBaseItem } from "@/types/bot-creation";
import Header from "./components/Header";
import TemplateSelection from "./components/TemplateSelection";
import BotConfiguration from "./components/BotConfiguration";
import { SiKnowledgebase } from "react-icons/si";
import { RiCustomerServiceLine } from "react-icons/ri";
import { SiMarketo } from "react-icons/si";
import { MdOutlineStart } from "react-icons/md";
import KnowledgeBaseStep from "./components/KnowledgeBaseStep";

const botTemplates: BotTemplate[] = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Help customers with common questions and support requests',
    icon: <RiCustomerServiceLine/>,
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
    icon: <SiMarketo/>,
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
    icon: <SiKnowledgebase/>,
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
    icon: <MdOutlineStart/>,
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
      <Header step={step} setStep={setStep} router={router} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {step === 1 && (
          <TemplateSelection 
            botTemplates={botTemplates}
            handleTemplateSelect={handleTemplateSelect}
          />
        )}
        {step === 2 && selectedTemplate && (
          <BotConfiguration
            selectedTemplate={selectedTemplate}
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        )}
        {step === 3 && (
          <KnowledgeBaseStep
            formData={formData}
            setFormData={setFormData}
            error={error}
            handleAddKnowledge={handleAddKnowledge}
            handleRemoveKnowledge={handleRemoveKnowledge}
            handleSubmit={handleSubmit}
            setStep={setStep}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
