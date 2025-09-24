export interface BotTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'customer-service' | 'sales' | 'hr' | 'marketing' | 'custom';
  features: string[];
  config: {
    welcomeMessage: string;
    fallbackMessage: string;
    personality: string;
  };
}

export interface KnowledgeBaseItem {
  id: string;
  type: 'url' | 'text' | 'file';
  content: string;
  title?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface SimpleBotFormData {
  // Basic Info
  name: string;
  description: string;
  template: string;
  
  // Knowledge Base (optional)
  knowledgeBase: KnowledgeBaseItem[];
  
  // Simple Configuration
  welcomeMessage: string;
  personality: 'professional' | 'friendly' | 'helpful';
  language: string;
}