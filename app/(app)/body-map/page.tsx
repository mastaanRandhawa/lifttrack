"use client";

import { useBodyMapStore } from "@/lib/store";
import { MUSCLE_DETAILS } from "@/lib/mock-data";
import { BodyMapSvg } from "@/components/body-map/BodyMapSvg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  X,
  Calendar,
  Activity,
  Dumbbell,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import type { BodyView, DateRangeFilter, MuscleActivation, MuscleDetail } from "@/types";
import Link from "next/link";

const DATE_FILTERS: { id: DateRangeFilter; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "last-workout", label: "Last Workout" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "Month" },
];

const LEGEND = [
  { level: "fresh", label: "Fresh", color: "bg-muted-foreground/30" },
  { level: "light", label: "Light", color: "bg-green-400" },
  { level: "moderate", label: "Moderate", color: "bg-amber-400" },
  { level: "heavy", label: "Heavy", color: "bg-red-400" },
  { level: "recovering", label: "Recovering", color: "bg-primary" },
];

const LEVEL_BG: Record<string, string> = {
  fresh: "bg-muted text-muted-foreground",
  light: "bg-green-500/15 text-green-400",
  moderate: "bg-amber-500/15 text-amber-400",
  heavy: "bg-red-500/15 text-red-400",
  recovering: "bg-primary/15 text-primary",
};

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86400000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

