import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">
                Check Your Email
              </CardTitle>
              <CardDescription>We&apos;ve sent you a verification link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We&apos;ve sent a verification link to your email address. Click the link in the email to activate your account and start creating your anonymous message link.
              </p>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Continue to Login
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
