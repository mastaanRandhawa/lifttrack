"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Target,
  Dumbbell,
  Bell,
  BellOff,
  LogOut,
  ChevronRight,
  Trophy,
  Flame,
  Activity,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store";
import { MOCK_USER } from "@/lib/mock-data";

const GOAL_LABELS: Record<string, string> = {
  "build-muscle": "Build Muscle",
  strength: "Build Strength",
  "lose-fat": "Lose Fat",
  "general-fitness": "General Fitness",
};

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push / Pull / Legs",
  "upper-lower": "Upper / Lower",
  "full-body": "Full Body",
  "beginner-3day": "Beginner 3-Day",
  custom: "Custom",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const profile = user ?? MOCK_USER;

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    streakAlerts: true,
    recoveryAlerts: false,
    prCelebrations: true,
    inactivityNudges: false,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile card */}
      <div className="p-5 rounded-[18px] bg-card border border-border">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-xl font-bold text-white font-heading shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{profile.displayName}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Member since {new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="font-heading font-bold text-foreground">{profile.currentStreak}<span className="text-muted-foreground text-xs font-normal"> d</span></p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
            <p className="font-heading font-bold text-foreground">{profile.totalSessions}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-muted-foreground">Best Streak</span>
            </div>
            <p className="font-heading font-bold text-foreground">{profile.longestStreak}<span className="text-muted-foreground text-xs font-normal"> d</span></p>
          </div>
        </div>
      </div>

      {/* Training Settings */}
      <div className="p-5 rounded-[18px] bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Training Settings</h3>
        </div>
        <div className="space-y-0 divide-y divide-border">
          <SettingRow label="Goal" value={GOAL_LABELS[profile.goal] ?? profile.goal} />
          <SettingRow label="Experience Level" value={EXPERIENCE_LABELS[profile.experienceLevel] ?? profile.experienceLevel} />
          <SettingRow label="Preferred Split" value={SPLIT_LABELS[profile.preferredSplit] ?? profile.preferredSplit} />
          <SettingRow label="Days per week" value={`${profile.workoutsPerWeek} days`} />
          <SettingRow label="Gym type" value={profile.gymType === "commercial" ? "Commercial Gym" : profile.gymType === "home" ? "Home Gym" : "Bodyweight Only"} />
        </div>
        <Button variant="outline" size="sm" className="mt-4 gap-2">
          <Settings className="w-3.5 h-3.5" /> Edit Preferences
        </Button>
      </div>

      {/* Body stats */}
      {(profile.weightKg || profile.heightCm) && (
        <div className="p-5 rounded-[18px] bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Body Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {profile.weightKg && (
              <div className="p-3 rounded-xl bg-surface border border-border">
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="font-semibold text-foreground">{profile.weightKg} kg</p>
              </div>
            )}
            {profile.heightCm && (
              <div className="p-3 rounded-xl bg-surface border border-border">
                <p className="text-xs text-muted-foreground mb-1">Height</p>
                <p className="font-semibold text-foreground">{profile.heightCm} cm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="p-5 rounded-[18px] bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {(
            [
              { key: "workoutReminders", label: "Workout Reminders", desc: "Get reminded on your training days" },
              { key: "streakAlerts", label: "Streak Alerts", desc: "Alert when streak is at risk" },
              { key: "recoveryAlerts", label: "Recovery Alerts", desc: "Notify when muscles are fully recovered" },
              { key: "prCelebrations", label: "PR Celebrations", desc: "Celebrate new personal records" },
              { key: "inactivityNudges", label: "Inactivity Nudges", desc: "Nudge after 3+ days without training" },
            ] as const
          ).map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor={key} className="text-sm font-medium text-foreground cursor-pointer">
                  {label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Switch
                id={key}
                checked={notifications[key]}
                onCheckedChange={(v) =>
                  setNotifications((n) => ({ ...n, [key]: v }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Account actions */}
      <div className="p-5 rounded-[18px] bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Account</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors text-sm text-foreground">
            <span>Export data</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors text-sm text-foreground">
            <span>Privacy settings</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 transition-colors text-sm text-destructive">
            <span>Delete account</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full gap-2 text-muted-foreground hover:text-foreground"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
