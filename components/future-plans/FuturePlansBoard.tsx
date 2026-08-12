"use client";

import { useState } from "react";
import {
  Compass,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Save,
} from "lucide-react";
import { createFuturePlan, updateFuturePlan, deleteFuturePlan } from "@/lib/actions/future-plans";

type PlanCategory = "MARRIAGE" | "RELOCATION" | "CAREER" | "EDUCATION" | "BUSINESS" | "FINANCIAL_INDEPENDENCE" | "OTHER";
type PlanStatus = "PLANNED" | "IN_PROGRESS" | "ACHIEVED" | "POSTPONED";

interface FuturePlan {
  id: string;
  title: string;
  category: PlanCategory;
  status: PlanStatus;
  targetDate: Date | null;
  notes: string | null;
}

interface FuturePlansBoardProps {
  plans: FuturePlan[];
}

const CATEGORY_COLORS: Record<PlanCategory, string> = {
  MARRIAGE: "#ec4899",
  RELOCATION: "#0891b2",
  CAREER: "#047857",
  EDUCATION: "#7c3aed",
  BUSINESS: "#d97706",
  FINANCIAL_INDEPENDENCE: "#10b981",
  OTHER: "#475569",
};

const STATUS_COLORS: Record<PlanStatus, string> = {
  PLANNED: "text-slate-400 bg-slate-900 border border-slate-800",
  IN_PROGRESS: "text-cyan-300 bg-cyan-950/60 border border-cyan-800/60",
  ACHIEVED: "text-emerald-300 bg-emerald-950/60 border border-emerald-800/60",
  POSTPONED: "text-amber-300 bg-amber-950/60 border border-amber-800/60",
};

export default function FuturePlansBoard({ plans }: FuturePlansBoardProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "RELOCATION" as PlanCategory,
    targetDate: "",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    status: "PLANNED" as PlanStatus,
    targetDate: "",
    notes: "",
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createFuturePlan(form);
    setForm({ title: "", category: "RELOCATION", targetDate: "", notes: "" });
    setLoading(false);
    setShowCreate(false);
  }

  function startEdit(plan: FuturePlan) {
    setEditingId(plan.id);
    setEditForm({
      title: plan.title,
      status: plan.status,
      targetDate: plan.targetDate ? new Date(plan.targetDate).toISOString().split("T")[0] : "",
      notes: plan.notes || "",
    });
  }

  async function handleEditSave() {
    if (!editingId) return;
    setLoading(true);
    await updateFuturePlan(editingId, editForm);
    setEditingId(null);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this future plan?")) return;
    await deleteFuturePlan(id);
  }

  const categories: PlanCategory[] = ["MARRIAGE", "RELOCATION", "CAREER", "EDUCATION", "BUSINESS", "FINANCIAL_INDEPENDENCE", "OTHER"];

  // Group plans by category for timeline
  const sorted = [...plans].sort((a, b) => {
    if (!a.targetDate) return 1;
    if (!b.targetDate) return -1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Life Roadmap ({plans.length} Plans)</h3>
          <p className="text-xs text-slate-400">Long-term direction: Marriage, Relocation, Career, Education, Business & Financial Independence.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass-panel rounded-2xl p-6 border border-[#047857]/40 space-y-4">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Create Future Plan</h4>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Relocate to Germany, Get Master's Degree..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#047857]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Life Domain</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as PlanCategory })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  {categories.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Key milestones or requirements..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#047857] text-xs font-bold text-white">Save Plan</button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline View */}
      <div className="space-y-4">
        {sorted.map((plan, idx) => {
          const isEditing = editingId === plan.id;
          const catColor = CATEGORY_COLORS[plan.category] || "#475569";

          return (
            <div key={plan.id} className="flex gap-5">
              {/* Timeline Connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full mt-4 border-2 border-slate-700" style={{ backgroundColor: catColor }} />
                {idx < sorted.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
              </div>

              <div className="flex-1 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 mb-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as PlanStatus })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ACHIEVED">Achieved</option>
                        <option value="POSTPONED">Postponed</option>
                      </select>
                      <input
                        type="date"
                        value={editForm.targetDate}
                        onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      />
                      <input
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="Notes..."
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleEditSave} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#047857] text-xs font-bold text-white">
                        <Save className="w-3 h-3" /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: catColor }}>
                            {plan.category.replace("_", " ")}
                          </span>
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${STATUS_COLORS[plan.status]}`}>
                            {plan.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{plan.title}</h4>
                        {plan.notes && <p className="text-xs text-slate-400 mt-0.5">{plan.notes}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => startEdit(plan)} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(plan.id)} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {plan.targetDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Target: {new Date(plan.targetDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="p-10 text-center text-slate-500 text-xs glass-panel rounded-2xl border border-slate-800">
            No future plans yet. Click <strong>Add Plan</strong> to map your life roadmap.
          </div>
        )}
      </div>
    </div>
  );
}
