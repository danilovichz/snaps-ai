import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal.ai client
const FAL_API_KEY = process.env.FAL_API_KEY || '92601bf8-cf46-41ca-9d31-cc2ac341b268:a1221eccaf65a000115c08f67902404f';

fal.config({
  credentials: FAL_API_KEY,
});

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
    
    // Validate file size (max 5MB for better compatibility)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB for optimal processing' },
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
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes, ${file.type})`);
    
    // Upload file to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    
    console.log(`File uploaded successfully: ${uploadedUrl}`);
    
    return NextResponse.json({
      url: uploadedUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 