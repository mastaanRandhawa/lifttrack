"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, TrendingUp, Dumbbell, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BENCH_PROGRESS,
  SQUAT_PROGRESS,
  VOLUME_HISTORY,
  MUSCLE_VOLUME_DATA,
  PERSONAL_RECORDS,
  SESSION_HISTORY,
} from "@/lib/mock-data";

const LIFT_OPTIONS = [
  { id: "bench", label: "Bench Press", data: BENCH_PROGRESS },
  { id: "squat", label: "Back Squat", data: SQUAT_PROGRESS },
];

const CHART_COLORS = {
  primary: "#6366f1",
  violet: "#8b5cf6",
  green: "#22c55e",
  amber: "#f59e0b",
};

const tooltipStyle = {
  backgroundColor: "#111118",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#f1f1f5",
  fontSize: "12px",
};

function formatDate(date: Date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

export default function ProgressPage() {
  const [activeLift, setActiveLift] = useState("bench");
  const liftData = LIFT_OPTIONS.find((l) => l.id === activeLift)?.data ?? BENCH_PROGRESS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Progress</h1>
        <p className="text-muted-foreground mt-1">Track your strength and consistency over time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="w-5 h-5 text-amber-400" />} label="PRs this month" value="4" />
        <StatCard icon={<Dumbbell className="w-5 h-5 text-primary" />} label="Total sessions" value="142" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Avg. sessions/week" value="4.2" />
        <StatCard icon={<Calendar className="w-5 h-5 text-violet-400" />} label="Training weeks" value="32" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lift Progression Chart */}
        <div className="p-5 rounded-[18px] bg-card border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-foreground">Lift Progression</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Estimated 1RM over time</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border">
              {LIFT_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLift(l.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeLift === l.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={liftData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}kg`, "e1RM"]}
              />
              <Line
                type="monotone"
                dataKey="estimatedOneRM"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Volume Chart */}
        <div className="p-5 rounded-[18px] bg-card border border-border">
          <div className="mb-5">
            <h2 className="font-heading font-bold text-foreground">Weekly Volume</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Total training volume (kg) per week</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VOLUME_HISTORY} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${Number(v).toLocaleString()} kg`, "Volume"]}
              />
              <Bar
                dataKey="volume"
                fill={CHART_COLORS.violet}
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Muscle Volume Distribution */}
      <div className="p-5 rounded-[18px] bg-card border border-border">
        <div className="mb-5">
          <h2 className="font-heading font-bold text-foreground">Muscle Group Volume</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Weekly sets per muscle group</p>
        </div>
        <div className="space-y-3">
          {MUSCLE_VOLUME_DATA.sort((a, b) => b.weeklySets - a.weeklySets).map((m) => {
            const maxSets = Math.max(...MUSCLE_VOLUME_DATA.map((x) => x.weeklySets));
            const pct = maxSets > 0 ? (m.weeklySets / maxSets) * 100 : 0;
            const isLow = m.weeklySets < 6;
            return (
              <div key={m.muscleId} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-28 shrink-0">{m.muscleName}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", isLow ? "bg-amber-400/60" : "bg-primary")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-foreground w-6 text-right">{m.weeklySets}</span>
                  <span className="text-xs text-muted-foreground">sets</span>
                  {isLow && m.weeklySets > 0 && (
                    <span className="text-xs text-amber-400 font-medium">low</span>
                  )}
                  {m.weeklySets === 0 && (
                    <span className="text-xs text-muted-foreground">skipped</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Records */}
        <div className="p-5 rounded-[18px] bg-card border border-border">
          <h2 className="font-heading font-bold text-foreground mb-4">Personal Records</h2>
          <div className="space-y-3">
            {PERSONAL_RECORDS.map((pr) => (
              <div key={pr.exerciseId} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(pr.achievedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{pr.weight}kg × {pr.reps}</p>
                  <p className="text-xs text-muted-foreground">e1RM: {pr.estimatedOneRepMax}kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session History */}
        <div className="p-5 rounded-[18px] bg-card border border-border">
          <h2 className="font-heading font-bold text-foreground mb-4">Session History</h2>
          <div className="space-y-3">
            {SESSION_HISTORY.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{session.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(session.startedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{session.durationMinutes}min</p>
                  <p className="text-xs text-muted-foreground">{(session.totalVolume ?? 0).toLocaleString()} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-[18px] bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {icon}
      </div>
      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
