import { createClient as createServerClient } from '@/lib/supabase/server';

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

// Server-side functions (for use in server components)
export const profileServiceServer = {
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async getProfileByUsername(username: string): Promise<Profile | null> {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) return null;
    return data;
  },

  async getUserMessages(userId: string): Promise<Message[]> {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
