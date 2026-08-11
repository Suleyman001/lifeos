"use client";

import { useState } from "react";
import {
  CheckSquare,
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Activity,
  Percent,
  Hash,
} from "lucide-react";
import { logHabitProgress } from "@/lib/actions/habits";
import CreateHabitModal from "./CreateHabitModal";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  type: "BINARY" | "NUMERIC" | "TIME_BASED" | "PERCENTAGE";
  targetValue: number;
  unit: string | null;
  currentStreak: number;
  longestStreak: number;
  momentum: number;
  logs: { completed: boolean; value: number }[];
  territory?: { name: string; color: string } | null;
}

interface Territory {
  id: string;
  name: string;
}

interface HabitsTrackerProps {
  initialHabits: Habit[];
  territories: Territory[];
}

export default function HabitsTracker({ initialHabits, territories }: HabitsTrackerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, number>>({});

  async function handleLog(habit: Habit, overrideVal?: number) {
    setLoadingId(habit.id);
    const existingLog = habit.logs.length > 0 ? habit.logs[0] : null;
    let valToLog = 0;

    if (habit.type === "BINARY") {
      valToLog = existingLog?.completed ? 0 : 1;
    } else {
      valToLog = overrideVal !== undefined ? overrideVal : inputValues[habit.id] ?? habit.targetValue;
    }

    await logHabitProgress({
      habitId: habit.id,
      value: valToLog,
      completed: valToLog >= habit.targetValue,
    });

    setLoadingId(null);
  }

  const filteredHabits = initialHabits.filter((h) => {
    if (filterType === "ALL") return true;
    return h.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "BINARY", "NUMERIC", "TIME_BASED", "PERCENTAGE"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                filterType === t
                  ? "bg-[#047857] text-white shadow-md shadow-[#047857]/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {t === "ALL" ? "All Types" : t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map((habit) => {
          const log = habit.logs.length > 0 ? habit.logs[0] : null;
          const isDone = log?.completed || false;
          const currentVal = log?.value || 0;

          return (
            <div
              key={habit.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                    {habit.type}
                  </span>
                  {habit.territory && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-semibold text-white"
                      style={{ backgroundColor: habit.territory.color }}
                    >
                      {habit.territory.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
                  {habit.currentStreak}d
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{habit.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {habit.description || `Target: ${habit.targetValue} ${habit.unit || ""}`}
                </p>
              </div>

              {/* Progress & Log Controls by Type */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                {habit.type === "BINARY" ? (
                  <button
                    onClick={() => handleToggleBinary(habit.id, isDone)}
                    disabled={loadingId === habit.id}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isDone
                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                    <span>{isDone ? "Completed Today" : "Mark Completed"}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Logged: {currentVal} / {habit.targetValue} {habit.unit}</span>
                      <span className="text-emerald-400 font-bold">
                        {Math.round((currentVal / habit.targetValue) * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={inputValues[habit.id] ?? currentVal}
                        onChange={(e) =>
                          setInputValues({ ...inputValues, [habit.id]: Number(e.target.value) })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => handleLog(habit)}
                        disabled={loadingId === habit.id}
                        className="px-3 py-1.5 rounded-lg bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white flex-shrink-0"
                      >
                        Log
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateHabitModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          territories={territories}
        />
      )}
    </div>
  );

  async function handleToggleBinary(habitId: string, isDone: boolean) {
    setLoadingId(habitId);
    await logHabitProgress({
      habitId,
      value: isDone ? 0 : 1,
      completed: !isDone,
    });
    setLoadingId(null);
  }
}
