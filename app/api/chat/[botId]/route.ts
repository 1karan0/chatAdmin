import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// ✅ Better Prisma instance management
const prisma = new PrismaClient();

interface ChatRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

// POST /api/chat/[botId] - Handle chat messages
export async function POST(
  request: NextRequest,
  context: ChatRouteContext
) {
  try {
    // ✅ Await params first
    const params = await context.params;
    const body = await request.json();
    const { message, sessionId, userId } = body;

    // ✅ Enhanced validation
    if (!message?.trim() || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' }, 
        { status: 400 }
      );
    }

    // ✅ Input sanitization
    const sanitizedMessage = message.trim().slice(0, 1000); // Limit message length

    // ✅ Get bot configuration with error handling
    const bot = await prisma.bot.findUnique({
      where: { id: params.botId },
      select: {
        id: true,
        name: true,
        status: true,
        config: true,
        flows: true,
        intents: true,
        entities: true,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    if (bot.status !== 'DEPLOYED') {
      return NextResponse.json(
        { error: 'Bot is not deployed' }, 
        { status: 400 }
      );
    }

    // ✅ Transaction for conversation handling
    const result = await prisma.$transaction(async (tx:any) => {
      // Get or create conversation
      let conversation = await tx.conversation.findFirst({
        where: {
          botId: params.botId,
          sessionId,
        },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            botId: params.botId,
            sessionId,
            userId: userId || null,
            messages: [],
            context: {},
          },
        });
      }

      // Add user message to conversation
      const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
      
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        text: sanitizedMessage,
        timestamp: new Date().toISOString(),
      };

      messages.push(userMessage);

      // Process message and generate bot response
      const botResponse = await processMessage(sanitizedMessage, bot, conversation);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        text: botResponse.text,
        timestamp: new Date().toISOString(),
        ...(botResponse.quickReplies && { quickReplies: botResponse.quickReplies }),
      };

      messages.push(botMessage);

      // Update conversation
      const updatedConversation = await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          messages,
          context: botResponse.context || conversation.context,
          updatedAt: new Date(),
        },
      });

      // Update analytics
      await updateBotAnalytics(tx, params.botId);

      return {
        conversation: updatedConversation,
        botResponse: botMessage,
        context: botResponse.context,
      };
    });

    return NextResponse.json({
      response: result.botResponse,
      context: result.context,
      conversationId: result.conversation.id,
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    
    // ✅ More specific error responses
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// ✅ Enhanced message processing with better typing
interface BotResponse {
  text: string;
  context?: Record<string, any>;
  quickReplies?: string[];
}

async function processMessage(
  message: string, 
  bot: any, 
  conversation: any
): Promise<BotResponse> {
  const config = bot.config || {};
  const flows = bot.flows || [];
  const context = conversation.context || {};
  const lowerMessage = message.toLowerCase();

  // ✅ Enhanced intent matching
  const intents = bot.intents || [];
  const matchedIntent = intents.find((intent: any) =>
    intent.patterns.some((pattern: string) =>
      lowerMessage.includes(pattern.toLowerCase())
    )
  );

  if (matchedIntent) {
    return {
      text: matchedIntent.response || "I understand what you're asking about!",
      context: { ...context, lastIntent: matchedIntent.name },
      quickReplies: matchedIntent.quickReplies,
    };
  }

  // ✅ Fallback to flow-based responses
  const currentFlow = flows.find((flow: any) => flow.id === context.currentFlow);
  
  if (currentFlow) {
    // Handle flow continuation logic here
    const nextStep = currentFlow.steps.find((step: any) => step.id === context.nextStep);
    
    if (nextStep) {
      return {
        text: nextStep.message,
        context: { 
          ...context, 
          currentFlow: currentFlow.id,
          nextStep: nextStep.nextStep 
        },
        quickReplies: nextStep.quickReplies,
      };
    }
  }

  // ✅ Default responses with better context
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      text: config.welcomeMessage || "Hello! How can I help you today?",
      context: { ...context, greeted: true },
      quickReplies: ['How can you help me?', 'Tell me more', 'Contact support']
    };
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return {
      text: "I'm here to help! You can ask me questions about our services, or I can connect you with a human agent.",
      context: { ...context, helpRequested: true },
      quickReplies: ['Contact human agent', 'FAQ', 'Services']
    };
  }

  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return {
      text: "Goodbye! Feel free to come back anytime if you need help.",
      context: { ...context, ended: true, currentFlow: null }
    };
  }

  // ✅ Enhanced fallback response
  return {
    text: config.fallbackMessage || "I'm still learning. Could you please rephrase your question?",
    context,
    quickReplies: ['Start over', 'Contact support', 'Help']
  };
}

// ✅ Improved analytics with transaction support
async function updateBotAnalytics(
  tx: any, 
  botId: string
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await tx.botAnalytics.upsert({
      where: {
        botId_date: {
          botId,
          date: today,
        },
      },
      update: {
        messages: { increment: 1 },
      },
      create: {
        botId,
        date: today,
        conversations: 0,
        messages: 1,
        uniqueUsers: 0,
      },
    });

    await tx.bot.update({
      where: { id: botId },
      data: {
        totalMessages: { increment: 1 },
        lastActivity: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
    // Don't fail the entire request if analytics fails
  }
}

// ✅ Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}