import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test endpoint called');
    
    // Log all headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Request headers:', headers);
    
    // Get the raw body first
    const rawBody = await request.text();
    console.log('Raw body:', rawBody);
    
    if (!rawBody) {
      return NextResponse.json({ 
        error: 'Empty request body',
        headers: headers,
      }, { status: 400 });
    }
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'JSON parse error',
        rawBody: rawBody,
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        headers: headers,
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Mobile test successful',
      receivedData: parsedBody,
      headers: headers,
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString(),
  });
}
