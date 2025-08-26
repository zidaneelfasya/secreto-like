import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Log comprehensive request info
    const requestInfo = {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      contentType: request.headers.get('content-type'),
      accept: request.headers.get('accept'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      xForwardedFor: request.headers.get('x-forwarded-for'),
      xRealIp: request.headers.get('x-real-ip'),
    };
    
    console.log('Mobile Debug - Request Info:', requestInfo);
    
    // Try to read body
    let bodyData = null;
    let bodyError = null;
    
    try {
      const rawBody = await request.text();
      console.log('Mobile Debug - Raw Body:', rawBody);
      
      if (rawBody) {
        bodyData = JSON.parse(rawBody);
        console.log('Mobile Debug - Parsed Body:', bodyData);
      }
    } catch (error) {
      bodyError = error instanceof Error ? error.message : 'Unknown error';
      console.error('Mobile Debug - Body Error:', bodyError);
    }
    
    // Create response
    const responseData = {
      success: true,
      message: 'Mobile debug endpoint working',
      timestamp: new Date().toISOString(),
      requestInfo,
      bodyData,
      bodyError,
    };
    
    console.log('Mobile Debug - Response:', responseData);
    
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    });
    
  } catch (error) {
    console.error('Mobile Debug - Error:', error);
    
    return new NextResponse(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET() {
  return new NextResponse(JSON.stringify({
    message: 'Mobile debug endpoint is working',
    timestamp: new Date().toISOString(),
    method: 'GET',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}