export default function BodyMapPage() {
  const {
    view,
    dateRange,
    selectedMuscle,
    muscleActivations,
    setView,
    setDateRange,
    selectMuscle,
  } = useBodyMapStore();

  const detail = selectedMuscle ? MUSCLE_DETAILS[selectedMuscle] : null;
  const activation = muscleActivations.find(
    (a) => a.muscleId === selectedMuscle
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Body Map
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Tap a muscle group to see its training status.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* ── Left — controls + SVG ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Controls row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Front / Back toggle */}
            <div
              className="flex items-center gap-0.5 p-1 rounded-xl bg-card border border-border"
              role="radiogroup"
              aria-label="Body view"
            >
              {(["front", "back"] as BodyView[]).map((v) => (
                <button
                  key={v}
                  role="radio"
                  aria-checked={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-5 py-2 rounded-lg text-sm font-medium transition-all min-w-[72px]",
                    view === v
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Date range pills */}
            <div
              className="flex items-center gap-1.5 flex-wrap"
              role="group"
              aria-label="Date range"
            >
              {DATE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDateRange(f.id)}
                  aria-pressed={dateRange === f.id}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    dateRange === f.id
                      ? "bg-primary/15 text-primary border-primary/40"
                      : "text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG card */}
          <div className="p-4 sm:p-6 rounded-[18px] bg-card border border-border">
            <div className="flex gap-6 items-start">
              <div className="flex-1 flex items-center justify-center">
                <BodyMapSvg
                  view={view}
                  activations={muscleActivations}
                  selectedMuscle={selectedMuscle}
                  onMuscleClick={(id) =>
                    selectMuscle(selectedMuscle === id ? null : id)
                  }
                />
              </div>

              {/* Legend — sidebar on ≥sm */}
              <div className="shrink-0 hidden sm:block pt-2" aria-label="Activation legend">
                <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wider">
                  Status
                </p>
                <div className="space-y-3">
                  {LEGEND.map((l) => (
                    <div key={l.level} className="flex items-center gap-2.5">
                      <span
                        className={cn("w-3 h-3 rounded-full shrink-0", l.color)}
                        aria-hidden="true"
                      />
                      <span className="text-xs text-muted-foreground">
                        {l.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile legend row */}
            <div
              className="flex items-center gap-3 flex-wrap mt-4 pt-4 border-t border-border sm:hidden"
              aria-label="Activation legend"
            >
              {LEGEND.map((l) => (
                <div key={l.level} className="flex items-center gap-1.5">
                  <span
                    className={cn("w-2.5 h-2.5 rounded-full", l.color)}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Desktop right panel (≥ lg) ───────────────────────────── */}
        <div className="hidden lg:block">
          {detail && activation ? (
            <MuscleDetailCard
              detail={detail}
              activation={activation}
              onClose={() => selectMuscle(null)}
            />
          ) : (
            <EmptyMusclePanel
              activations={muscleActivations}
              onSelect={selectMuscle}
              levelBg={LEVEL_BG}
            />
          )}
        </div>
      </div>

      {/* ── Mobile bottom sheet ────────────────────────────────────── */}
      {/* Renders over the page when a muscle is selected on mobile */}
      {detail && activation && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40">
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => selectMuscle(null)}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div
            className="relative bg-card border-t border-border rounded-t-[24px] max-h-[75vh] overflow-y-auto pb-[env(safe-area-inset-bottom,16px)]"
            role="dialog"
            aria-label={`${detail.displayName} details`}
          >
            {/* Drag handle */}
            <div
              className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-4"
              aria-hidden="true"
            />
            <div className="px-5 pb-5">
              <MuscleDetailCard
                detail={detail}
                activation={activation}
                onClose={() => selectMuscle(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MuscleDetailCard ──────────────────────────────────────────────────────

function MuscleDetailCard({
  detail,
  activation,
  onClose,
}: {
  detail: MuscleDetail;
  activation: MuscleActivation;
  onClose: () => void;
}) {
  const LEVEL_BADGE: Record<string, string> = {
    fresh: "border-muted-foreground/40 text-muted-foreground",
    light: "border-green-500/40 text-green-400",
    moderate: "border-amber-500/40 text-amber-400",
    heavy: "border-red-500/40 text-red-400",
    recovering: "border-primary/40 text-primary",
  };

  return (
    <div className="p-5 rounded-[18px] bg-card border border-border lg:sticky lg:top-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            {detail.displayName}
          </h3>
          <Badge
            variant="outline"
            className={cn("mt-1.5 text-xs capitalize", LEVEL_BADGE[activation.level])}
          >
            {activation.level}
          </Badge>
        </div>
        <button
          onClick={onClose}
          aria-label="Close muscle detail"
          className="p-2 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Recovery progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            Recovery
          </span>
          <span
            className="font-semibold text-foreground"
            aria-label={`Recovery: ${detail.recoveryPercent}%`}
          >
            {detail.recoveryPercent}%
          </span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            role="progressbar"
            aria-valuenow={detail.recoveryPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
              "h-full rounded-full transition-all duration-500",
              detail.recoveryPercent >= 80
                ? "bg-green-400"
                : detail.recoveryPercent >= 50
                ? "bg-amber-400"
                : "bg-red-400"
            )}
            style={{ width: `${detail.recoveryPercent}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <MiniStat
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Last trained"
          value={formatDate(detail.lastTrained)}
        />
        <MiniStat
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Weekly sets"
          value={String(detail.weeklySets)}
        />
        <MiniStat
          icon={<Dumbbell className="w-3.5 h-3.5" />}
          label="Activation"
          value={`${activation.score}/100`}
        />
      </div>

      {/* Recommended exercises */}
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2.5">
          Recommended
        </p>
        <div className="space-y-1.5">
          {detail.recommendedExercises.map((ex) => (
            <div
              key={ex}
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-sm"
            >
              <span className="text-foreground">{ex}</span>
              <ChevronRight
                className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      <Link href="/workout" className="block mt-4">
        <Button size="sm" className="w-full gap-2 h-11">
          Train This Muscle
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-surface border border-border">
      <div className="flex items-center gap-1 mb-1 text-muted-foreground">
        {icon}
        <span className="text-[10px] leading-none">{label}</span>
      </div>
      <p className="font-semibold text-foreground text-sm leading-tight">{value}</p>
    </div>
  );
}

function EmptyMusclePanel({
  activations,
  onSelect,
  levelBg,
}: {
  activations: MuscleActivation[];
  onSelect: (id: string) => void;
  levelBg: Record<string, string>;
}) {
  return (
    <div className="p-5 rounded-[18px] bg-card border border-border">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Activity className="w-6 h-6 text-primary" />
      </div>
      <p className="font-medium text-foreground text-center mb-1">
        Select a muscle
      </p>
      <p className="text-sm text-muted-foreground text-center mb-5">
        Tap any highlighted area on the body map to see its training status and
        recommendations.
      </p>

      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
        All Muscles
      </p>
      <div className="space-y-1">
        {activations.slice(0, 8).map((m) => {
          const name = m.muscleId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return (
            <button
              key={m.muscleId}
              onClick={() => onSelect(m.muscleId)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface transition-colors text-sm min-h-[44px]"
            >
              <span className="text-foreground">{name}</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  levelBg[m.level]
                )}
              >
                {m.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
