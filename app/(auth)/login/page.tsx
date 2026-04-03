"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(data.email);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — branding panel (desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 bg-gradient-to-br from-background via-primary/5 to-violet/10 border-r border-border relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">LiftTrack</span>
        </div>

        <div className="space-y-6 relative z-10">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground leading-tight">
              Train smarter.<br />
              <span className="text-primary">Recover better.</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              The first gym app that shows you exactly what you trained, what is recovering, and what to train next.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["Muscle heatmap", "Recovery tracking", "Progress analytics", "Smart recommendations"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground relative z-10">
          © 2026 LiftTrack. Built for serious lifters.
        </p>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">LiftTrack</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to continue your training journey.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-8 p-4 rounded-2xl bg-surface border border-border text-sm text-muted-foreground">
            <strong className="text-foreground">Demo mode:</strong> Enter any email and a password with 8+ characters to explore the app.
          </div>
        </div>
      </div>
    </div>
  );
}
