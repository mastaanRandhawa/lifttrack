"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Timer,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Trophy,
  Dumbbell,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWorkoutStore } from "@/lib/store";
import { WORKOUT_TEMPLATES, EXERCISES } from "@/lib/mock-data";
import type { WorkoutTemplate, TemplateExercise } from "@/types";

export default function LiveWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: templateId } = use(params);
  const router = useRouter();
  const { activeSession, startSession, addExercise, addSet, updateSet, completeSession, abandonSession } =
    useWorkoutStore();

  const template = WORKOUT_TEMPLATES.find((t) => t.id === templateId);

  // Start session if not active
  useEffect(() => {
    if (!activeSession && template) {
      startSession(template.id, template.days[0].name);
      // Pre-load exercises from template
      template.days[0].exercises.forEach((te) => {
        addExercise(te.exerciseId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(
    activeSession?.exercises[0]?.id ?? null
  );
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;
    const t = setTimeout(() => setRestTimer((r) => (r ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleFinish = () => {
    completeSession();
    router.push("/dashboard");
  };

  const templateDay = template?.days[0];

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Template not found.</p>
          <Button onClick={() => router.push("/workout")}>Back to Workouts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 border-b border-border mb-6">
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              {templateDay?.name ?? template.name}
            </h1>
            <p className="text-sm text-muted-foreground">{templateDay?.focus}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Session timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-mono font-semibold">
              <Timer className="w-3.5 h-3.5" />
              {formatTime(elapsedSeconds)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => { abandonSession(); router.push("/workout"); }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rest timer */}
        {restTimer !== null && restTimer > 0 && (
          <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center gap-2 text-amber-400">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">Rest timer</span>
            </div>
            <span className="font-mono text-lg font-bold text-amber-400">{formatTime(restTimer)}</span>
            <Button size="sm" variant="ghost" onClick={() => setRestTimer(null)}>
              Skip
            </Button>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {activeSession?.exercises.map((sessionEx, idx) => {
          const exercise = EXERCISES.find((e) => e.id === sessionEx.exerciseId);
          const templateEx = templateDay?.exercises[idx] as TemplateExercise | undefined;
          const isExpanded = expandedExercise === sessionEx.id;
          const workSets = sessionEx.sets.filter((s) => !s.isWarmup);

          return (
            <div key={sessionEx.id} className="rounded-[18px] bg-card border border-border overflow-hidden">
              {/* Exercise header */}
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setExpandedExercise(isExpanded ? null : sessionEx.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{exercise?.name ?? sessionEx.exerciseId}</p>
                    <p className="text-xs text-muted-foreground">
                      {templateEx ? `${templateEx.sets}×${templateEx.repsMin}–${templateEx.repsMax}` : ""} · {workSets.length} logged
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {workSets.length >= (templateEx?.sets ?? 3) && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded set logger */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground py-2 mb-1">
                    <span className="col-span-1">#</span>
                    <span className="col-span-1 text-center">Prev</span>
                    <span className="col-span-4 text-center">Weight (kg)</span>
                    <span className="col-span-4 text-center">Reps</span>
                    <span className="col-span-2" />
                  </div>

                  {/* Set rows */}
                  {sessionEx.sets.map((s, si) => (
                    <SetRow
                      key={s.id}
                      setNumber={si + 1}
                      isWarmup={s.isWarmup}
                      weight={s.weight}
                      reps={s.reps}
                      onWeightChange={(v) => updateSet(sessionEx.id, s.id, { weight: v })}
                      onRepsChange={(v) => updateSet(sessionEx.id, s.id, { reps: v })}
                    />
                  ))}

                  {/* Add set buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 text-xs"
                      onClick={() => {
                        const lastWorkSet = [...sessionEx.sets].reverse().find((s) => !s.isWarmup);
                        addSet(sessionEx.id, {
                          setNumber: sessionEx.sets.length + 1,
                          weight: lastWorkSet?.weight ?? 0,
                          reps: lastWorkSet?.reps ?? templateEx?.repsMax ?? 8,
                          isWarmup: false,
                        });
                        if (templateEx) setRestTimer(templateEx.restSeconds);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Set
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs text-muted-foreground"
                      onClick={() => {
                        addSet(sessionEx.id, {
                          setNumber: sessionEx.sets.length + 1,
                          weight: (sessionEx.sets[0]?.weight ?? 0) * 0.6,
                          reps: 8,
                          isWarmup: true,
                        });
                      }}
                    >
                      <Flame className="w-3.5 h-3.5" /> Warmup
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finish button */}
      <div className="mt-8 sticky bottom-20 lg:bottom-6">
        <Button
          size="lg"
          className="w-full gap-2 shadow-lg shadow-primary/20"
          onClick={() => setShowFinishModal(true)}
        >
          <Trophy className="w-5 h-5" />
          Finish Workout
        </Button>
      </div>

      {/* Finish modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-[18px] p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Great session!</h2>
              <p className="text-muted-foreground mt-1">You trained for {formatTime(elapsedSeconds)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-surface text-center">
                <p className="text-xl font-bold text-foreground">
                  {activeSession?.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => !s.isWarmup).length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Work Sets</p>
              </div>
              <div className="p-3 rounded-xl bg-surface text-center">
                <p className="text-xl font-bold text-foreground">{activeSession?.exercises.length}</p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowFinishModal(false)} className="flex-1">
                Keep Going
              </Button>
              <Button onClick={handleFinish} className="flex-1">
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SetRow({
  setNumber,
  isWarmup,
  weight,
  reps,
  onWeightChange,
  onRepsChange,
}: {
  setNumber: number;
  isWarmup: boolean;
  weight: number;
  reps: number;
  onWeightChange: (v: number) => void;
  onRepsChange: (v: number) => void;
}) {
  return (
    <div className={cn(
      "grid grid-cols-12 gap-2 items-center py-1.5",
      isWarmup && "opacity-60"
    )}>
      <div className="col-span-1 flex justify-center">
        {isWarmup ? (
          <Flame className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <span className="text-sm text-muted-foreground font-medium">{setNumber}</span>
        )}
      </div>
      <div className="col-span-1 text-center">
        <span className="text-xs text-muted-foreground">—</span>
      </div>
      <div className="col-span-4">
        <Input
          type="number"
          value={weight || ""}
          onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
          className="h-9 text-center text-sm"
          placeholder="0"
          min={0}
          step={0.5}
        />
      </div>
      <div className="col-span-4">
        <Input
          type="number"
          value={reps || ""}
          onChange={(e) => onRepsChange(parseInt(e.target.value) || 0)}
          className="h-9 text-center text-sm"
          placeholder="0"
          min={0}
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <button className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center hover:bg-green-500/25 transition-colors">
          <Check className="w-3.5 h-3.5 text-green-400" />
        </button>
      </div>
    </div>
  );
}
