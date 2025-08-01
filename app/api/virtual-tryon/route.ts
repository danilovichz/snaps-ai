import { NextRequest, NextResponse } from 'next/server';
import { runningHubClient, FitDiTWorkflowParams } from '@/utils/runninghub-client';

type GarmentType = 'upper_body' | 'lower_body' | 'dresses';

interface TryOnRequest {
  human_image_url: string;
  garment_image_url: string;
  garment_type: GarmentType;
  n_steps?: number;
  image_scale?: number;
  seed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TryOnRequest = await request.json();
    
    const { 
      human_image_url, 
      garment_image_url, 
      garment_type,
      n_steps = 20,
      image_scale = 2,
      seed
    } = body;

    // Validate required fields
    if (!human_image_url || !garment_image_url || !garment_type) {
      return NextResponse.json(
        { error: 'Missing required fields: human_image_url, garment_image_url, garment_type' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting FitDiT virtual try-on on RunningHub:', {
      garment_type,
      n_steps,
      image_scale,
      seed: seed || 'random'
    });

    // Prepare parameters for RunningHub
    const params: FitDiTWorkflowParams = {
      human_image: human_image_url,
      garment_image: garment_image_url,
      garment_type,
      n_steps,
      image_scale,
      seed
    };

    // Start the FitDiT workflow on RunningHub
    const result = await runningHubClient.executeFitDiTWorkflow(params);
    
    if (result.status === 'failed') {
      console.error('❌ RunningHub FitDiT workflow failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'FitDiT workflow failed' },
        { status: 500 }
      );
    }

    console.log('✅ FitDiT workflow started on RunningHub, task_id:', result.task_id);

    // Return the request ID for status checking
    return NextResponse.json({
      request_id: result.task_id,
      status: 'IN_PROGRESS',
      message: 'FitDiT virtual try-on started successfully on RunningHub cloud'
    });

  } catch (error) {
    console.error('❌ Virtual try-on API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('requestId');

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
        resultUrl = status.result_url;
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
    
    return NextResponse.json(
      { 
        error: 'Failed to check request status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 