import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Correct interface for async params
interface RouteContext {
  params: Promise<{
    botId: string;
  }>;
}

// GET /api/bots/[botId] - Get a specific bot
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ✅ Await the params first
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bot = await prisma.bot.findFirst({
      where: {
        id: params.botId,
        userId: session.user.id,
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

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json({ bot });
  } catch (error) {
    console.error('Error fetching bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/bots/[botId] - Update a bot
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ✅ Await the params first
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, avatar, config, flows, intents, entities, status } = body;

    const bot = await prisma.bot.findFirst({
      where: {
        id: params.botId,
        userId: session.user.id,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    const updatedBot = await prisma.bot.update({
      where: { id: params.botId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(avatar !== undefined && { avatar }),
        ...(config && { config }),
        ...(flows && { flows }),
        ...(intents && { intents }),
        ...(entities && { entities }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ bot: updatedBot });
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/bots/[botId] - Delete a bot
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ✅ Await the params first
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bot = await prisma.bot.findFirst({
      where: {
        id: params.botId,
        userId: session.user.id,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    await prisma.bot.delete({
      where: { id: params.botId },
    });

    return NextResponse.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}