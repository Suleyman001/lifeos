"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Tag,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toggleTaskOccurrence } from "@/lib/actions/planner";
import CreateTaskModal from "@/components/planner/CreateTaskModal";
import { useRouter } from "next/navigation";

interface TaskOccurrence {
  id: string;
  status: string;
  scheduledDate: Date;
  task: {
    id: string;
    title: string;
    description: string | null;
    startTime: string | null;
    endTime: string | null;
    estimatedDurationMinutes: number | null;
    priority: string;
    energyRequired: string;
    recurrenceType: string;
    territory?: { name: string; color: string } | null;
  };
}

interface Territory {
  id: string;
  name: string;
  color: string;
}

interface DailyPlannerGridProps {
  initialOccurrences: TaskOccurrence[];
  territories: Territory[];
  dateStr: string;
}

export default function DailyPlannerGrid({
  initialOccurrences,
  territories,
  dateStr,
}: DailyPlannerGridProps) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 05:00 to 22:00

  // Date Navigation
  const currentDate = new Date(dateStr);
  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const prevDateStr = prevDate.toISOString().split("T")[0];
  const nextDateStr = nextDate.toISOString().split("T")[0];

  async function handleToggle(id: string, status: string) {
    setLoadingId(id);
    await toggleTaskOccurrence(id, status);
    setLoadingId(null);
  }

  const completedCount = initialOccurrences.filter((o) => o.status === "COMPLETED").length;
  const totalCount = initialOccurrences.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Date & Control Header Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => router.push(`/planner/daily?date=${prevDateStr}`)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push(`/planner/daily`)}
              className="px-3 py-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => router.push(`/planner/daily?date=${nextDateStr}`)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <p className="text-xs text-slate-400">
              {completedCount} of {totalCount} task blocks completed ({completionPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Day Completion:</span>
            <span className="font-mono font-bold text-emerald-400">{completionPercent}%</span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#047857] to-[#059669] hover:from-[#059669] hover:to-emerald-500 text-xs font-bold text-white shadow-lg shadow-[#047857]/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Timeline Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Grid (2 Columns wide) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Visual Calendar Timeline (05:00 - 22:00)</span>
            <span className="text-[11px] font-mono text-slate-500">Color-coded by Territory</span>
          </h4>

          <div className="space-y-3 relative min-h-[550px]">
            {hours.map((hour) => {
              const hourFormatted = `${hour < 10 ? "0" : ""}${hour}:00`;
              const matchedOccurrences = initialOccurrences.filter((occ) => {
                const start = occ.task.startTime || "09:00";
                const startHour = parseInt(start.split(":")[0], 10);
                return startHour === hour;
              });

              return (
                <div key={hour} className="flex items-start gap-4 border-t border-slate-800/40 pt-2 min-h-[48px]">
                  <span className="text-xs font-mono font-bold text-slate-400 w-12 flex-shrink-0 pt-1">
                    {hourFormatted}
                  </span>

                  <div className="flex-1 space-y-2">
                    {matchedOccurrences.length === 0 ? (
                      <div className="h-full border border-dashed border-slate-800/30 rounded-lg hover:border-slate-800/60 transition-colors" />
                    ) : (
                      matchedOccurrences.map((occ) => {
                        const isDone = occ.status === "COMPLETED";
                        const territoryColor = occ.task.territory?.color || "#047857";

                        return (
                          <div
                            key={occ.id}
                            onMouseEnter={() => setHoveredId(occ.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="p-3.5 rounded-xl border transition-all relative group flex items-center justify-between cursor-pointer"
                            style={{
                              backgroundColor: isDone ? "rgba(15, 23, 42, 0.4)" : `${territoryColor}18`,
                              borderColor: isDone ? "rgba(30, 41, 59, 0.6)" : `${territoryColor}50`,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggle(occ.id, occ.status)}
                                disabled={loadingId === occ.id}
                                className="focus:outline-none"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400" />
                                )}
                              </button>

                              <div>
                                <h5
                                  className={`text-xs font-bold ${
                                    isDone ? "line-through text-slate-500" : "text-white"
                                  }`}
                                >
                                  {occ.task.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    {occ.task.startTime} - {occ.task.endTime}
                                  </span>
                                  {occ.task.territory && (
                                    <span
                                      className="px-1.5 py-0.2 rounded font-sans font-semibold text-[10px]"
                                      style={{
                                        backgroundColor: `${occ.task.territory.color}30`,
                                        color: occ.task.territory.color,
                                      }}
                                    >
                                      {occ.task.territory.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold">
                                {occ.task.priority}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                                {occ.task.energyRequired}
                              </span>
                            </div>

                            {/* Rich Hover Popover */}
                            {hoveredId === occ.id && (
                              <div className="absolute left-0 bottom-full mb-2 z-30 w-72 glass-panel p-4 rounded-xl border border-slate-700 shadow-2xl space-y-2 pointer-events-none animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="text-xs font-bold text-white">{occ.task.title}</span>
                                  <span className="text-[10px] text-emerald-400 font-mono">+50 XP</span>
                                </div>
                                <p className="text-xs text-slate-300">
                                  {occ.task.description || "No specific notes provided for this time block."}
                                </p>
                                <div className="text-[10px] text-slate-400 font-mono space-y-1 pt-1 border-t border-slate-800/60">
                                  <div>Recurrence: <strong>{occ.task.recurrenceType}</strong></div>
                                  <div>Duration: <strong>{occ.task.estimatedDurationMinutes || 60} mins</strong></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Summary & Quick List Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Day Task Queue ({initialOccurrences.length})
            </h4>

            <div className="space-y-2.5">
              {initialOccurrences.map((occ) => {
                const isDone = occ.status === "COMPLETED";

                return (
                  <div
                    key={occ.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(occ.id, occ.status)}
                        className="focus:outline-none"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <span className={isDone ? "line-through text-slate-500" : "text-slate-200 font-medium"}>
                        {occ.task.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{occ.task.startTime}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          territories={territories}
          dateStr={dateStr}
        />
      )}
    </div>
  );
}
