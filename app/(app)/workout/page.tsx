"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Clock,
  Calendar,
  ChevronRight,
  Search,
  Play,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WORKOUT_TEMPLATES, SESSION_HISTORY } from "@/lib/mock-data";
import type { SplitType, DifficultyLevel } from "@/types";

const FILTER_SPLITS: { id: SplitType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ppl", label: "PPL" },
  { id: "upper-lower", label: "Upper / Lower" },
  { id: "full-body", label: "Full Body" },
  { id: "beginner-3day", label: "Beginner" },
];

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/25",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  advanced: "bg-red-500/15 text-red-400 border-red-500/25",
};

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push / Pull / Legs",
  "upper-lower": "Upper / Lower",
  "full-body": "Full Body",
  "beginner-3day": "Beginner",
  custom: "Custom",
  "bro-split": "Bro Split",
};

export default function WorkoutPage() {
  const [search, setSearch] = useState("");
  const [splitFilter, setSplitFilter] = useState<SplitType | "all">("all");

  // Most-recently used template for the "Continue" hero card
  const lastUsedId = SESSION_HISTORY[0]?.templateId;
  const lastUsedTemplate = lastUsedId
    ? WORKOUT_TEMPLATES.find((t) => t.id === lastUsedId)
    : null;
  const suggestedTemplate =
    lastUsedTemplate ?? WORKOUT_TEMPLATES.find((t) => t.id === "ppl-6day");

  const filtered = WORKOUT_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesSplit =
      splitFilter === "all" || t.splitType === splitFilter;
    return matchesSearch && matchesSplit;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Workouts
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Choose a program and start training.
        </p>
      </div>

      {/* ── Quick-start hero card ────────────────────────────────────── */}
      {/* Shows the template the user last ran, or a sensible default.   */}
      {/* Recognition over recall: user doesn't have to scroll to find   */}
      {/* their current program.                                         */}
      {suggestedTemplate && (
        <div className="mb-6 p-4 sm:p-5 rounded-[18px] bg-card border border-primary/25 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium mb-0.5">
              {lastUsedTemplate ? "Continue where you left off" : "Recommended for you"}
            </p>
            <p className="font-heading font-bold text-foreground truncate">
              {suggestedTemplate.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {suggestedTemplate.estimatedMinutes} min &middot;{" "}
              {suggestedTemplate.daysPerWeek}×/week &middot;{" "}
              {suggestedTemplate.difficulty}
            </p>
          </div>
          <Link href={`/workout/${suggestedTemplate.id}`} className="shrink-0">
            <Button size="sm" className="gap-1.5">
              <Play className="w-3.5 h-3.5 fill-current" />
              Start
            </Button>
          </Link>
        </div>
      )}

      {/* ── Filters — ABOVE search (Hick's Law: reduce decision time) ── */}
      {/* Horizontal scroll on mobile so all chips stay one swipe away   */}
      <div
        className="flex items-center gap-2 pb-1 mb-4 overflow-x-auto no-scrollbar"
        role="group"
        aria-label="Filter workouts by type"
      >
        {FILTER_SPLITS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSplitFilter(f.id)}
            aria-pressed={splitFilter === f.id}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all shrink-0",
              splitFilter === f.id
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-surface text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder="Search templates…"
          className="pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search workouts"
        />
      </div>

      {/* ── Results count ───────────────────────────────────────────── */}
      {(search || splitFilter !== "all") && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          {splitFilter !== "all" && ` · ${SPLIT_LABELS[splitFilter] ?? splitFilter}`}
        </p>
      )}

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="group p-5 rounded-[18px] bg-card border border-border hover:border-primary/35 transition-all duration-200 flex flex-col"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {SPLIT_LABELS[template.splitType]}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ml-2",
                    DIFFICULTY_COLORS[template.difficulty]
                  )}
                >
                  {template.difficulty}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                {template.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {template.daysPerWeek}×/week
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  ~{template.estimatedMinutes} min
                </span>
              </div>

              {/* Day badges */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {template.days.map((day) => (
                  <Badge
                    key={day.name}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {day.name}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <Link href={`/workout/${template.id}`}>
                <Button className="w-full gap-2 h-11">
                  <Play className="w-4 h-4 fill-current" />
                  Start Workout
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* ── Empty state ──────────────────────────────────────────── */
        <div className="text-center py-16">
          <Dumbbell
            className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="font-medium text-foreground mb-1">No templates found</p>
          <p className="text-sm text-muted-foreground mb-5">
            Try adjusting your search or removing a filter.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSplitFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
