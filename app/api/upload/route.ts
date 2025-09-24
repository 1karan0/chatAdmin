import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils-server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const botId = formData.get('botId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (!botId) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', botId);

    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          error: `File too large: ${file.name}. Maximum size is 10MB.` 
        }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv',
        'application/json',
        'application/msword', // .doc files
      ];

      // Also check by file extension for safety
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'csv', 'json'];

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
        return NextResponse.json({ 
          error: `File type not supported: ${file.name}. Supported types: PDF, DOC, DOCX, TXT, CSV, JSON` 
        }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${safeFilename}`;
      const filepath = join(uploadDir, filename);

      try {
        // Convert file to ArrayBuffer and then to Uint8Array
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Write file using Uint8Array instead of Buffer
        await writeFile(filepath, uint8Array);

        uploadedFiles.push({
          originalName: file.name,
          filename,
          filepath: `/uploads/${botId}/${filename}`,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        });
      } catch (fileError) {
        console.error(`Error saving file ${file.name}:`, fileError);
        return NextResponse.json({ 
          error: `Failed to save file: ${file.name}` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/upload - Get uploaded files for a bot
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

    // Here you could list files from the filesystem or database
    // For now, return empty array
    return NextResponse.json({
      files: [],
      message: 'File listing not implemented yet',
    });

  } catch (error) {
    console.error('Error getting uploaded files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}