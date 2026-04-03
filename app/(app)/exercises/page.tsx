"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EXERCISES } from "@/lib/mock-data";
import type { Exercise, ExerciseCategory, DifficultyLevel, EquipmentType } from "@/types";

const CATEGORY_FILTERS: { id: ExerciseCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "arms", label: "Arms" },
  { id: "legs", label: "Legs" },
  { id: "core", label: "Core" },
];

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/25",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  advanced: "bg-red-500/15 text-red-400 border-red-500/25",
};

const EQUIPMENT_ICONS: Record<string, string> = {
  barbell: "🏋️",
  dumbbell: "💪",
  cable: "🔗",
  machine: "⚙️",
  bodyweight: "🤸",
  kettlebell: "🔔",
  "resistance-band": "🎗️",
};

function muscleList(exercise: Exercise): string {
  const primary = exercise.muscleMap
    .filter((m) => m.activationType === "primary")
    .map((m) => m.muscleId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
  return primary.join(", ");
}

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | "all">("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = EXERCISES.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.category.includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">Exercise Library</h1>
        <p className="text-muted-foreground mt-1">{EXERCISES.length} exercises with muscle activation data.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setCategoryFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                categoryFilter === f.id
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-surface text-muted-foreground border-border hover:border-primary/30"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Exercise Grid */}
        <div className="grid sm:grid-cols-2 gap-4 content-start">
          {filtered.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className={cn(
                "text-left p-4 rounded-[18px] bg-card border transition-all duration-150 hover:border-primary/40 hover:bg-primary/5",
                selectedExercise?.id === exercise.id
                  ? "border-primary bg-primary/8"
                  : "border-border"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-sm">
                    {EQUIPMENT_ICONS[exercise.equipment[0]] ?? "🏋️"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-tight">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{exercise.movementPattern}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
                  DIFFICULTY_COLORS[exercise.difficulty]
                )}>
                  {exercise.difficulty}
                </span>
              </div>

              {/* Primary muscles */}
              <p className="text-xs text-muted-foreground mb-2">
                <span className="text-primary font-medium">Primary: </span>
                {muscleList(exercise)}
              </p>

              {/* Equipment chips */}
              <div className="flex flex-wrap gap-1">
                {exercise.equipment.map((eq) => (
                  <span key={eq} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {eq}
                  </span>
                ))}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground">No exercises found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setSearch(""); setCategoryFilter("all"); }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedExercise ? (
            <div className="sticky top-6 p-5 rounded-[18px] bg-card border border-border">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {selectedExercise.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={DIFFICULTY_COLORS[selectedExercise.difficulty]}>
                      {selectedExercise.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">
                      {selectedExercise.movementPattern}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Muscle activation bars */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
                  Muscle Activation
                </p>
                <div className="space-y-2.5">
                  {selectedExercise.muscleMap.map((m) => {
                    const muscleName = m.muscleId
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                    return (
                      <div key={m.muscleId}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground">{muscleName}</span>
                          <span className={cn(
                            "font-medium",
                            m.activationType === "primary" ? "text-primary" : "text-muted-foreground"
                          )}>
                            {m.activationType}
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              m.activationType === "primary" ? "bg-primary" : "bg-muted-foreground"
                            )}
                            style={{ width: `${m.intensity * 10}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                  How to perform
                </p>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-foreground">
                      <span className="text-primary font-bold shrink-0 w-4">{i + 1}.</span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedExercise.tips.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Tips</p>
                  <ul className="space-y-1">
                    {selectedExercise.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variants */}
              {selectedExercise.variants && selectedExercise.variants.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Variants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExercise.variants.map((v) => (
                      <span key={v} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-[18px] bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium text-foreground mb-1">Select an exercise</p>
              <p className="text-sm text-muted-foreground">
                Click any exercise card to view instructions, muscle activation, and tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
