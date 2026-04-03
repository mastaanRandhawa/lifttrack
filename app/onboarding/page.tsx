"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useOnboardingStore, useUserStore, getSuggestedSplit } from "@/lib/store";
import type {
  FitnessGoal,
  ExperienceLevel,
  GymType,
  EquipmentType,
  SplitType,
} from "@/types";

const TOTAL_STEPS = 5;

const GOALS: { id: FitnessGoal; label: string; desc: string; emoji: string }[] = [
  { id: "build-muscle", label: "Build Muscle", desc: "Maximize hypertrophy and size", emoji: "💪" },
  { id: "strength", label: "Build Strength", desc: "Increase max lifts and power", emoji: "🏋️" },
  { id: "lose-fat", label: "Lose Fat", desc: "Burn calories and improve conditioning", emoji: "🔥" },
  { id: "general-fitness", label: "General Fitness", desc: "Stay healthy and active", emoji: "⚡" },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  { id: "beginner", label: "Beginner", desc: "Less than 1 year of consistent training" },
  { id: "intermediate", label: "Intermediate", desc: "1–3 years, familiar with compound lifts" },
  { id: "advanced", label: "Advanced", desc: "3+ years, training with progressive overload" },
];

const GYM_TYPES: { id: GymType; label: string; desc: string; emoji: string }[] = [
  { id: "commercial", label: "Commercial Gym", desc: "Full equipment available", emoji: "🏢" },
  { id: "home", label: "Home Gym", desc: "Barbell, dumbbells, basic setup", emoji: "🏠" },
  { id: "bodyweight", label: "Bodyweight Only", desc: "No equipment needed", emoji: "🤸" },
];

const FREQUENCY_OPTIONS = [2, 3, 4, 5, 6];

const EQUIPMENT_OPTIONS: { id: EquipmentType; label: string }[] = [
  { id: "barbell", label: "Barbell" },
  { id: "dumbbell", label: "Dumbbells" },
  { id: "cable", label: "Cable Machine" },
  { id: "machine", label: "Machines" },
  { id: "kettlebell", label: "Kettlebells" },
  { id: "resistance-band", label: "Resistance Bands" },
  { id: "bodyweight", label: "Bodyweight" },
];

