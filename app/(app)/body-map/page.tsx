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
import type { BodyView, DateRangeFilter } from "@/types";
import Link from "next/link";

const DATE_FILTERS: { id: DateRangeFilter; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "last-workout", label: "Last Workout" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
];

const LEGEND = [
  { level: "fresh", label: "Fresh", color: "bg-muted" },
  { level: "light", label: "Light", color: "bg-green-400" },
  { level: "moderate", label: "Moderate", color: "bg-amber-400" },
  { level: "heavy", label: "Heavy", color: "bg-red-400" },
  { level: "recovering", label: "Recovering", color: "bg-primary" },
];

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

export default function BodyMapPage() {
  const { view, dateRange, selectedMuscle, muscleActivations, setView, setDateRange, selectMuscle } =
    useBodyMapStore();

  const detail = selectedMuscle ? MUSCLE_DETAILS[selectedMuscle] : null;
  const activation = muscleActivations.find((a) => a.muscleId === selectedMuscle);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">Body Map</h1>
        <p className="text-muted-foreground mt-1">Visualize your muscle activation and recovery status.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Left — body map */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Front/Back toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
              {(["front", "back"] as BodyView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    view === v
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Date range */}
            <div className="flex items-center gap-1 flex-wrap">
              {DATE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDateRange(f.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    dateRange === f.id
                      ? "bg-primary/15 text-primary border-primary/40"
                      : "text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG body + legend */}
          <div className="p-6 rounded-[18px] bg-card border border-border">
            <div className="flex gap-6 items-start">
              {/* Body SVG */}
              <div className="flex-1 min-h-[480px] flex items-center justify-center relative">
                <BodyMapSvg
                  view={view}
                  activations={muscleActivations}
                  selectedMuscle={selectedMuscle}
                  onMuscleClick={(id) => selectMuscle(selectedMuscle === id ? null : id)}
                />
              </div>

              {/* Legend */}
              <div className="shrink-0 hidden sm:block">
                <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wider">Status</p>
                <div className="space-y-2.5">
                  {LEGEND.map((l) => (
                    <div key={l.level} className="flex items-center gap-2.5">
                      <span className={cn("w-3 h-3 rounded-full shrink-0", l.color)} />
                      <span className="text-xs text-muted-foreground">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile legend */}
            <div className="flex items-center gap-4 flex-wrap mt-4 pt-4 border-t border-border sm:hidden">
              {LEGEND.map((l) => (
                <div key={l.level} className="flex items-center gap-1.5">
                  <span className={cn("w-2.5 h-2.5 rounded-full", l.color)} />
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tap hint */}
          <p className="text-xs text-muted-foreground text-center">
            Tap any muscle group to see details
          </p>
        </div>

        {/* Right — detail panel */}
        <div>
          {detail && activation ? (
            <div className="sticky top-6">
              <div className="p-5 rounded-[18px] bg-card border border-border">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{detail.displayName}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1.5 text-xs",
                        activation.level === "fresh" && "border-muted-foreground text-muted-foreground",
                        activation.level === "light" && "border-green-500/40 text-green-400",
                        activation.level === "moderate" && "border-amber-500/40 text-amber-400",
                        activation.level === "heavy" && "border-red-500/40 text-red-400",
                        activation.level === "recovering" && "border-primary/40 text-primary",
                      )}
                    >
                      {activation.level}
                    </Badge>
                  </div>
                  <button
                    onClick={() => selectMuscle(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Recovery bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Recovery</span>
                    <span className="font-medium text-foreground">{detail.recoveryPercent}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        detail.recoveryPercent >= 80 ? "bg-green-400" :
                        detail.recoveryPercent >= 50 ? "bg-amber-400" : "bg-red-400"
                      )}
                      style={{ width: `${detail.recoveryPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Last trained</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{formatDate(detail.lastTrained)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Weekly sets</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{detail.weeklySets}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Activation</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{activation.score}/100</p>
                  </div>
                </div>

                {/* Recommended exercises */}
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2.5">
                    Recommended Exercises
                  </p>
                  <div className="space-y-2">
                    {detail.recommendedExercises.map((ex) => (
                      <div
                        key={ex}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border text-sm"
                      >
                        <span className="text-foreground">{ex}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/workout" className="block mt-4">
                  <Button size="sm" className="w-full gap-2">
                    Train This Muscle
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-[18px] bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium text-foreground mb-1">Select a muscle</p>
              <p className="text-sm text-muted-foreground">
                Tap any highlighted muscle group on the body map to see training details.
              </p>

              {/* All muscle summary */}
              <div className="mt-5 space-y-2 text-left">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">All Muscles</p>
                {muscleActivations.slice(0, 8).map((m) => {
                  const name = m.muscleId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  return (
                    <button
                      key={m.muscleId}
                      onClick={() => selectMuscle(m.muscleId)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors text-sm"
                    >
                      <span className="text-foreground">{name}</span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        m.level === "fresh" && "bg-muted text-muted-foreground",
                        m.level === "light" && "bg-green-500/15 text-green-400",
                        m.level === "moderate" && "bg-amber-500/15 text-amber-400",
                        m.level === "heavy" && "bg-red-500/15 text-red-400",
                        m.level === "recovering" && "bg-primary/15 text-primary",
                      )}>
                        {m.level}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
