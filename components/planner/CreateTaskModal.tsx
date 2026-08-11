"use client";

import { useState } from "react";
import { X, Calendar, Clock, Tag, Zap, AlertCircle, Plus } from "lucide-react";
import { createPlannerTask } from "@/lib/actions/planner";

interface Territory {
  id: string;
  name: string;
  color: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  territories: Territory[];
  dateStr?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  territories,
  dateStr,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [territoryId, setTerritoryId] = useState(territories[0]?.id || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [energyRequired, setEnergyRequired] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [recurrenceType, setRecurrenceType] = useState<"NONE" | "DAILY" | "WEEKDAYS" | "WEEKENDS">("NONE");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await createPlannerTask({
      title: title.trim(),
      description: description.trim() || undefined,
      territoryId: territoryId || undefined,
      startTime,
      endTime,
      durationMinutes: 60,
      priority,
      energyRequired,
      recurrenceType,
      scheduledDateStr: dateStr,
    });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#047857]/30 border border-[#047857]/50 flex items-center justify-center">
            <Plus className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create Calendar Block</h3>
            <p className="text-xs text-slate-400">Schedule focused time block with territory alignment.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Deep Work, Quran Recitation, German Study..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#047857]"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recurrence</label>
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              >
                <option value="NONE">Once (No Recurrence)</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKDAYS">Weekdays (Mon-Fri)</option>
                <option value="WEEKENDS">Weekends</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Energy Required</label>
              <select
                value={energyRequired}
                onChange={(e) => setEnergyRequired(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
              >
                <option value="LOW">Low Energy</option>
                <option value="MEDIUM">Medium Energy</option>
                <option value="HIGH">High Energy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Subgoals</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes or sub-tasks..."
              className="w-full h-20 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#047857] resize-none"
            />
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
              Add Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
