"use client";

import { Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, register, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const next = searchParams.get("next") ?? "/dashboard";
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await signIn(email, password);
      }
      router.push(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{isRegister ? "Create your EcoHabit AI account" : "Welcome back"}</CardTitle>
              <CardDescription>
                {isRegister
                  ? "Track habits, goals, reports, and personalized carbon actions."
                  : "Continue your carbon awareness and behavior-change journey."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={isRegister ? "new-password" : "current-password"}
                id="password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isRegister ? "Create account" : "Sign in"}
            </Button>
          </form>
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              await signInWithGoogle();
              router.push(next);
            }}
            type="button"
            variant="outline"
          >
            Continue with Google
          </Button>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to EcoHabit AI?"}{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Sign in" : "Create one"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
