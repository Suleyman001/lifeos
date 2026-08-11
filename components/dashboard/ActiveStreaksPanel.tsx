"use client";

import { useState } from "react";
import { Flame, CheckCircle2, Circle, ShieldCheck, Zap } from "lucide-react";
import { toggleHabitLog } from "@/lib/actions/habits";

interface Habit {
  id: string;
  title: string;
  currentStreak: number;
  momentum: number;
  logs: { completed: boolean }[];
  territory?: { name: string; color: string } | null;
}

interface ActiveStreaksPanelProps {
  habits: Habit[];
}

export default function ActiveStreaksPanel({ habits }: ActiveStreaksPanelProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggle(habitId: string) {
    setLoadingId(habitId);
    await toggleHabitLog(habitId);
    setLoadingId(null);
  }

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Active Streaks & Momentum</h3>
            <p className="text-xs text-slate-400">
              Recovery protection active — a missed day never resets progress to zero.
            </p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono font-bold">
          Grace Protection ON
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.slice(0, 6).map((habit) => {
          const isDone = habit.logs.length > 0 && habit.logs[0].completed;

          return (
            <div
              key={habit.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(habit.id)}
                  disabled={loadingId === habit.id}
                  className="text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                  )}
                </button>

                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                    {habit.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400/20" />
                      {habit.currentStreak}d streak
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {Math.round(habit.momentum)}% momentum
                    </span>
                  </div>
                </div>
              </div>

              {habit.territory && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-medium text-slate-300"
                  style={{ backgroundColor: `${habit.territory.color}25` }}
                >
                  {habit.territory.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
