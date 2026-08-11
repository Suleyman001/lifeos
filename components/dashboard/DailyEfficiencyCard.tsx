"use client";

import { Activity, Zap, Clock, ShieldCheck } from "lucide-react";

interface DailyEfficiencyCardProps {
  focusedMinutes?: number;
  deepWorkMinutes?: number;
  wastedMinutes?: number;
  productivePercent?: number;
}

export default function DailyEfficiencyCard({
  focusedMinutes = 185,
  deepWorkMinutes = 120,
  wastedMinutes = 35,
  productivePercent = 84.0,
}: DailyEfficiencyCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Daily Efficiency</h4>
              <p className="text-xs text-slate-400">Focus & time output</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {productivePercent}%
            </span>
            <p className="text-[10px] text-slate-400">Productive</p>
          </div>
        </div>

        {/* Efficiency Meters */}
        <div className="space-y-3.5 my-2">
          {/* Focused Time */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Focused Time
              </span>
              <span className="font-mono text-white font-bold">{Math.floor(focusedMinutes / 60)}h {focusedMinutes % 60}m</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Deep Work */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Deep Work
              </span>
              <span className="font-mono text-white font-bold">{Math.floor(deepWorkMinutes / 60)}h {deepWorkMinutes % 60}m</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: "60%" }} />
            </div>
          </div>

          {/* Wasted Time */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                Wasted Time
              </span>
              <span className="font-mono text-red-400 font-bold">{wastedMinutes}m</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500/80 h-full rounded-full" style={{ width: "25%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Planned: <strong>4.0 hrs</strong></span>
        <span>Completed: <strong className="text-emerald-400">3.1 hrs</strong></span>
      </div>
    </div>
  );
}
