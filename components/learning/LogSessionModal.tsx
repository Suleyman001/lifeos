"use client";

import { useState } from "react";
import { X, BookOpen, Clock, Plus } from "lucide-react";
import { logStudySession } from "@/lib/actions/learning";

interface LearningItem {
  id: string;
  title: string;
}

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LearningItem[];
}

export default function LogSessionModal({ isOpen, onClose, items }: LogSessionModalProps) {
  const [learningItemId, setLearningItemId] = useState(items[0]?.id || "");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [itemsLearned, setItemsLearned] = useState(15);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await logStudySession({
      learningItemId,
      durationMinutes: Number(durationMinutes),
      itemsLearned: Number(itemsLearned),
      notes: notes.trim() || undefined,
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
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Log Study Session</h3>
            <p className="text-xs text-slate-400">Record German/Arabic vocabulary, cert study, or lessons.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Subject</label>
            <select
              value={learningItemId}
              onChange={(e) => setLearningItemId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Items / Vocab Learned</label>
              <input
                type="number"
                value={itemsLearned}
                onChange={(e) => setItemsLearned(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mastered German accusative prepositions..."
              className="w-full h-20 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
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
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md"
            >
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
