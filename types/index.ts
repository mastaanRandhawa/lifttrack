// ─── Muscle Groups ───────────────────────────────────────────────────────────

export type MuscleId =
  | "chest"
  | "front-delts"
  | "rear-delts"
  | "biceps"
  | "triceps"
  | "traps"
  | "lats"
  | "abs"
  | "obliques"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "forearms"
  | "rhomboids"
  | "lower-back";

export type ActivationLevel = "fresh" | "light" | "moderate" | "heavy" | "recovering";

export interface MuscleActivation {
  muscleId: MuscleId;
  score: number; // 0–100
  level: ActivationLevel;
  lastTrained: Date | null;
  weeklySets: number;
}

// ─── Exercises ───────────────────────────────────────────────────────────────

export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "resistance-band"
  | "smith-machine";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type MovementPattern =
  | "push"
  | "pull"
  | "hinge"
  | "squat"
  | "lunge"
  | "carry"
  | "rotation"
  | "isolation";

export type ExerciseCategory =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "full-body"
  | "cardio";

export interface ExerciseMuscleMap {
  muscleId: MuscleId;
  activationType: "primary" | "secondary";
  intensity: number; // 1–10
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: EquipmentType[];
  muscleMap: ExerciseMuscleMap[];
  movementPattern: MovementPattern;
  difficulty: DifficultyLevel;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  imageUrl?: string;
  variants?: string[];
}

// ─── Workout Templates ────────────────────────────────────────────────────────

export type SplitType =
  | "ppl"
  | "upper-lower"
  | "full-body"
  | "bro-split"
  | "beginner-3day"
  | "custom";

export interface TemplateExercise {
  exerciseId: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  name: string;
  focus: string;
  exercises: TemplateExercise[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  splitType: SplitType;
  daysPerWeek: number;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  equipment: EquipmentType[];
  days: WorkoutDay[];
  tags: string[];
}

// ─── Workout Sessions ─────────────────────────────────────────────────────────

export interface LoggedSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  isWarmup: boolean;
  rpe?: number;
  notes?: string;
  completedAt: Date;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  order: number;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  templateId?: string;
  name: string;
  startedAt: Date;
  completedAt?: Date;
  durationMinutes?: number;
  exercises: SessionExercise[];
  notes?: string;
  totalVolume?: number; // sum of weight × reps
}

// ─── Personal Records ─────────────────────────────────────────────────────────

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimatedOneRepMax: number;
  achievedAt: Date;
}

// ─── User / Profile ───────────────────────────────────────────────────────────

export type FitnessGoal =
  | "build-muscle"
  | "strength"
  | "lose-fat"
  | "general-fitness";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type GymType = "commercial" | "home" | "bodyweight";

export interface UserProfile {
  id: string;
  name: string;
  displayName: string;
  email: string;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  gymType: GymType;
  workoutsPerWeek: number;
  availableEquipment: EquipmentType[];
  preferredSplit: SplitType;
  weightKg?: number;
  heightCm?: number;
  injuryNotes?: string;
  joinedAt: Date;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalVolumeKg: number;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingState {
  goal: FitnessGoal | null;
  experienceLevel: ExperienceLevel | null;
  gymType: GymType | null;
  workoutsPerWeek: number;
  availableEquipment: EquipmentType[];
  workoutDurationMinutes: number;
  injuryNotes: string;
  completed: boolean;
}

// ─── Body Map ─────────────────────────────────────────────────────────────────

export type BodyView = "front" | "back";

export type DateRangeFilter = "today" | "last-workout" | "this-week" | "this-month";

export interface MuscleDetail {
  muscleId: MuscleId;
  displayName: string;
  lastTrained: Date | null;
  weeklySets: number;
  recoveryPercent: number;
  recommendedExercises: string[];
}

// ─── Progress / Analytics ─────────────────────────────────────────────────────

export interface VolumeDataPoint {
  date: string;
  volume: number;
  sessions: number;
}

export interface LiftProgressPoint {
  date: string;
  weight: number;
  reps: number;
  estimatedOneRM: number;
}

export interface MuscleVolumeData {
  muscleId: MuscleId;
  muscleName: string;
  weeklySets: number;
  weeklyVolume: number;
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export interface TrainingRecommendation {
  type: "train" | "skip" | "recover" | "progress";
  muscleIds: MuscleId[];
  message: string;
  suggestedTemplateId?: string;
}
