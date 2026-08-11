"use client";

import { useState } from "react";
import { X, Plus, CheckSquare } from "lucide-react";
import { createHabit } from "@/lib/actions/habits";

interface Territory {
  id: string;
  name: string;
}

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  territories: Territory[];
}

export default function CreateHabitModal({ isOpen, onClose, territories }: CreateHabitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [territoryId, setTerritoryId] = useState(territories[0]?.id || "");
  const [type, setType] = useState<"BINARY" | "NUMERIC" | "TIME_BASED" | "PERCENTAGE">("BINARY");
  const [targetValue, setTargetValue] = useState(1);
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await createHabit({
      title: title.trim(),
      description: description.trim() || undefined,
      territoryId,
      type,
      targetValue: Number(targetValue),
      unit: unit.trim() || undefined,
    });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#047857]/30 border border-[#047857]/50 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create New Habit</h3>
            <p className="text-xs text-slate-400">Configure binary, numeric, time, or percentage habit.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fajr Prayer, 7,500 Steps, Quran 30m, AWS Course..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#047857]"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as any;
                  setType(newType);
                  if (newType === "BINARY") setTargetValue(1);
                  if (newType === "TIME_BASED") { setTargetValue(30); setUnit("minutes"); }
                  if (newType === "PERCENTAGE") { setTargetValue(100); setUnit("%"); }
                  if (newType === "NUMERIC") { setTargetValue(7500); setUnit("steps"); }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              >
                <option value="BINARY">Type 1: Binary (Done / Not Done)</option>
                <option value="NUMERIC">Type 2: Numeric (Steps, Pages, Liters)</option>
                <option value="TIME_BASED">Type 3: Time-Based (Duration in min)</option>
                <option value="PERCENTAGE">Type 4: Percentage / Progress (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Territory</label>
              <select
                value={territoryId}
                onChange={(e) => setTerritoryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              >
                {territories.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Value</label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit (Optional)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. steps, min, L, %"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md"
            >
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
