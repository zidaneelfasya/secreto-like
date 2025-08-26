import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateMessageContent, validateRecipientId, sanitizeMessage } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    let body;
    try {
      const rawBody = await request.text();
      body = JSON.parse(rawBody);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const { recipientId, content } = body;
    
    // Validate recipient ID
    const recipientValidation = validateRecipientId(recipientId);
    if (!recipientValidation.isValid) {
      return NextResponse.json({ error: recipientValidation.error }, { status: 400 });
    }
    
    // Validate and sanitize content
    const contentValidation = validateMessageContent(content);
    if (!contentValidation.isValid) {
      return NextResponse.json({ error: contentValidation.error }, { status: 400 });
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
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Message sent successfully', 
      data,
      success: true 
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
