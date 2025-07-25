import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_API_KEY || 'your_fal_api_key_here'
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  
  try {

    if (!requestId) {
      return NextResponse.json(
        { error: 'Missing requestId parameter' },
        { status: 400 }
      );
    }

    console.log('Checking status for request:', requestId);

    // Check status of the request
    const status = await fal.queue.status('fal-ai/leffa/virtual-tryon', {
      requestId
    });

    console.log('Status response:', status);

    // Transform the response to match our frontend expectations
    let transformedStatus: {
      requestId: string;
      status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      queuePosition?: number;
      resultUrl?: string;
      error?: {
        message: string;
        details: string;
        suggestions: string[];
      };
    } = {
      requestId,
      status: 'IN_QUEUE'
    };

    // Map fal.ai status to our status format
    const statusValue = status.status as string;
    
    if (statusValue === 'COMPLETED') {
      transformedStatus.status = 'COMPLETED';
      
      // Get the result if completed
      try {
        const result = await fal.queue.result('fal-ai/leffa/virtual-tryon', {
          requestId
        });
        
        console.log('Result data:', result);
        
        // Extract the image URL from the result
        if (result.data && result.data.image && result.data.image.url) {
          transformedStatus.resultUrl = result.data.image.url;
        }
      } catch (resultError) {
        console.error('❌ Error fetching result:', resultError);
        console.error('❌ Error details:', resultError instanceof Error ? resultError.message : 'Unknown error');
        
        // Add detailed error info to response
        transformedStatus.error = {
          message: resultError instanceof Error ? resultError.message : 'Unknown error',
          details: 'Failed to fetch result from fal.ai. This often happens with incompatible images.',
          suggestions: [
            'Try using example images first',
            'Ensure uploaded images show a clear full-body person',
            'Use images with good lighting and contrast',
            'Avoid images with complex backgrounds'
          ]
        };
      }
    } else if (statusValue === 'IN_PROGRESS') {
      transformedStatus.status = 'IN_PROGRESS';
    } else if (statusValue === 'FAILED') {
      transformedStatus.status = 'FAILED';
    } else {
      transformedStatus.status = 'IN_QUEUE';
      // Add queue position if available
      if ('queue_position' in status && typeof status.queue_position === 'number') {
        transformedStatus.queuePosition = status.queue_position;
      }
    }

    return NextResponse.json(transformedStatus);

  } catch (error) {
    console.error('Error checking status:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { 
          requestId: requestId,
          status: 'NOT_FOUND',
          error: 'Request not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        requestId: requestId,
        status: 'ERROR',
        error: 'Failed to check request status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 