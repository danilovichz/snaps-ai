import { NextRequest, NextResponse } from 'next/server';
import { runningHubClient } from '../../../../../src/utils/runninghub-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    
    console.log(`🎯 Getting results for task: ${requestId}`);
    
    const results = await runningHubClient.getResults(requestId);
    
    console.log('📥 Results fetched:', results);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('❌ Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
} 