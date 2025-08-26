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
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        recipient_id: recipientId,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
