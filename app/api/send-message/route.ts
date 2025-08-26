import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { recipientId, content } = await request.json();
    
    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
        content: content.trim(),
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

    return NextResponse.json({ message: 'Message sent successfully', data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
