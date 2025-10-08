"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/shared/form/LoginForm";

function LoginCard() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <div className="text-muted-foreground text-center text-sm">
              <p>
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="text-muted-foreground text-center text-sm">
              <Link
                href="/forgot-password"
                className="hover:text-foreground underline underline-offset-4"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="hover:text-foreground font-medium underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginCard />
    </Suspense>
  );
}
