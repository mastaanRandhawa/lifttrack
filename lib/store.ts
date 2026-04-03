"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile,
  OnboardingState,
  WorkoutSession,
  SessionExercise,
  LoggedSet,
  MuscleActivation,
  BodyView,
  DateRangeFilter,
  FitnessGoal,
  ExperienceLevel,
  GymType,
  EquipmentType,
  SplitType,
} from "@/types";
import {
  MOCK_USER,
  MOCK_MUSCLE_ACTIVATIONS,
  SESSION_HISTORY,
} from "@/lib/mock-data";

// ─── User Store ───────────────────────────────────────────────────────────────

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,

      login: (email: string) =>
        set({
          user: { ...MOCK_USER, email },
          isAuthenticated: true,
          isOnboarded: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isOnboarded: false,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      completeOnboarding: (data) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...data }
            : { ...MOCK_USER, ...data },
          isOnboarded: true,
        })),
    }),
    { name: "lifttrack-user" }
  )
);

// ─── Onboarding Store ─────────────────────────────────────────────────────────

interface OnboardingStore {
  step: number;
  data: OnboardingState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<OnboardingState>) => void;
  reset: () => void;
}

const defaultOnboarding: OnboardingState = {
  goal: null,
  experienceLevel: null,
  gymType: null,
  workoutsPerWeek: 4,
  availableEquipment: [],
  workoutDurationMinutes: 60,
  injuryNotes: "",
  completed: false,
};

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
  step: 0,
  data: defaultOnboarding,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),

  updateData: (updates) =>
    set((state) => ({ data: { ...state.data, ...updates } })),

  reset: () => set({ step: 0, data: defaultOnboarding }),
}));

export function getSuggestedSplit(
  goal: FitnessGoal | null,
  experience: ExperienceLevel | null,
  daysPerWeek: number
): SplitType {
  if (experience === "beginner" || daysPerWeek <= 3) return "beginner-3day";
  if (daysPerWeek === 4) return "upper-lower";
  if (goal === "build-muscle" || goal === "strength") return "ppl";
  return "full-body";
}

// ─── Workout Store ────────────────────────────────────────────────────────────

interface WorkoutStore {
  activeSession: WorkoutSession | null;
  sessionHistory: WorkoutSession[];
  startSession: (templateId: string, name: string) => void;
  addExercise: (exerciseId: string) => void;
  addSet: (sessionExerciseId: string, set: Omit<LoggedSet, "id" | "completedAt">) => void;
  updateSet: (sessionExerciseId: string, setId: string, updates: Partial<LoggedSet>) => void;
  removeSet: (sessionExerciseId: string, setId: string) => void;
  completeSession: () => void;
  abandonSession: () => void;
}

let setCounter = 1000;
let exerciseCounter = 1000;

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      sessionHistory: SESSION_HISTORY,

      startSession: (templateId, name) => {
        const session: WorkoutSession = {
          id: `session-${Date.now()}`,
          templateId,
          name,
          startedAt: new Date(),
          exercises: [],
        };
        set({ activeSession: session });
      },

      addExercise: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const newExercise: SessionExercise = {
          id: `se-${exerciseCounter++}`,
          exerciseId,
          order: activeSession.exercises.length + 1,
          sets: [],
        };
        set({
          activeSession: {
            ...activeSession,
            exercises: [...activeSession.exercises, newExercise],
          },
        });
      },

      addSet: (sessionExerciseId, setData) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const newSet: LoggedSet = {
          ...setData,
          id: `s-${setCounter++}`,
          completedAt: new Date(),
        };
        set({
          activeSession: {
            ...activeSession,
            exercises: activeSession.exercises.map((ex) =>
              ex.id === sessionExerciseId
                ? { ...ex, sets: [...ex.sets, newSet] }
                : ex
            ),
          },
        });
      },

      updateSet: (sessionExerciseId, setId, updates) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: {
            ...activeSession,
            exercises: activeSession.exercises.map((ex) =>
              ex.id === sessionExerciseId
                ? {
                    ...ex,
                    sets: ex.sets.map((s) =>
                      s.id === setId ? { ...s, ...updates } : s
                    ),
                  }
                : ex
            ),
          },
        });
      },

      removeSet: (sessionExerciseId, setId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: {
            ...activeSession,
            exercises: activeSession.exercises.map((ex) =>
              ex.id === sessionExerciseId
                ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
                : ex
            ),
          },
        });
      },

      completeSession: () => {
        const { activeSession, sessionHistory } = get();
        if (!activeSession) return;
        const completed: WorkoutSession = {
          ...activeSession,
          completedAt: new Date(),
          durationMinutes: Math.round(
            (Date.now() - new Date(activeSession.startedAt).getTime()) / 60000
          ),
        };
        set({
          activeSession: null,
          sessionHistory: [completed, ...sessionHistory],
        });
      },

      abandonSession: () => set({ activeSession: null }),
    }),
    { name: "lifttrack-workout" }
  )
);

// ─── Body Map Store ────────────────────────────────────────────────────────────

interface BodyMapStore {
  view: BodyView;
  dateRange: DateRangeFilter;
  selectedMuscle: string | null;
  muscleActivations: MuscleActivation[];
  setView: (view: BodyView) => void;
  setDateRange: (range: DateRangeFilter) => void;
  selectMuscle: (muscleId: string | null) => void;
}

export const useBodyMapStore = create<BodyMapStore>()((set) => ({
  view: "front",
  dateRange: "this-week",
  selectedMuscle: null,
  muscleActivations: MOCK_MUSCLE_ACTIVATIONS,

  setView: (view) => set({ view }),
  setDateRange: (dateRange) => set({ dateRange }),
  selectMuscle: (selectedMuscle) => set({ selectedMuscle }),
}));
