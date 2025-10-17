import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient, KnowledgeBaseStatus, KnowledgeBaseType } from '@prisma/client';

const prisma = new PrismaClient();

interface KnowledgeRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: KnowledgeRouteContext
) {
  try {
    const { botId } = await context.params;

    // Optional: Verify user session (for secure access)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get JSON body data
    const body = await request.json();
    const {
      title,
      content,
      metadata = {},
      filePath = null,
      fileSize = null,
      mimeType = null,
      sourceUrl = null,
      status = KnowledgeBaseStatus.PENDING,
      type = KnowledgeBaseType.TEXT,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content' },
        { status: 400 }
      );
    }

    // Create record in Prisma
    const knowledge = await prisma.knowledgeBase.create({
      data: {
        botId,
        title,
        content,
        metadata,
        filePath,
        fileSize,
        mimeType,
        sourceUrl,
        status,
        type,
      },
    });

    return NextResponse.json(
      {
        message: 'Knowledge added successfully ✨',
        data: knowledge,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding knowledge:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
