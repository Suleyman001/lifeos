"use client";

import { useState } from "react";
import {
  Target,
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  PauseCircle,
  X,
  Save,
} from "lucide-react";
import { createMission, updateMission, deleteMission } from "@/lib/actions/missions";

interface Territory {
  id: string;
  name: string;
  color: string;
}

interface Mission {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  progressPercent: number;
  isCurrentMission: boolean;
  targetDate: Date | null;
  territory?: { name: string; color: string } | null;
  tasks: { id: string; title: string }[];
}

interface MissionsManagerProps {
  missions: Mission[];
  territories: Territory[];
}

export default function MissionsManager({ missions, territories }: MissionsManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    territoryId: territories[0]?.id || "",
    priority: "HIGH" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    targetDate: "",
    isCurrentMission: false,
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createMission(form);
    setForm({ title: "", description: "", territoryId: territories[0]?.id || "", priority: "HIGH", targetDate: "", isCurrentMission: false });
    setLoading(false);
    setShowCreate(false);
  }

  async function handleSetCurrent(id: string) {
    await updateMission(id, { isCurrentMission: true });
  }

  async function handleProgressSave(id: string) {
    setLoading(true);
    await updateMission(id, { progressPercent: editProgress });
    setEditingId(null);
    setLoading(false);
  }

  async function handleStatusToggle(mission: Mission) {
    const next = mission.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await updateMission(mission.id, { status: next });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this mission? This cannot be undone.")) return;
    await deleteMission(id);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Active Missions ({missions.length})</h3>
          <p className="text-xs text-slate-400">High-impact macro objectives. One active Current Mission drives the Dashboard.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Mission</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass-panel rounded-2xl p-6 border border-[#047857]/40 space-y-4">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Create New Mission</h4>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mission Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. AWS Certification, Run 100km..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#047857]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Territory</label>
                <select
                  value={form.territoryId}
                  onChange={(e) => setForm({ ...form, territoryId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  {territories.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isCurrentMission}
                    onChange={(e) => setForm({ ...form, isCurrentMission: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="text-xs text-slate-300">Set as Current Mission</span>
                </label>
              </div>
            </div>

            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mission description and goals..."
              className="w-full h-16 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
            />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#047857] text-xs font-bold text-white">Save Mission</button>
            </div>
          </form>
        </div>
      )}

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`glass-panel rounded-2xl p-6 border space-y-4 ${m.isCurrentMission ? "border-[#047857]/60 shadow-lg shadow-[#047857]/10" : "border-slate-800"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {m.isCurrentMission && (
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#047857]/30 border border-[#047857]/50 px-2 py-0.5 rounded mb-1.5 inline-block">
                    ★ CURRENT MISSION
                  </span>
                )}
                <h4 className="text-base font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{m.description}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">{m.priority}</span>
                {m.territory && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold text-white" style={{ backgroundColor: m.territory.color }}>
                    {m.territory.name}
                  </span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Progress</span>
                {editingId === m.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white font-mono"
                    />
                    <button onClick={() => handleProgressSave(m.id)} className="text-emerald-400 hover:text-emerald-300">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingId(m.id); setEditProgress(m.progressPercent); }}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    {m.progressPercent}%
                  </button>
                )}
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-600 to-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${m.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              {!m.isCurrentMission && (
                <button
                  onClick={() => handleSetCurrent(m.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#047857]/20 border border-[#047857]/40 text-[11px] font-semibold text-emerald-300 hover:bg-[#047857]/40 transition-all"
                >
                  <Star className="w-3 h-3" />
                  Set as Current
                </button>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => handleStatusToggle(m)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                  title={m.status === "ACTIVE" ? "Pause mission" : "Resume mission"}
                >
                  {m.status === "ACTIVE" ? <PauseCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {missions.length === 0 && !showCreate && (
          <div className="col-span-full p-10 text-center text-slate-500 text-xs glass-panel rounded-2xl border border-slate-800">
            No missions created yet. Click <strong>New Mission</strong> to define your first high-impact objective.
          </div>
        )}
      </div>
    </div>
  );
}
