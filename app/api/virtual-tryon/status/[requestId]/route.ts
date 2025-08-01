import { NextRequest, NextResponse } from 'next/server';
import { runningHubClient } from '@/utils/runninghub-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  if (!requestId) {
    return NextResponse.json(
      { error: 'Missing requestId parameter' },
      { status: 400 }
    );
  }

  try {
    console.log('🔍 Checking FitDiT status on RunningHub for request:', requestId);
    
    // Get workflow status from RunningHub
    const status = await runningHubClient.getStatus(requestId);
    
    let responseStatus: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    let resultUrl: string | undefined;
    
    switch (status.status) {
      case 'pending':
        responseStatus = 'IN_QUEUE';
        break;
      case 'running':
        responseStatus = 'IN_PROGRESS';
        break;
      case 'success':
        responseStatus = 'COMPLETED';
        // When task completes, fetch the actual result URL
        const results = await runningHubClient.getResults(requestId);
        resultUrl = results.result_url;
        break;
      case 'failed':
        responseStatus = 'FAILED';
        break;
      default:
        responseStatus = 'IN_QUEUE';
    }

    const response = {
      status: responseStatus,
      request_id: requestId,
      ...(status.queue_position && { queuePosition: status.queue_position }),
      ...(resultUrl && { resultUrl }),
      ...(status.error && { 
        error: {
          message: status.error,
          details: status.error,
          suggestions: [
            'Try using example images first',
            'Ensure uploaded images show a clear full-body person',
            'Use images with good lighting and contrast',
            'Avoid images with complex backgrounds'
          ]
        }
      })
    };

    console.log('📊 RunningHub FitDiT status response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error checking RunningHub FitDiT status:', error);
    
    // Handle connection errors gracefully
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            error: 'RunningHub service unavailable',
            details: 'Could not connect to RunningHub API. Please try again later.',
            status: 'FAILED'
          },
          { status: 503 }
        );
      }
      
      if (error.message.includes('NOT_FOUND')) {
        return NextResponse.json(
          { 
            error: 'Request not found',
            details: 'The requested task was not found on RunningHub.',
            status: 'FAILED'
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to check request status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 