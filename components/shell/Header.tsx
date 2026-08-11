"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Search, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import InboxModal from "./InboxModal";
import BreakTheCycleModal from "../dashboard/BreakTheCycleModal";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = "Dashboard",
  subtitle = "Compare yourself to yesterday, not to other people.",
}: HeaderProps) {
  const [showInbox, setShowInbox] = useState(false);
  const [showBreakCycle, setShowBreakCycle] = useState(false);

  // Format today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#070a11]/80 backdrop-blur-md border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dateStr}</span>
          </div>

          {/* Quick Brain Dump Button */}
          <button
            onClick={() => setShowInbox(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Brain Dump</span>
            <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Break The Cycle Trigger */}
          <button
            onClick={() => setShowBreakCycle(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-emerald-700 hover:from-amber-500 hover:to-emerald-600 border border-amber-500/40 text-xs font-bold text-white shadow-md shadow-amber-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>⚠ Break the Cycle</span>
          </button>
        </div>
      </header>

      {/* Modals */}
      {showInbox && <InboxModal isOpen={showInbox} onClose={() => setShowInbox(false)} />}
      {showBreakCycle && (
        <BreakTheCycleModal isOpen={showBreakCycle} onClose={() => setShowBreakCycle(false)} />
      )}
    </>
  );
}
