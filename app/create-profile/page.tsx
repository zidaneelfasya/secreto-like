'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileServiceClient } from '@/lib/services/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateProfile() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!username.trim()) {
        throw new Error('Username is required');
      }

      // Validate username format (alphanumeric and underscores only)
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }

      await profileServiceClient.createProfile(username.trim(), displayName.trim() || username.trim());
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>
            Choose a username to create your anonymous message link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be part of your link: secreto.com/{username}
              </p>
            </div>
            
            <div>
              <Label htmlFor="displayName">Display Name (Optional)</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Display Name"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
