"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, X, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { triggerBreakTheCycle } from "@/lib/actions/dashboard";

interface BreakTheCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BreakTheCycleModal({ isOpen, onClose }: BreakTheCycleModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    actionTitle: string;
    steps: string[];
  } | null>(null);

  if (!isOpen) return null;

  async function handleTrigger() {
    setLoading(true);
    const res = await triggerBreakTheCycle();
    setResult(res.recommendation);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-amber-500/50 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Break the Cycle Protocol
            </h3>
            <p className="text-xs text-amber-300/80">
              Immediate zero-shame momentum recovery.
            </p>
          </div>
        </div>

        {!result ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              If you feel distracted, exhausted, or off-track right now, do not try to fix everything at once. Focus on <strong>one micro-action</strong> to reset your state.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                LifeOS Recovery Philosophy:
              </div>
              <p>&bull; Mercy over shame.</p>
              <p>&bull; Progress over perfection.</p>
              <p>&bull; One bad hour does not ruin your day.</p>
            </div>

            <button
              onClick={handleTrigger}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-700 hover:from-amber-500 hover:to-emerald-600 text-sm font-bold text-white shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing energy & schedule...</span>
                </>
              ) : (
                <>
                  <span>Generate Single Recovery Action</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {result.actionTitle}
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {result.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-800/80 text-emerald-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              I&apos;m Ready — Resume Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
