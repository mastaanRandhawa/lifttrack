"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Timer,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Trophy,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkoutStore } from "@/lib/store";
import { WORKOUT_TEMPLATES, EXERCISES } from "@/lib/mock-data";
import type { TemplateExercise } from "@/types";

export default function LiveWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: templateId } = use(params);
  const router = useRouter();
  const {
    activeSession,
    startSession,
    addExercise,
    addSet,
    updateSet,
    completeSession,
    abandonSession,
  } = useWorkoutStore();

  const template = WORKOUT_TEMPLATES.find((t) => t.id === templateId);

  // Start session once on mount
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current && !activeSession && template) {
      didInit.current = true;
      startSession(template.id, template.days[0].name);
      template.days[0].exercises.forEach((te) => addExercise(te.exerciseId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  // Track which sets are "checked off" by the user
  const [checkedSets, setCheckedSets] = useState<Set<string>>(new Set());

  // Auto-expand first exercise after init
  useEffect(() => {
    if (activeSession?.exercises[0] && !expandedExercise) {
      setExpandedExercise(activeSession.exercises[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.exercises.length]);

  // Session elapsed timer
  useEffect(() => {
    const interval = setInterval(
      () => setElapsedSeconds((s) => s + 1),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  // Rest countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;
    const t = setTimeout(
      () => setRestTimer((r) => (r ?? 0) - 1),
      1000
    );
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

  const handleAbandon = () => {
    abandonSession();
    router.push("/workout");
  };

  const templateDay = template?.days[0];

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
        <p className="text-muted-foreground text-center">Template not found.</p>
        <Button onClick={() => router.push("/workout")}>Back to Workouts</Button>
      </div>
    );
  }

  const totalWorkSets =
    activeSession?.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => !s.isWarmup).length,
      0
    ) ?? 0;

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-36 lg:pb-10">
        {/* ── Sticky header ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-background/96 backdrop-blur-md pt-4 pb-3 border-b border-border mb-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <h1 className="font-heading text-lg font-bold text-foreground truncate">
                {templateDay?.name ?? template.name}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {templateDay?.focus}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Elapsed timer */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-mono font-semibold"
                aria-label={`Session time: ${formatTime(elapsedSeconds)}`}
              >
                <Timer className="w-3.5 h-3.5" aria-hidden="true" />
                {formatTime(elapsedSeconds)}
              </div>

              {/* Abandon — destructive, use dialog to prevent accidental loss */}
              <button
                onClick={() => setShowAbandonDialog(true)}
                aria-label="Abandon workout"
                className="w-9 h-9 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rest timer bar */}
          {restTimer !== null && restTimer > 0 && (
            <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <div className="flex items-center gap-2 text-amber-400">
                <Timer className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Rest</span>
              </div>
              <span
                className="font-mono text-xl font-bold text-amber-400 tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatTime(restTimer)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRestTimer(null)}
                className="text-amber-400 hover:text-amber-300"
              >
                Skip
              </Button>
            </div>
          )}
        </div>

        {/* ── Exercise list ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {activeSession?.exercises.map((sessionEx, idx) => {
            const exercise = EXERCISES.find((e) => e.id === sessionEx.exerciseId);
            const templateEx = templateDay?.exercises[idx] as
              | TemplateExercise
              | undefined;
            const isExpanded = expandedExercise === sessionEx.id;
            const workSets = sessionEx.sets.filter((s) => !s.isWarmup);
            const isDone = workSets.length >= (templateEx?.sets ?? 3);

            return (
              <div
                key={sessionEx.id}
                className={cn(
                  "rounded-[18px] bg-card border overflow-hidden transition-colors",
                  isDone ? "border-green-500/30" : "border-border"
                )}
              >
                {/* Exercise header — full-row tap target */}
                <button
                  className="w-full flex items-center justify-between p-4 text-left min-h-[60px]"
                  onClick={() =>
                    setExpandedExercise(isExpanded ? null : sessionEx.id)
                  }
                  aria-expanded={isExpanded}
                  aria-controls={`exercise-sets-${sessionEx.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-colors",
                        isDone
                          ? "bg-green-500/15 text-green-400"
                          : "bg-primary/15 text-primary"
                      )}
                      aria-hidden="true"
                    >
                      {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                        {exercise?.name ?? sessionEx.exerciseId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {templateEx
                          ? `${templateEx.sets}×${templateEx.repsMin}–${templateEx.repsMax}`
                          : ""}
                        {workSets.length > 0 &&
                          ` · ${workSets.length} logged`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Set logger */}
                {isExpanded && (
                  <div
                    id={`exercise-sets-${sessionEx.id}`}
                    className="px-4 pb-5 border-t border-border"
                  >
                    {/* Column headers */}
                    <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground py-2.5 mb-1">
                      <span className="col-span-1 text-center">#</span>
                      <span className="col-span-5 text-center">Weight (kg)</span>
                      <span className="col-span-4 text-center">Reps</span>
                      <span className="col-span-2" />
                    </div>

                    {sessionEx.sets.map((s, si) => (
                      <SetRow
                        key={s.id}
                        setId={s.id}
                        setNumber={si + 1}
                        isWarmup={s.isWarmup}
                        weight={s.weight}
                        reps={s.reps}
                        isChecked={checkedSets.has(s.id)}
                        onWeightChange={(v) =>
                          updateSet(sessionEx.id, s.id, { weight: v })
                        }
                        onRepsChange={(v) =>
                          updateSet(sessionEx.id, s.id, { reps: v })
                        }
                        onCheck={() => {
                          setCheckedSets((prev) => {
                            const next = new Set(prev);
                            if (next.has(s.id)) next.delete(s.id);
                            else next.add(s.id);
                            return next;
                          });
                        }}
                      />
                    ))}

                    {/* Add set buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5 h-10"
                        onClick={() => {
                          const lastWork = [...sessionEx.sets]
                            .reverse()
                            .find((s) => !s.isWarmup);
                          addSet(sessionEx.id, {
                            setNumber: sessionEx.sets.length + 1,
                            weight: lastWork?.weight ?? 0,
                            reps:
                              lastWork?.reps ?? templateEx?.repsMax ?? 8,
                            isWarmup: false,
                          });
                          if (templateEx)
                            setRestTimer(templateEx.restSeconds);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Set
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-10 text-muted-foreground"
                        onClick={() =>
                          addSet(sessionEx.id, {
                            setNumber: sessionEx.sets.length + 1,
                            weight:
                              (sessionEx.sets[0]?.weight ?? 0) * 0.6,
                            reps: 8,
                            isWarmup: true,
                          })
                        }
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> Warmup
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Finish CTA ────────────────────────────────────────────── */}
        {/* Sticky at bottom, above bottom-nav on mobile */}
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] lg:bottom-6 left-0 right-0 px-4 sm:px-6 lg:relative lg:bottom-auto lg:px-0 lg:mt-8 z-10">
          <div className="max-w-3xl mx-auto">
            <Button
              size="lg"
              className="w-full gap-2 shadow-xl shadow-primary/20 h-14 text-base font-semibold"
              onClick={() => setShowFinishModal(true)}
            >
              <Trophy className="w-5 h-5" />
              Finish Workout
              {totalWorkSets > 0 && (
                <span className="ml-auto text-primary-foreground/70 text-sm font-normal">
                  {totalWorkSets} sets
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Finish modal ──────────────────────────────────────────────── */}
      {showFinishModal && (
        <Modal onClose={() => setShowFinishModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Great session!
            </h2>
            <p className="text-muted-foreground mt-1">
              You trained for{" "}
              <strong className="text-foreground">{formatTime(elapsedSeconds)}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat
              value={String(totalWorkSets)}
              label="Work Sets"
            />
            <Stat
              value={String(activeSession?.exercises.length ?? 0)}
              label="Exercises"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFinishModal(false)}
              className="flex-1 h-12"
            >
              Keep Going
            </Button>
            <Button onClick={handleFinish} className="flex-1 h-12">
              Save &amp; Exit
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Abandon confirmation dialog ───────────────────────────── */}
      {showAbandonDialog && (
        <Modal onClose={() => setShowAbandonDialog(false)}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Abandon workout?
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your session progress will be lost and nothing will be saved.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAbandonDialog(false)}
              className="flex-1 h-12"
            >
              Keep Training
            </Button>
            <Button
              variant="destructive"
              onClick={handleAbandon}
              className="flex-1 h-12"
            >
              Abandon
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── SetRow ────────────────────────────────────────────────────────────────

function SetRow({
  setNumber,
  isWarmup,
  weight,
  reps,
  isChecked,
  onWeightChange,
  onRepsChange,
  onCheck,
}: {
  setId?: string;
  setNumber: number;
  isWarmup: boolean;
  weight: number;
  reps: number;
  isChecked: boolean;
  onWeightChange: (v: number) => void;
  onRepsChange: (v: number) => void;
  onCheck: () => void;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-2 items-center py-1.5 transition-opacity",
        isWarmup && "opacity-55",
        isChecked && "opacity-60"
      )}
    >
      {/* Set number / warmup indicator */}
      <div className="col-span-1 flex justify-center">
        {isWarmup ? (
          <Flame
            className="w-3.5 h-3.5 text-amber-400"
            aria-label="Warmup set"
          />
        ) : (
          <span className="text-sm text-muted-foreground font-medium">
            {setNumber}
          </span>
        )}
      </div>

      {/* Weight stepper */}
      <div className="col-span-5">
        <Stepper
          value={weight}
          step={2.5}
          min={0}
          onChange={onWeightChange}
          aria-label={`Weight for set ${setNumber}`}
        />
      </div>

      {/* Reps stepper */}
      <div className="col-span-4">
        <Stepper
          value={reps}
          step={1}
          min={0}
          onChange={onRepsChange}
          aria-label={`Reps for set ${setNumber}`}
          integer
        />
      </div>

      {/* Check-off button */}
      <div className="col-span-2 flex justify-center">
        <button
          onClick={onCheck}
          aria-pressed={isChecked}
          aria-label={isChecked ? "Mark set incomplete" : "Mark set complete"}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
            isChecked
              ? "bg-green-500 text-white"
              : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
          )}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Stepper — +/- controls around a readable value (Fitts's Law) ──────────

function Stepper({
  value,
  step,
  min = 0,
  onChange,
  integer = false,
  "aria-label": ariaLabel,
}: {
  value: number;
  step: number;
  min?: number;
  onChange: (v: number) => void;
  integer?: boolean;
  "aria-label"?: string;
}) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(value + step);
  const display =
    integer || value % 1 === 0 ? String(Math.round(value)) : value.toFixed(1);

  return (
    <div
      className="flex items-center h-11 rounded-xl border border-border bg-background overflow-hidden"
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={decrement}
        aria-label="Decrease"
        className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="flex-1 text-center text-sm font-semibold text-foreground tabular-nums select-none">
        {display}
      </span>
      <button
        type="button"
        onClick={increment}
        aria-label="Increase"
        className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Shared modal wrapper ──────────────────────────────────────────────────

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-card border border-border rounded-[18px] p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

// ── Mini stat for finish modal ─────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-3 rounded-xl bg-surface text-center border border-border">
      <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
