"use client";

import { useState } from "react";
import { BookOpen, Plus, Clock, Sparkles, Award } from "lucide-react";
import LogSessionModal from "./LogSessionModal";

interface LearningItem {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  timeSpentMinutes: number;
  vocabLearned: number;
  targetVocab: number | null;
  status: string;
  sessions: { id: string; durationMinutes: number; itemsLearned: number; date: Date }[];
}

interface LearningCenterProps {
  items: LearningItem[];
}

export default function LearningCenter({ items }: LearningCenterProps) {
  const [showLogModal, setShowLogModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Active Learning Subjects ({items.length})</h3>
          <p className="text-xs text-slate-400">German/Arabic vocabulary, IT certs (AWS/Azure), programming & books.</p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-xs font-bold text-white shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Study Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">{item.category}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                {item.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white">{item.title}</h4>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Progress</span>
                <span className="text-teal-400 font-bold">{item.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-600 to-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
              <span>Vocab Learned: <strong>{item.vocabLearned} / {item.targetVocab || 500}</strong></span>
              <span>Time Spent: <strong>{item.timeSpentMinutes} mins</strong></span>
            </div>
          </div>
        ))}
      </div>

      {showLogModal && (
        <LogSessionModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          items={items}
        />
      )}
    </div>
  );
}
