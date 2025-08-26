'use client';

import { useState, useEffect } from 'react';
import { Profile, Message } from '@/lib/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, MessageSquare } from 'lucide-react';
import SenderHint from '@/components/sender-hint';

interface DashboardClientProps {
  profile: Profile;
  messages: Message[];
}

export default function DashboardClient({ profile, messages }: DashboardClientProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  useEffect(() => {
    setShareLink(`${window.location.origin}/${profile.username}/${profile.id}`);
  }, [profile.username, profile.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  const openLink = () => {
    window.open(shareLink, '_blank');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {profile.display_name}!</h1>
            <p className="text-muted-foreground">Manage your anonymous messages</p>
          </div>
        </div>

        {/* Share Link Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Your Anonymous Message Link
            </CardTitle>
            <CardDescription>
              Share this link with others so they can send you anonymous messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {shareLink}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button> 
                <Button onClick={openLink} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Your Messages ({messages.length})
            </CardTitle>
            <CardDescription>
              Anonymous messages sent to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Share your link to start receiving anonymous messages!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <Badge variant="secondary">Anonymous</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{message.content}</p>
                    <SenderHint message={message} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
