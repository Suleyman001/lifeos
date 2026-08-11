"use client";

import { Target, Play, Clock, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CurrentMissionCardProps {
  mission?: {
    id: string;
    title: string;
    description: string | null;
    progressPercent: number;
    territory?: { name: string; color: string } | null;
  } | null;
}

export default function CurrentMissionCard({ mission }: CurrentMissionCardProps) {
  const title = mission?.title || "AWS Certification Study";
  const progress = mission?.progressPercent || 35.0;
  const territoryName = mission?.territory?.name || "Career";

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Current Mission
            </span>
            <h4 className="text-base font-bold text-white">{title}</h4>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
          {territoryName}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 line-clamp-2">
        Highest-impact available activity right now. Focus 45 minutes on Cloud Architect modules.
      </p>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Mission Progress</span>
          <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Suggested session: <strong>45 min</strong></span>
        </div>

        <Link
          href="/planner/daily"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-semibold transition-all group"
        >
          <Play className="w-3.5 h-3.5 fill-cyan-300 group-hover:scale-110 transition-transform" />
          <span>Launch Block</span>
        </Link>
      </div>
    </div>
  );
}
