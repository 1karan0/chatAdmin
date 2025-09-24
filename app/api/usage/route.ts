import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's bots count
    const botCount = await prisma.bot.count({
      where: { userId: session.user.id },
    });

    // Get total messages across all user's bots
    const userBots: { id: string; totalMessages: number }[] = await prisma.bot.findMany({
      where: { userId: session.user.id },
      select: { id: true, totalMessages: true },
    });

    const totalMessages = userBots.reduce(
      (sum: number, bot: { id: string; totalMessages: number }) =>
        sum + bot.totalMessages,
      0
    );

    // Get conversations count for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyConversations = await prisma.conversation.count({
      where: {
        botId: { in: userBots.map((bot) => bot.id) },
        createdAt: { gte: startOfMonth },
      },
    });

    // Calculate storage usage
    const storageUsage =
      totalMessages * 0.1 + monthlyConversations * 0.05; // KB

    // Mock AI spend calculation
    const aiSpend = totalMessages * 0.001; // $0.001 per message

    // Define limits based on plan
    const limits = {
      botCount: 1,
      messages: 500,
      aiSpend: 5.0,
      storage: 100000, // 100MB in KB
    };

    const usageStats = [
      {
        label: 'Bot Count',
        value: botCount,
        max: limits.botCount,
        color: 'red' as const,
        percentage: (botCount / limits.botCount) * 100,
        unit: '',
      },
      {
        label: 'Messages',
        value: totalMessages,
        max: limits.messages,
        color: 'blue' as const,
        percentage: (totalMessages / limits.messages) * 100,
        unit: '',
      },
      {
        label: 'AI Spend',
        value: aiSpend,
        max: limits.aiSpend,
        color: 'green' as const,
        percentage: (aiSpend / limits.aiSpend) * 100,
        unit: '$',
      },
      {
        label: 'Storage',
        value: storageUsage,
        max: limits.storage,
        color: 'blue' as const,
        percentage: (storageUsage / limits.storage) * 100,
        unit: 'kB',
      },
    ];

    // Get monthly usage data for charts
    const monthlyData: { month: string; messages: number; aiSpend: number }[] =
      [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthMessages = await prisma.conversation.count({
        where: {
          botId: { in: userBots.map((bot) => bot.id) },
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        messages: monthMessages,
        aiSpend: monthMessages * 0.001,
      });
    }

    return NextResponse.json({
      usageStats,
      monthlyData,
      insights: {
        messagesGrowth: 23, // Mock data
        aiEfficiency: 15,
        responseTimeImprovement: -8,
      },
    });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
