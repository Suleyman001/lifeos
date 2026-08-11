"use client";

import { useState } from "react";
import { Swords, Award, CheckCircle2, Flame, Plus, Sparkles, ArrowUpRight } from "lucide-react";
import { acceptChallenge, updateChallengeProgress } from "@/lib/actions/challenges";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  durationDays: number;
  targetValue: number;
  unit: string | null;
  rewardXp: number;
  territory?: { name: string; color: string } | null;
}

interface ActiveInstance {
  id: string;
  status: string;
  currentValue: number;
  progressPercent: number;
  startDate: Date;
  challenge: Challenge;
}

interface ChallengesManagerProps {
  masterChallenges: Challenge[];
  activeInstances: ActiveInstance[];
}

export default function ChallengesManager({
  masterChallenges,
  activeInstances,
}: ChallengesManagerProps) {
  const [tab, setTab] = useState<"ACTIVE" | "LIBRARY">("ACTIVE");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAccept(challengeId: string) {
    setLoadingId(challengeId);
    await acceptChallenge(challengeId);
    setLoadingId(null);
    setTab("ACTIVE");
  }

  async function handleIncrement(activeId: string) {
    setLoadingId(activeId);
    await updateChallengeProgress(activeId, 1);
    setLoadingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "ACTIVE"
                ? "bg-[#047857] text-white shadow-lg shadow-[#047857]/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            Active Side-Quests ({activeInstances.filter((a) => a.status === "ACTIVE").length})
          </button>
          <button
            onClick={() => setTab("LIBRARY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "LIBRARY"
                ? "bg-[#047857] text-white shadow-lg shadow-[#047857]/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            Quest Library ({masterChallenges.length})
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {tab === "ACTIVE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeInstances.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl glass-panel text-center text-slate-400 text-xs">
              No active quests currently running. Switch to <strong>Quest Library</strong> tab to accept your first challenge!
            </div>
          ) : (
            activeInstances.map((active) => {
              const c = active.challenge;
              const isCompleted = active.status === "COMPLETED";

              return (
                <div
                  key={active.id}
                  className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#34d399] px-2.5 py-0.5 rounded bg-[#047857]/30 border border-[#047857]/50">
                      {c.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{c.rewardXp} XP</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">
                        {active.currentValue} / {c.targetValue} {c.unit || ""}
                      </span>
                      <span className="text-emerald-400 font-bold">{active.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#047857] to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${active.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {isCompleted ? "Completed 🎉" : `${c.durationDays}d limit`}
                    </span>
                    {!isCompleted && (
                      <button
                        onClick={() => handleIncrement(active.id)}
                        disabled={loadingId === active.id}
                        className="px-3 py-1.5 rounded-lg bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white transition-all"
                      >
                        + Log Progress
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Library Tab View */}
      {tab === "LIBRARY" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {masterChallenges.map((c) => (
            <div key={c.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-[#34d399] px-2 py-0.5 rounded bg-[#047857]/30 border border-[#047857]/50">
                  {c.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">+{c.rewardXp} XP</span>
              </div>

              <h4 className="text-sm font-bold text-white">{c.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">{c.durationDays} Days</span>
                <button
                  onClick={() => handleAccept(c.id)}
                  disabled={loadingId === c.id}
                  className="px-3 py-1.5 rounded-lg bg-[#047857] hover:bg-[#059669] text-white font-bold transition-all"
                >
                  Accept Quest
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
