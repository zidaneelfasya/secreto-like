'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { messageService } from '@/lib/services/client';
import { validateMessageContent, validateRecipientId, sanitizeMessage } from '@/lib/validation';
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
    
    // Validate recipient ID
    const recipientValidation = validateRecipientId(recipientId);
    if (!recipientValidation.isValid) {
      setError(recipientValidation.error || 'Invalid recipient');
      return;
    }

    // Validate message content
    const contentValidation = validateMessageContent(message);
    if (!contentValidation.isValid) {
      setError(contentValidation.error || 'Invalid message');
      return;
    }

    const sanitizedMessage = sanitizeMessage(message);

    setIsLoading(true);
    setError('');

    try {
      await messageService.sendMessage(recipientId, sanitizedMessage);
      setIsSent(true);
      setMessage('');
    } catch (err: unknown) {
      console.error('Send message error:', err);
      let errorMessage = 'Failed to send message';
      
      if (err instanceof Error) {
        if (err.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('Empty response')) {
          errorMessage = 'Server connection error. Please try again in a moment.';
        } else if (err.message.includes('Invalid response')) {
          errorMessage = 'Server communication error. Please refresh and try again.';
        } else if (err.message.includes('Invalid recipient ID')) {
          errorMessage = 'Invalid recipient. Please check the link and try again.';
        } else if (err.message.includes('fetch')) {
          errorMessage = 'Connection failed. Please check your internet and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <Card>
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-700">Message Sent!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your anonymous message has been delivered to{' '}
                <span className="font-medium break-words">{recipientName}</span>.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Button
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
                variant="outline"
                className="w-full h-11"
              >
                Send Another Message
              </Button>
              <Button
                onClick={() => router.push('/login')}
                variant="default"
                className="w-full h-11"
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
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Send className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="break-words">Your Anonymous Message</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Write your message below. It will be sent anonymously to{' '}
          <span className="font-medium break-words">{recipientName}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message" className="text-sm font-medium">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your anonymous message here..."
              className="min-h-[120px] resize-none mt-2"
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-xs text-muted-foreground">
                Your message will be completely anonymous
              </p>
              <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {message.length}/1000
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200 break-words">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-11" disabled={isLoading || !message.trim()}>
            <Send className="h-4 w-4 mr-2 flex-shrink-0" />
            {isLoading ? 'Sending...' : 'Send Anonymous Message'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="w-full text-sm text-center px-2 py-3 h-auto"
          >
            <span className="hidden md:inline">
              Want to receive anonymous messages too? Create your own link →
            </span>
            <span className="hidden sm:inline md:hidden">
              Want to receive anonymous messages too?
            </span>
            <span className="sm:hidden">
              Create your own link →
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
