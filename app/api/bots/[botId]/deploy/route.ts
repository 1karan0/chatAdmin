import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Correct interface for async params
interface DeployRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

// POST /api/bots/[botId]/deploy - Deploy a bot
export async function POST(
  request: NextRequest,
  context: DeployRouteContext
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

    // Generate deployment URL
    const deploymentUrl = `${process.env.NEXTAUTH_URL}/embed/${bot.id}`;

    // Update bot status and deployment URL
    const updatedBot = await prisma.bot.update({
      where: { id: params.botId },
      data: {
        status: 'DEPLOYED',
        deploymentUrl,
      },
    });

    return NextResponse.json({ 
      bot: updatedBot,
      deploymentUrl,
      embedCode: `<script src="${process.env.NEXTAUTH_URL}/embed/${bot.id}/widget.js"></script>`,
      message: 'Bot deployed successfully'
    });
  } catch (error) {
    console.error('Error deploying bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/bots/[botId]/deploy - Undeploy a bot
export async function DELETE(
  request: NextRequest,
  context: DeployRouteContext
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

    const updatedBot = await prisma.bot.update({
      where: { id: params.botId },
      data: {
        status: 'PUBLISHED',
        deploymentUrl: null,
      },
    });

    return NextResponse.json({ 
      bot: updatedBot,
      message: 'Bot undeployed successfully'
    });
  } catch (error) {
    console.error('Error undeploying bot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}