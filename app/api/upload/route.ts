import { NextRequest, NextResponse } from 'next/server';
import { runningHubClient } from '@/utils/runninghub-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type (more strict)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Only JPG, PNG, and WebP images are allowed',
          allowedTypes: allowedTypes
        },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB for RunningHub)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB for RunningHub processing' },
        { status: 400 }
      );
    }
    
    // Add minimum size validation
    if (file.size < 10 * 1024) {
      return NextResponse.json(
        { error: 'Image file is too small. Minimum size is 10KB' },
        { status: 400 }
      );
    }
    
    console.log(`📤 Uploading file to RunningHub: ${file.name} (${file.size} bytes, ${file.type})`);
    
    // Upload file to RunningHub storage
    const uploadedUrl = await runningHubClient.uploadImage(file);
    
    console.log(`✅ File uploaded successfully to RunningHub: ${uploadedUrl}`);
    
    return NextResponse.json({
      url: uploadedUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      provider: 'runninghub'
    });
    
  } catch (error) {
    console.error('❌ RunningHub upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload to RunningHub', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 