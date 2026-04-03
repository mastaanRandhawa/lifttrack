"use client";

import Link from "next/link";
import {
  Flame,
  Dumbbell,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Zap,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";
import {
  MOCK_MUSCLE_ACTIVATIONS,
  PERSONAL_RECORDS,
  SESSION_HISTORY,
  TRAINING_RECOMMENDATIONS,
  WORKOUT_TEMPLATES,
} from "@/lib/mock-data";
import type { MuscleActivation } from "@/types";
import { cn } from "@/lib/utils";

const ACTIVATION_COLORS: Record<string, string> = {
  fresh: "bg-muted text-muted-foreground",
  light: "bg-green-500/15 text-green-400",
  moderate: "bg-amber-500/15 text-amber-400",
  heavy: "bg-red-500/15 text-red-400",
  recovering: "bg-primary/15 text-primary",
};

const ACTIVATION_DOT: Record<string, string> = {
  fresh: "bg-muted-foreground",
  light: "bg-green-400",
  moderate: "bg-amber-400",
  heavy: "bg-red-400",
  recovering: "bg-primary",
};

function formatDate(date: Date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

export default function DashboardPage() {
  const { user } = useUserStore();
  const displayName = user?.displayName ?? "Lifter";
  const lastSession = SESSION_HISTORY[0];
  const todayTemplate = WORKOUT_TEMPLATES.find((t) => t.splitType === "ppl");
  const suggestedTemplate = WORKOUT_TEMPLATES.find((t) => t.id === "ppl-6day");

  const recoveredMuscles = MOCK_MUSCLE_ACTIVATIONS.filter((m) => m.level === "fresh" || m.level === "light");
  const recoveringMuscles = MOCK_MUSCLE_ACTIVATIONS.filter((m) => m.level === "recovering" || m.level === "heavy");

  const topRecommendation = TRAINING_RECOMMENDATIONS[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-sm">{greeting},</p>
        <h1 className="font-heading text-3xl font-bold text-foreground mt-1">
          {displayName} <span className="text-muted-foreground font-normal">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your training overview for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Streak"
          value={`${user?.currentStreak ?? 8} days`}
          icon={<Flame className="w-5 h-5 text-amber-400" />}
          highlight
        />
        <StatCard
          label="Total Sessions"
          value={`${user?.totalSessions ?? 142}`}
          icon={<Dumbbell className="w-5 h-5 text-primary" />}
        />
        <StatCard
          label="This Week"
          value="3 sessions"
          icon={<Activity className="w-5 h-5 text-green-400" />}
        />
        <StatCard
          label="Total Volume"
          value="245,680 kg"
          icon={<TrendingUp className="w-5 h-5 text-violet" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's recommendation */}
          <div className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today&apos;s Recommendation</span>
            </div>

            {topRecommendation && (
              <div className={cn(
                "p-4 rounded-xl border mb-4",
                topRecommendation.type === "recover" ? "bg-primary/8 border-primary/20" : "bg-green-500/8 border-green-500/20"
              )}>
                <div className="flex items-start gap-3">
                  {topRecommendation.type === "recover" ? (
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-foreground">{topRecommendation.message}</p>
                </div>
              </div>
            )}

            {suggestedTemplate && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                <div>
                  <p className="font-semibold text-foreground">Next Up: Push B</p>
                  <p className="text-sm text-muted-foreground">{suggestedTemplate.estimatedMinutes} min · {suggestedTemplate.days[0].exercises.length} exercises</p>
                </div>
                <Link href={`/workout/${suggestedTemplate.id}`}>
                  <Button size="sm" className="gap-1.5">
                    Start <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Last Session */}
          <div className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Session</span>
              </div>
              <Link href="/progress" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {lastSession && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{lastSession.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(lastSession.startedAt)} · {lastSession.durationMinutes}min · {(lastSession.totalVolume ?? 0).toLocaleString()} kg
                  </p>
                </div>
                <Badge variant="secondary">
                  {lastSession.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => !s.isWarmup).length, 0)} sets
                </Badge>
              </div>
            )}
          </div>

          {/* PRs */}
          <div className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent PRs</span>
              </div>
              <Link href="/progress" className="text-sm text-primary hover:underline flex items-center gap-1">
                Progress <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {PERSONAL_RECORDS.slice(0, 3).map((pr) => (
                <div key={pr.exerciseId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(pr.achievedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{pr.weight}kg × {pr.reps}</p>
                    <p className="text-xs text-muted-foreground">e1RM: {pr.estimatedOneRepMax}kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Recovery panel */}
          <div className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Muscle Status</span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs text-muted-foreground font-medium">Ready to train</p>
              {recoveredMuscles.slice(0, 4).map((m) => (
                <MuscleRow key={m.muscleId} muscle={m} />
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Still recovering</p>
              {recoveringMuscles.slice(0, 3).map((m) => (
                <MuscleRow key={m.muscleId} muscle={m} />
              ))}
            </div>

            <Link href="/body-map" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full gap-2">
                View Body Map <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="p-5 rounded-[18px] bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</p>
            <div className="space-y-2">
              <Link href="/workout">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Dumbbell className="w-4 h-4" />
                  Browse Templates
                </Button>
              </Link>
              <Link href="/exercises">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <TrendingUp className="w-4 h-4" />
                  Exercise Library
                </Button>
              </Link>
              <Link href="/body-map">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Activity className="w-4 h-4" />
                  Anatomy View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "p-4 rounded-[18px] border",
      highlight ? "bg-primary/8 border-primary/25" : "bg-card border-border"
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {icon}
      </div>
      <p className="font-heading text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function MuscleRow({ muscle }: { muscle: MuscleActivation }) {
  const muscleName = muscle.muscleId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full shrink-0", ACTIVATION_DOT[muscle.level])} />
        <span className="text-sm text-foreground">{muscleName}</span>
      </div>
      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", ACTIVATION_COLORS[muscle.level])}>
        {muscle.level}
      </span>
    </div>
  );
}
