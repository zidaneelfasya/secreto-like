import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateMessageContent, validateRecipientId, sanitizeMessage } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Log request info for debugging mobile issues
    console.log('API Request:', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      contentType: request.headers.get('content-type')
    });

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Invalid content type:', contentType);
      return new NextResponse(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let body;
    try {
      // Clone the request to avoid "body already read" errors
      const requestClone = request.clone();
      const rawBody = await requestClone.text();
      console.log('Raw body received:', rawBody?.substring(0, 100) + '...');
      
      if (!rawBody || rawBody.trim() === '') {
        console.log('Empty body received');
        return new NextResponse(JSON.stringify({ error: 'Empty request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      body = JSON.parse(rawBody);
      console.log('Body parsed successfully:', { recipientId: body.recipientId, contentLength: body.content?.length });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return new NextResponse(JSON.stringify({ error: 'Invalid JSON format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { recipientId, content } = body;
    
    // Validate recipient ID
    const recipientValidation = validateRecipientId(recipientId);
    if (!recipientValidation.isValid) {
      return new NextResponse(JSON.stringify({ error: recipientValidation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate and sanitize content
    const contentValidation = validateMessageContent(content);
    if (!contentValidation.isValid) {
      return new NextResponse(JSON.stringify({ error: contentValidation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sanitizedContent = sanitizeMessage(content);

    // Get sender information
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Simple location detection based on headers (you might want to use a proper geolocation service)
    const acceptLanguage = request.headers.get('accept-language') || '';
    const location = acceptLanguage.split(',')[0] || 'unknown';

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        recipient_id: recipientId,
        content: sanitizedContent,
        sender_ip: ip,
        sender_user_agent: userAgent,
        sender_location: location,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Message sent successfully');
    return new NextResponse(JSON.stringify({ 
      message: 'Message sent successfully', 
      data,
      success: true 
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
