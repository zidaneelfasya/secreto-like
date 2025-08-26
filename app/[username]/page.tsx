import { profileServiceServer } from '@/lib/services/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  
  const profile = await profileServiceServer.getProfileByUsername(username);
  
  if (!profile) {
    notFound();
  }

  const messageLink = `/${profile.username}/${profile.message_link_uuid}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {profile.display_name || profile.username}
            </CardTitle>
            <CardDescription>
              @{profile.username}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <MessageSquare className="h-12 w-12 text-purple-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Send Anonymous Message</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Send an anonymous message to {profile.display_name || profile.username}
                </p>
              </div>
              
              <Button asChild size="lg" className="w-full">
                <Link href={messageLink}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Your Own Link
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = await profileServiceServer.getProfileByUsername(username);
  
  if (!profile) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${profile.display_name || profile.username} - Secreto`,
    description: `Send an anonymous message to ${profile.display_name || profile.username} on Secreto`,
  };
}
