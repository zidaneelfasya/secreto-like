import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { profileServiceServer } from "@/lib/services/server"; // Import the server service
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Share2, Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is logged in, check if they have a profile
  if (user) {
    // Use the server-side service function
    const profile = await profileServiceServer.getProfile(user.id);
    if (profile) {
      redirect('/dashboard');
    } else {
      redirect('/create-profile');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Secreto
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Secreto
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Receive anonymous messages from friends, colleagues, or anyone. Create your unique link and discover what people really think.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Anonymous Messages</CardTitle>
                <CardDescription>
                  Receive honest feedback and messages without revealing the sender&apos;s identity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Share2 className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Easy Sharing</CardTitle>
                <CardDescription>
                  Get a personalized link that you can share anywhere - social media, bio links, or directly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Completely Private</CardTitle>
                <CardDescription>
                  Messages are completely anonymous. We don&apos;t track or store any information about senders
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How it works */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold">Sign Up</h3>
                <p className="text-muted-foreground">Create your account and choose a unique username</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-pink-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold">Share Your Link</h3>
                <p className="text-muted-foreground">Share your personalized link with friends and followers</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold">Receive Messages</h3>
                <p className="text-muted-foreground">Get anonymous messages and feedback in your dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p className="text-muted-foreground">
            Made with ❤️ using Next.js and Supabase
          </p>
        </footer>
      </div>
    </main>
  );
}