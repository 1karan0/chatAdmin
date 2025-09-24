import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/bots - Get all bots for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bots = await prisma.bot.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        _count: {
          select: {
            conversations: true,
          },
        },
        theme: true,
        knowledgeBase: true,
        // Exclude sensitive fields like apiKey
        // select: { id: true, name: true, description: true, status: true, createdAt: true, updatedAt: true
      },
    });

    return NextResponse.json({ bots });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bots - Create a new bot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, avatar, config, theme, isPublic, knowledgeBase } = body;

    if (!name) {
      return NextResponse.json({ error: 'Bot name is required' }, { status: 400 });
    }

    // Generate API key for the bot
    const apiKey = `bp_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const bot = await prisma.bot.create({
  data: {
    name,
    description: description || '',
    avatar: avatar || '',
    isPublic: isPublic || false,
    userId: session.user.id,
    apiKey,
    config: config ,
    theme: theme ? {
      create: {
        primaryColor: theme.primaryColor || '#0ea5e9',
        secondaryColor: theme.secondaryColor || '#64748b',
        backgroundColor: theme.backgroundColor || '#ffffff',
        textColor: theme.textColor || '#1e293b',
        fontFamily: theme.fontFamily || 'Inter',
        fontSize: theme.fontSize || '14px',
        borderRadius: theme.borderRadius || '8px',
        chatPosition: theme.chatPosition || 'bottom-right',
        chatWidth: theme.chatWidth || '400px',
        chatHeight: theme.chatHeight || '600px',
        customCSS: theme.customCSS || '',
      }
    } : undefined,
    knowledgeBase: {
      create: knowledgeBase?.map((kb: any) => ({
        title: kb.title || kb.type || "Untitled",
        content: kb.content,
        type: kb.type?.toUpperCase() || 'TEXT',
        sourceUrl: kb.type === 'url' ? kb.content : null,
        filePath: kb.file ? `/uploads/${kb.file.name}` : null,
        fileSize: kb.fileSize || null,
        mimeType: kb.mimeType || null,
        status: 'PENDING',
        metadata: {
          status: kb.status || 'pending',
          type: kb.type,
          originalName: kb.file?.name,
        },
      })) || [],
    },
  },
  include: {
    theme: true,
    knowledgeBase: true,
  },
});


    return NextResponse.json({ bot }, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}