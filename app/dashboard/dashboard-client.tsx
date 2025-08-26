'use client';

import { useState, useEffect } from 'react';
import { Profile, Message } from '@/lib/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, MessageSquare } from 'lucide-react';

interface DashboardClientProps {
  profile: Profile;
  messages: Message[];
}

export default function DashboardClient({ profile, messages }: DashboardClientProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  useEffect(() => {
    setShareLink(`${window.location.origin}/${profile.username}`);
  }, [profile.username]);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile.display_name}!</h1>
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
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                {shareLink}
              </div>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button onClick={openLink} variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
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
                    <div className="flex justify-between items-start mb-2">
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
                    <p className="text-sm leading-relaxed">{message.content}</p>
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
