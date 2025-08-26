import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX, Home, UserPlus } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <UserX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-2xl">Message Link Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This message link doesn&apos;t exist or has been disabled.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/sign-up">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Your Own Link
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
