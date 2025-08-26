import { profileServiceServer } from '@/lib/services/server';
import { notFound } from 'next/navigation';
import SendMessageForm from './send-message-form';

interface PageProps {
  params: Promise<{ username: string; uuid: string }>;
}

export default async function SendMessagePage({ params }: PageProps) {
  const { username, uuid } = await params;
  
  const profile = await profileServiceServer.getProfileByUsernameAndUuid(username, uuid);
  
  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Send Anonymous Message
          </h1>
          <p className="text-muted-foreground">
            to <span className="font-semibold">{profile.display_name}</span>
          </p>
        </div>
        
        <SendMessageForm recipientId={profile.id} recipientName={profile.display_name || profile.username} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { username, uuid } = await params;
  const profile = await profileServiceServer.getProfileByUsernameAndUuid(username, uuid);
  
  if (!profile) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `Send Anonymous Message to ${profile.display_name || profile.username}`,
    description: `Send an anonymous message to ${profile.display_name || profile.username} on Secreto`,
  };
}
