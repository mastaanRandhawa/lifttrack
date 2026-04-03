"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Clock, Calendar, ChevronRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WORKOUT_TEMPLATES } from "@/lib/mock-data";
import type { SplitType, DifficultyLevel } from "@/types";

const FILTER_SPLITS: { id: SplitType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ppl", label: "PPL" },
  { id: "upper-lower", label: "Upper/Lower" },
  { id: "full-body", label: "Full Body" },
  { id: "beginner-3day", label: "Beginner" },
];

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/25",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  advanced: "bg-red-500/15 text-red-400 border-red-500/25",
};

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  "upper-lower": "Upper/Lower",
  "full-body": "Full Body",
  "beginner-3day": "Beginner",
  custom: "Custom",
  "bro-split": "Bro Split",
};

export default function WorkoutPage() {
  const [search, setSearch] = useState("");
  const [splitFilter, setSplitFilter] = useState<SplitType | "all">("all");

  const filtered = WORKOUT_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesSplit = splitFilter === "all" || t.splitType === splitFilter;
    return matchesSearch && matchesSplit;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Workouts</h1>
          <p className="text-muted-foreground mt-1">Choose a template and start your session.</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {FILTER_SPLITS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSplitFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                splitFilter === f.id
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-surface text-muted-foreground border-border hover:border-primary/30"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="group p-5 rounded-[18px] bg-card border border-border hover:border-primary/40 transition-all duration-200 flex flex-col"
          >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{SPLIT_LABELS[template.splitType]}</p>
                </div>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-medium",
                DIFFICULTY_COLORS[template.difficulty]
              )}>
                {template.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {template.daysPerWeek} days/week
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ~{template.estimatedMinutes} min
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            {/* Days preview */}
            <div className="flex gap-1.5 mb-4">
              {template.days.map((day) => (
                <span
                  key={day.name}
                  className="text-xs px-2 py-1 rounded-lg bg-primary/8 text-primary font-medium"
                >
                  {day.name}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link href={`/workout/${template.id}`} className="block">
              <Button className="w-full gap-2 group-hover:bg-primary transition-colors">
                Start Workout <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground">No workouts match your search.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSplitFilter("all"); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
