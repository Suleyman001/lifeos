"use client";

import { useState } from "react";
import { Globe, Award, Sliders, ArrowUpRight, Sparkles } from "lucide-react";
import { updateTerritoryWeight } from "@/lib/actions/territories";

interface Territory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  weight: number;
  xp: number;
  level: number;
  weeklyScore: number;
}

interface TerritoriesManagerProps {
  territories: Territory[];
}

export default function TerritoriesManager({ territories }: TerritoriesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [weightInput, setWeightInput] = useState<number>(1.0);

  async function handleSaveWeight(id: string) {
    await updateTerritoryWeight(id, weightInput);
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-[#34d399] px-2.5 py-0.5 rounded bg-[#047857]/30 border border-[#047857]/50">
            Life Domains Setup
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Territory Allocation & Domain Weights</h3>
          <p className="text-xs text-slate-400">
            Customize territory importance weights (e.g. Deen 1.5x, Health 1.2x) to personalize Better Than Yesterday math.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {territories.map((t) => (
          <div key={t.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.color }} />
                <h4 className="text-base font-bold text-white">{t.name}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">Level {t.level}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{t.description}</p>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Domain Weight:</span>
                {editingId === t.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="3.0"
                      value={weightInput}
                      onChange={(e) => setWeightInput(Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => handleSaveWeight(t.id)}
                      className="text-[10px] px-2 py-1 rounded bg-[#047857] text-white font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setWeightInput(t.weight);
                    }}
                    className="font-mono text-emerald-400 font-bold hover:underline"
                  >
                    {t.weight}x
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Total XP:</span>
                <span className="text-white font-bold">{t.xp} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
