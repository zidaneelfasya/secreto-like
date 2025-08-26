import { createClient } from '@/lib/supabase/server';
import { profileServiceServer } from '@/lib/services/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default async function Dashboard() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/auth/login');
  }

  // Check if user has a profile
  const profile = await profileServiceServer.getProfile(user.id);
  
  if (!profile) {
    redirect('/create-profile');
  }

  const messages = await profileServiceServer.getUserMessages(user.id);

  return <DashboardClient profile={profile} messages={messages} />;
}