const SPLIT_LABELS: Record<SplitType, string> = {
  "ppl": "Push / Pull / Legs",
  "upper-lower": "Upper / Lower Split",
  "full-body": "Full Body 3-Day",
  "beginner-3day": "Beginner 3-Day",
  "bro-split": "Bro Split",
  "custom": "Custom",
};

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { step, data, nextStep, prevStep, updateData } = useOnboardingStore();
  const { completeOnboarding } = useUserStore();
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    nextStep();
  };
  const goBack = () => {
    setDirection(-1);
    prevStep();
  };

  const handleComplete = () => {
    const { goal, experienceLevel, gymType, workoutsPerWeek, availableEquipment } = data;
    const suggestedSplit = getSuggestedSplit(goal, experienceLevel, workoutsPerWeek);
    completeOnboarding({
      goal: goal ?? "general-fitness",
      experienceLevel: experienceLevel ?? "beginner",
      gymType: gymType ?? "commercial",
      workoutsPerWeek,
      availableEquipment,
      preferredSplit: suggestedSplit,
    });
    router.push("/dashboard");
  };

  const suggestedSplit = getSuggestedSplit(data.goal, data.experienceLevel, data.workoutsPerWeek);

  const canProceed = () => {
    if (step === 0) return data.goal !== null;
    if (step === 1) return data.experienceLevel !== null;
    if (step === 2) return data.gymType !== null;
    if (step === 3) return data.workoutsPerWeek > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-heading font-bold text-xl text-foreground">LiftTrack</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-lg overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Step 0: Goal */}
            {step === 0 && (
              <StepWrapper title="What's your primary goal?" subtitle="We'll personalize your training plan around this.">
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((g) => (
                    <SelectCard
                      key={g.id}
                      selected={data.goal === g.id}
                      onClick={() => updateData({ goal: g.id })}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <span className="font-semibold text-sm">{g.label}</span>
                      <span className="text-xs text-muted-foreground">{g.desc}</span>
                    </SelectCard>
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 1: Experience */}
            {step === 1 && (
              <StepWrapper title="What's your experience level?" subtitle="This helps us choose the right program structure.">
                <div className="space-y-3">
                  {EXPERIENCE_LEVELS.map((e) => (
                    <SelectCard
                      key={e.id}
                      selected={data.experienceLevel === e.id}
                      onClick={() => updateData({ experienceLevel: e.id })}
                      horizontal
                    >
                      <span className="font-semibold">{e.label}</span>
                      <span className="text-sm text-muted-foreground">{e.desc}</span>
                    </SelectCard>
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 2: Gym type */}
            {step === 2 && (
              <StepWrapper title="Where do you train?" subtitle="We'll match exercises to your available equipment.">
                <div className="space-y-3">
                  {GYM_TYPES.map((g) => (
                    <SelectCard
                      key={g.id}
                      selected={data.gymType === g.id}
                      onClick={() => updateData({ gymType: g.id })}
                      horizontal
                    >
                      <span className="text-xl">{g.emoji}</span>
                      <div>
                        <span className="font-semibold block">{g.label}</span>
                        <span className="text-sm text-muted-foreground">{g.desc}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 3: Frequency + Equipment */}
            {step === 3 && (
              <StepWrapper title="How often can you train?" subtitle="Choose weekly frequency and available equipment.">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Days per week</p>
                    <div className="flex gap-2 flex-wrap">
                      {FREQUENCY_OPTIONS.map((f) => (
                        <button
                          key={f}
                          onClick={() => updateData({ workoutsPerWeek: f })}
                          className={cn(
                            "w-12 h-12 rounded-xl text-sm font-semibold border transition-all",
                            data.workoutsPerWeek === f
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-surface text-muted-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Available equipment <span className="text-muted-foreground font-normal">(select all that apply)</span></p>
                    <div className="flex flex-wrap gap-2">
                      {EQUIPMENT_OPTIONS.map((eq) => {
                        const selected = data.availableEquipment.includes(eq.id);
                        return (
                          <button
                            key={eq.id}
                            onClick={() => {
                              const current = data.availableEquipment;
                              updateData({
                                availableEquipment: selected
                                  ? current.filter((e) => e !== eq.id)
                                  : [...current, eq.id],
                              });
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                              selected
                                ? "bg-primary/15 text-primary border-primary/40"
                                : "bg-surface text-muted-foreground border-border hover:border-primary/30"
                            )}
                          >
                            {selected && <Check className="inline w-3 h-3 mr-1" />}
                            {eq.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Injuries / limitations <span className="text-muted-foreground font-normal">(optional)</span></p>
                    <Textarea
                      placeholder="E.g. bad lower back, knee pain..."
                      value={data.injuryNotes}
                      onChange={(e) => updateData({ injuryNotes: e.target.value })}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 4: Summary */}
            {step === 4 && (
              <StepWrapper title="Your personalized plan is ready" subtitle="Here's what we've set up for you.">
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/25">
                    <p className="text-xs text-primary font-medium uppercase tracking-widest mb-1">Suggested Split</p>
                    <p className="font-heading text-2xl font-bold text-foreground">{SPLIT_LABELS[suggestedSplit]}</p>
                    <p className="text-sm text-muted-foreground mt-1">{data.workoutsPerWeek} sessions per week</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SummaryItem label="Goal" value={GOALS.find((g) => g.id === data.goal)?.label ?? "—"} />
                    <SummaryItem label="Level" value={data.experienceLevel ? data.experienceLevel.charAt(0).toUpperCase() + data.experienceLevel.slice(1) : "—"} />
                    <SummaryItem label="Gym" value={GYM_TYPES.find((g) => g.id === data.gymType)?.label ?? "—"} />
                    <SummaryItem label="Equipment" value={`${data.availableEquipment.length} types`} />
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    You can change any of these settings later in your profile.
                  </p>
                </div>
              </StepWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-lg mt-8">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {step < TOTAL_STEPS - 1 ? (
          <Button onClick={goNext} disabled={!canProceed()} className="gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} className="gap-2">
            Start Training
            <Zap className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  horizontal = false,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  horizontal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border text-left transition-all duration-150",
        horizontal ? "flex items-center gap-4" : "flex flex-col items-start gap-1.5",
        selected
          ? "bg-primary/10 border-primary text-foreground"
          : "bg-surface border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      {children}
      {selected && (
        <span className={cn("ml-auto shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center", !horizontal && "hidden")}>
          <Check className="w-3 h-3 text-primary-foreground" />
        </span>
      )}
    </button>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}
