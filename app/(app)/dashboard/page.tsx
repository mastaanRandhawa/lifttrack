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
  Play,
  Trophy,
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
  fresh: "bg-muted-foreground/40",
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
  const suggestedTemplate = WORKOUT_TEMPLATES.find((t) => t.id === "ppl-6day");

  const recoveredMuscles = MOCK_MUSCLE_ACTIVATIONS.filter(
    (m) => m.level === "fresh" || m.level === "light"
  );
  const recoveringMuscles = MOCK_MUSCLE_ACTIVATIONS.filter(
    (m) => m.level === "recovering" || m.level === "heavy"
  );

  const topRecommendation = TRAINING_RECOMMENDATIONS[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">{greeting}</p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-0.5">
          {displayName}
        </h1>
      </div>

      {/* ── Hero CTA — above the fold, first interaction ─────────────── */}
      {suggestedTemplate && (
        <div className="mb-6 p-5 rounded-[18px] bg-gradient-to-br from-primary/15 via-primary/8 to-transparent border border-primary/25 relative overflow-hidden">
          {/* Subtle glow */}
          <div
            className="absolute right-0 top-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Recommendation chip */}
          {topRecommendation && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3 border",
                topRecommendation.type === "recover"
                  ? "bg-primary/10 text-primary border-primary/25"
                  : "bg-green-500/10 text-green-400 border-green-500/25"
              )}
            >
              {topRecommendation.type === "recover" ? (
                <AlertCircle className="w-3 h-3 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3 h-3 shrink-0" />
              )}
              {topRecommendation.message}
            </div>
          )}

          <h2 className="font-heading text-xl font-bold text-foreground mb-0.5 relative z-10">
            Next Up: Push B
          </h2>
          <p className="text-sm text-muted-foreground mb-4 relative z-10">
            {suggestedTemplate.estimatedMinutes} min &middot;{" "}
            {suggestedTemplate.days[0].exercises.length} exercises &middot;{" "}
            {suggestedTemplate.name}
          </p>

          <Link href={`/workout/${suggestedTemplate.id}`} className="relative z-10">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto">
              <Play className="w-4 h-4 fill-current" />
              Start Workout
            </Button>
          </Link>
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      {/* On mobile: 2-col; desktop: 4-col. Only show two on mobile (streak + this week — most actionable) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Streak"
          value={`${user?.currentStreak ?? 8}`}
          unit="days"
          icon={<Flame className="w-4 h-4 text-amber-400" />}
          highlight
        />
        <StatCard
          label="This Week"
          value="3"
          unit="sessions"
          icon={<Activity className="w-4 h-4 text-green-400" />}
        />
        <StatCard
          label="Sessions"
          value={`${user?.totalSessions ?? 142}`}
          unit="total"
          icon={<Dumbbell className="w-4 h-4 text-primary" />}
          className="hidden lg:block"
        />
        <StatCard
          label="Volume"
          value="245K"
          unit="kg total"
          icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
          className="hidden lg:block"
        />
      </div>

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left / main ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Last session */}
          <section aria-label="Last session" className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                Last Session
              </h2>
              <Link
                href="/progress"
                className="text-sm text-primary hover:underline flex items-center gap-0.5"
                aria-label="View all sessions"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {lastSession ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{lastSession.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatDate(lastSession.startedAt)} &middot; {lastSession.durationMinutes}
                    min &middot;{" "}
                    {(lastSession.totalVolume ?? 0).toLocaleString()} kg
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {lastSession.exercises.reduce(
                    (acc, ex) => acc + ex.sets.filter((s) => !s.isWarmup).length,
                    0
                  )}{" "}
                  sets
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No sessions yet — start your first workout above.</p>
            )}
          </section>

          {/* PRs */}
          <section aria-label="Personal records" className="p-5 rounded-[18px] bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Recent PRs
              </h2>
              <Link
                href="/progress"
                className="text-sm text-primary hover:underline flex items-center gap-0.5"
              >
                Progress <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {PERSONAL_RECORDS.length > 0 ? (
              <div className="divide-y divide-border">
                {PERSONAL_RECORDS.slice(0, 3).map((pr) => (
                  <div
                    key={pr.exerciseId}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-sm font-medium text-foreground truncate">
                        {pr.exerciseName}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(pr.achievedAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        {pr.weight}kg &times; {pr.reps}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        e1RM: {pr.estimatedOneRepMax}kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No PRs recorded yet.</p>
            )}
          </section>
        </div>

        {/* ── Right / sidebar ──────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Recovery / muscle status */}
          <section aria-label="Muscle status" className="p-5 rounded-[18px] bg-card border border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Activity className="w-3.5 h-3.5" />
              Muscle Status
            </h2>

            {recoveredMuscles.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Ready to train ({recoveredMuscles.length})
                </p>
                <div className="space-y-2">
                  {recoveredMuscles.slice(0, 4).map((m) => (
                    <MuscleRow key={m.muscleId} muscle={m} />
                  ))}
                </div>
              </div>
            )}

            {recoveringMuscles.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Still recovering ({recoveringMuscles.length})
                </p>
                <div className="space-y-2">
                  {recoveringMuscles.slice(0, 3).map((m) => (
                    <MuscleRow key={m.muscleId} muscle={m} />
                  ))}
                </div>
              </div>
            )}

            <Link href="/body-map" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full gap-2">
                Full Body Map <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </section>

          {/* Quick actions — desktop only, redundant on mobile where nav covers this */}
          <section aria-label="Quick actions" className="hidden lg:block p-5 rounded-[18px] bg-card border border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </p>
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
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  icon,
  highlight = false,
  className,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-4 rounded-[18px] border",
        highlight ? "bg-primary/8 border-primary/25" : "bg-card border-border",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {icon}
      </div>
      {/* Large value + small unit — visual hierarchy */}
      <div className="flex items-baseline gap-1">
        <p className="font-heading text-2xl font-bold text-foreground leading-none">
          {value}
        </p>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
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
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            ACTIVATION_DOT[muscle.level]
          )}
          aria-hidden="true"
        />
        <span className="text-sm text-foreground truncate">{muscleName}</span>
      </div>
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0",
          ACTIVATION_COLORS[muscle.level]
        )}
      >
        {muscle.level}
      </span>
    </div>
  );
}
