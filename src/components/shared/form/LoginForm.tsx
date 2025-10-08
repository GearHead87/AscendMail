"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email(
        {
          /**
           * The user email
           */
          email: form.email,
          /**
           * The user password
           */
          password: form.password,
          /**
           * A URL to redirect to after the user verifies their email (optional)
           */
          callbackURL: callbackUrl,
          /**
           * remember the user session after the browser is closed.
           * @default true
           */
          rememberMe: false,
        },
        {
          onSuccess: (ctx) => {
            router.push(callbackUrl);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );

      console.log("LoginForm data", data, error);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social(
        {
          /**
           * The social provider ID
           * @example "github", "google", "apple"
           */
          provider: "google",
          /**
           * A URL to redirect after the user authenticates with the provider
           * @default "/"
           */
          callbackURL: callbackUrl,
          /**
           * A URL to redirect if an error occurs during the sign in process
           */
          errorCallbackURL: callbackUrl,
          /**
           * A URL to redirect if the user is newly registered
           */
          newUserCallbackURL: callbackUrl,
        },
        {
          onSuccess: (ctx) => {
            router.push(callbackUrl);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (err) {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* <Button
                onClick={handleGoogle}
                variant="outline"
                size="lg"
                className="bg-background hover:bg-accent w-full"
                disabled={googleLoading}
            >
                {googleLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                    <FcGoogle className="mr-2 size-5" />
                )}
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button> */}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
