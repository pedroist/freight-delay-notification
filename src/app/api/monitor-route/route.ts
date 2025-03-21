import { NextRequest, NextResponse } from 'next/server';
import { monitorRoute } from '@/lib/temporal/client';
import { ApiResponse, MonitoringResult, RouteData } from '@/types';

export async function GET() {
  return NextResponse.json(
    { 
      success: true, 
      message: "Freight monitoring API is working!" 
    },
    { status: 200 }
  );
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<MonitoringResult>>> {
  try {
    const routeData: RouteData = await request.json();
    
    // Validate input
    if (!routeData.origin || !routeData.destination || !routeData.customerEmail || !routeData.customerName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Execute the monitoring workflow
    const result = await monitorRoute(routeData);
    
    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error monitoring route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to monitor route' },
      { status: 500 }
    );
  }
} 