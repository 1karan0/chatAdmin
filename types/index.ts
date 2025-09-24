export interface Bot {
  id: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DEPLOYED' | 'ARCHIVED';
  deploymentUrl?: string;
  views: number;
  likes: number;
  avatar?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  apiKey: string;
  config: any;
  userId: string;
  isPublic: boolean;
  knowledgeBase: KnowledgeBaseItem[];
  totalMessages: number;
  totalConversations: number;
  theme: BotTheme;
}

export interface KnowledgeBaseItem {
  id: string;
  type: 'url' | 'text' | 'file' | 'pdf' | 'docx' | 'txt' | 'csv' | 'json';
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'indexed';
  sourceUrl?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  metadata?: {
    title?: string;
    originalName?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}


export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: Date;
  type: 'create' | 'update' | 'delete' | 'deploy' | 'view';
}

export interface UsageStat {
  label: string;
  value: number;
  max: number;
  color: 'red' | 'blue' | 'green' | 'blue';
  percentage: number;
  unit: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  workspace: string;
  emailVerified: boolean;
}

export interface BotFormData {
  name: string;
  description: string;
  avatar: string;
  category: string;
  language: string;
  welcomeMessage: string;
  fallbackMessage: string;
  primaryColor: string;
  fontFamily: string;
  isPublic: boolean;
  tags: string[];
}

export interface BotTheme {
  id: string;
  botId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  chatPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  chatWidth: string;
  chatHeight: string;
  headerStyle: any;
  messageStyle: any;
  inputStyle: any;
  customCSS?: string;
  createdAt: Date;
  updatedAt: Date;
}

