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
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientId,
        content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    const result = await response.json();
    return result.data;
  }
};
