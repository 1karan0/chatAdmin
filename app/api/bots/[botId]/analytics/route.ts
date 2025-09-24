import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Correct interface for async params
interface AnalyticsRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: AnalyticsRouteContext
) {
  try {
    // ✅ Await the params first
    const params = await context.params;
    const { botId } = params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Verify bot ownership
    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
        userId: session.user.id,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // Get analytics data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const analytics = await prisma.botAnalytics.findMany({
      where: {
        botId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get total conversations
    const totalConversations = await prisma.conversation.count({
      where: {
        botId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get unique users
    const uniqueUsers = await prisma.conversation.groupBy({
      by: ['sessionId'],
      where: {
        botId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate totals
    const totals = analytics.reduce(
      (acc: any, day: any) => ({
        conversations: acc.conversations + day.conversations,
        messages: acc.messages + day.messages,
        uniqueUsers: acc.uniqueUsers + day.uniqueUsers,
      }),
      { conversations: 0, messages: 0, uniqueUsers: 0 }
    );

    return NextResponse.json({
      analytics,
      totals: {
        ...totals,
        conversations: totalConversations,
        uniqueUsers: uniqueUsers.length,
      },
      bot: {
        id: bot.id,
        name: bot.name,
        status: bot.status,
        totalConversations: bot.totalConversations,
        totalMessages: bot.totalMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching bot analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}