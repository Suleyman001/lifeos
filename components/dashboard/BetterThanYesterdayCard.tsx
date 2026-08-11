"use client";

import { TrendingUp, Sparkles, ShieldAlert, ArrowUpRight } from "lucide-react";

interface BetterThanYesterdayCardProps {
  score?: number;
}

export default function BetterThanYesterdayCard({ score = 5.2 }: BetterThanYesterdayCardProps) {
  const isPositive = score >= 0;

  return (
    <div className="glass-panel glass-card-emerald rounded-2xl p-6 relative overflow-hidden shadow-xl border border-[#047857]/40">
      {/* Subtle Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#047857]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#047857]/40 text-[#34d399] border border-[#047857]/60 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Core Philosophy Metric
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Better Than Yesterday
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            &ldquo;Compare yourself to yesterday, not to other people.&rdquo;
          </p>
        </div>

        {/* Delta Gauge Pill */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center text-white shadow-lg shadow-[#047857]/40">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black text-white font-mono">
                {isPositive ? `+${score}%` : `${score}%`}
              </span>
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-[11px] font-medium text-emerald-300">
              Composite growth vs yesterday
            </p>
          </div>
        </div>
      </div>

      {/* Constructive Guidance Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <strong>Current Context:</strong> Strong Fajr consistency & focused AWS deep work block.
        </span>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Updated 10m ago
        </span>
      </div>
    </div>
  );
}
