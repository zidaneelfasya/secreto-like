import { createClient } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  recipient_id: string;
  content: string;
  sender_ip: string | null;
  sender_user_agent: string | null;
  sender_location: string | null;
  created_at: string;
}

// Client-side functions (for use in client components)
export const profileServiceClient = {
  async createProfile(username: string, displayName?: string): Promise<Profile | null> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        display_name: displayName || username,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const messageService = {
  async sendMessage(recipientId: string, content: string): Promise<Message | null> {
    try {
      console.log('Sending message from client:', { recipientId, contentLength: content.length });
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          content,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Check if response is empty or not ok first
      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          if (errorText) {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `Server error: ${response.status}`);
          } else {
            throw new Error(`Server error: ${response.status} - ${response.statusText}`);
          }
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      console.log('Response text length:', responseText.length);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Response parsed successfully:', responseData);
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError);
        console.error('Raw response:', responseText);
        throw new Error('Invalid response from server');
      }

      return responseData.data;
    } catch (error) {
      console.error('Send message error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.');
        }
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      
      throw error;
    }
  }
};
