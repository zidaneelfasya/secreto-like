'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { messageService } from '@/lib/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle } from 'lucide-react';

interface SendMessageFormProps {
  recipientId: string;
  recipientName: string;
}

export default function SendMessageForm({ recipientId, recipientName }: SendMessageFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please write a message');
      return;
    }

    if (message.trim().length < 1) {
      setError('Message is too short');
      return;
    }

    if (message.trim().length > 1000) {
      setError('Message is too long (max 1000 characters)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await messageService.sendMessage(recipientId, message.trim());
      setIsSent(true);
      setMessage('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Message Sent!</h3>
              <p className="text-muted-foreground">
                Your anonymous message has been delivered to {recipientName}.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
                variant="outline"
                className="w-full"
              >
                Send Another Message
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="default"
                className="w-full"
              >
                Create Your Own Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Your Anonymous Message
        </CardTitle>
        <CardDescription>
          Write your message below. It will be sent anonymously to {recipientName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your anonymous message here..."
              className="min-h-[120px] resize-none"
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                Your message will be completely anonymous
              </p>
              <p className="text-xs text-muted-foreground">
                {message.length}/1000
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !message.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Anonymous Message'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="w-full text-sm"
          >
            Want to receive anonymous messages too? Create your own link →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
