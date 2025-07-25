import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_API_KEY || 'your_fal_api_key_here'
});

type GarmentType = 'upper_body' | 'lower_body' | 'dresses';

interface TryOnRequest {
  human_image_url: string;
  garment_image_url: string;
  garment_type: GarmentType;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TryOnRequest = await request.json();
    
    const { 
      human_image_url, 
      garment_image_url, 
      garment_type,
      num_inference_steps = 50,
      guidance_scale = 2.5,
      seed
    } = body;

    // Validate required fields
    if (!human_image_url || !garment_image_url || !garment_type) {
      return NextResponse.json(
        { error: 'Missing required fields: human_image_url, garment_image_url, garment_type' },
        { status: 400 }
      );
    }

    // Validate garment type
    if (!['upper_body', 'lower_body', 'dresses'].includes(garment_type)) {
      return NextResponse.json(
        { error: 'Invalid garment_type. Must be upper_body, lower_body, or dresses' },
        { status: 400 }
      );
    }

    console.log('Starting virtual try-on with fal.ai:', {
      human_image_url,
      garment_image_url,
      garment_type,
      num_inference_steps,
      guidance_scale
    });

    // Submit request to fal.ai
    const result = await fal.queue.submit('fal-ai/leffa/virtual-tryon', {
      input: {
        human_image_url,
        garment_image_url,
        garment_type,
        num_inference_steps,
        guidance_scale,
        ...(seed && { seed }),
        enable_safety_checker: true,
        output_format: 'png'
      }
    });

    console.log('fal.ai response:', result);

    return NextResponse.json({
      request_id: result.request_id,
      status: 'IN_QUEUE',
      message: 'Virtual try-on request submitted successfully'
    });

  } catch (error) {
    console.error('Error in virtual try-on API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process virtual try-on request',
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
    // Check status of the request
    const status = await fal.queue.status('fal-ai/leffa/virtual-tryon', {
      requestId
    });

    console.log('Status check for request:', requestId, status);

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check request status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 