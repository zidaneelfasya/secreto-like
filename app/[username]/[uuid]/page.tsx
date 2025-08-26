import { profileServiceServer } from '@/lib/services/server';
import { notFound } from 'next/navigation';
import SendMessageForm from './send-message-form';
import ErrorBoundary from '@/components/error-boundary';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
            Send Anonymous Message
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            to <span className="font-semibold break-words">{profile.display_name}</span>
          </p>
        </div>
        
        <ErrorBoundary>
          <SendMessageForm recipientId={profile.id} recipientName={profile.display_name || profile.username} />
        </ErrorBoundary>
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
