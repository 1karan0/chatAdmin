import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/knowledge/process - Process knowledge base items with Python backend
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { knowledgeBaseId, botId } = body;

    // Get the knowledge base item
    const knowledgeItem = await prisma.knowledgeBase.findFirst({
      where: {
        id: knowledgeBaseId,
        bot: {
          userId: session.user.id,
        },
      },
    });

    if (!knowledgeItem) {
      return NextResponse.json({ error: 'Knowledge base item not found' }, { status: 404 });
    }

    // Update status to processing
    await prisma.knowledgeBase.update({
      where: { id: knowledgeBaseId },
      data: { status: 'PROCESSING' },
    });

    // Here you would call your Python backend to process the content
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    
    try {
      const processingPayload = {
        id: knowledgeItem.id,
        type: knowledgeItem.type,
        content: knowledgeItem.content,
        sourceUrl: knowledgeItem.sourceUrl,
        filePath: knowledgeItem.filePath,
        botId: botId,
      };

      // Call Python backend for processing
      const pythonResponse = await fetch(`${pythonBackendUrl}/process-knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processingPayload),
      });

      if (pythonResponse.ok) {
        const result = await pythonResponse.json();
        
        // Update knowledge base with processed data in metadata
        await prisma.knowledgeBase.update({
          where: { id: knowledgeBaseId },
          data: {
            status: 'READY',
            metadata: {
              ...(knowledgeItem.metadata as any) || {},
              vectorData: result.vectorData || null,
              chunks: result.chunks || [],
              processedAt: new Date().toISOString(),
              chunkCount: result.chunks?.length || 0,
              processingTime: result.processingTime || 0,
            },
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Knowledge processed successfully',
          result 
        });
      } else {
        throw new Error('Python backend processing failed');
      }
    } catch (pythonError) {
      console.error('Python backend error:', pythonError);
      
      // Update status to failed
      await prisma.knowledgeBase.update({
        where: { id: knowledgeBaseId },
        data: { 
          status: 'FAILED',
          metadata: {
            ...(knowledgeItem.metadata as any) || {},
            error: 'Processing failed',
            failedAt: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({ 
        error: 'Failed to process knowledge with Python backend' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing knowledge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/knowledge/process - Get processing status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');

    if (!botId) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    // Get all knowledge base items for the bot
    const knowledgeItems = await prisma.knowledgeBase.findMany({
      where: {
        botId,
        bot: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const statusCounts = knowledgeItems.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      items: knowledgeItems,
      statusCounts,
      totalItems: knowledgeItems.length,
    });

  } catch (error) {
    console.error('Error getting processing status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}