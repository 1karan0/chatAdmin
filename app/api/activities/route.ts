import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/activities - Get user activities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's bots for activity filtering
    const userBots = await prisma.bot.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, updatedAt: true, createdAt: true, status: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    // Generate activities based on bot changes
    const activities = userBots.map((bot:any, index:any) => {
      const timeDiff = Date.now() - new Date(bot.updatedAt).getTime();
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      
      let action = 'updated the bot information of';
      let type: 'create' | 'update' | 'delete' | 'deploy' | 'view' = 'update';
      
      if (bot.status === 'DEPLOYED') {
        action = 'deployed bot';
        type = 'deploy';
      } else if (new Date(bot.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000)) {
        action = 'created bot';
        type = 'create';
      }

      return {
        id: `${bot.id}-${index}`,
        user: session.user.name?.charAt(0) || 'U',
        action,
        target: bot.name,
        time: new Date(Date.now() - minutesAgo * 60 * 1000),
        type,
      };
    });

    // Add some recent conversation activities
    const recentConversations = await prisma.conversation.findMany({
      where: {
        botId: { in: userBots.map((bot:any) => bot.id) },
      },
      include: {
        bot: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    const conversationActivities = recentConversations.map((conv:any, index:any) => ({
      id: `conv-${conv.id}-${index}`,
      user: session.user.name?.charAt(0) || 'U',
      action: 'received message for',
      target: conv.bot.name,
      time: new Date(conv.updatedAt),
      type: 'view' as const,
    }));

    const allActivities = [...activities, ...conversationActivities]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit);

    return NextResponse.json({ activities: allActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}