"use client";

import { useState } from "react";
import { BookMarked, Plus, Trash2, Smile, ChevronDown, ChevronUp, Save } from "lucide-react";
import { saveJournalEntry, deleteJournalEntry } from "@/lib/actions/journal";

type JournalType = "DAILY" | "WEEKLY" | "MONTHLY";

interface JournalEntry {
  id: string;
  date: Date;
  type: JournalType;
  whatWentWell: string | null;
  whatToImprove: string | null;
  gratitude: string | null;
  distractions: string | null;
  whatILearned: string | null;
  closerToAllah: string | null;
  energyDrainers: string | null;
  energyGivers: string | null;
  smallWin: string | null;
  tomorrowAction: string | null;
  moodScore: number | null;
}

interface JournalEditorProps {
  initialEntries: JournalEntry[];
}

const MOOD_EMOJIS = ["😞", "😔", "😐", "🙂", "😊", "😄", "🌟", "⚡", "🔥", "✨"];

export default function JournalEditor({ initialEntries }: JournalEditorProps) {
  const [activeType, setActiveType] = useState<JournalType>("DAILY");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setSaving] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const existingEntry = initialEntries.find(
    (e) =>
      e.type === activeType &&
      new Date(e.date).toISOString().split("T")[0] === selectedDate
  );

  const [form, setForm] = useState({
    whatWentWell: existingEntry?.whatWentWell || "",
    whatToImprove: existingEntry?.whatToImprove || "",
    gratitude: existingEntry?.gratitude || "",
    distractions: existingEntry?.distractions || "",
    whatILearned: existingEntry?.whatILearned || "",
    closerToAllah: existingEntry?.closerToAllah || "",
    energyDrainers: existingEntry?.energyDrainers || "",
    energyGivers: existingEntry?.energyGivers || "",
    smallWin: existingEntry?.smallWin || "",
    tomorrowAction: existingEntry?.tomorrowAction || "",
    moodScore: existingEntry?.moodScore ?? 7,
  });

  const DAILY_PROMPTS = [
    { key: "whatWentWell", label: "What went well today?", placeholder: "Reflect on your wins..." },
    { key: "whatToImprove", label: "What can improve tomorrow?", placeholder: "Be honest but kind to yourself..." },
    { key: "gratitude", label: "What am I grateful for?", placeholder: "Al-Hamdulillah for..." },
    { key: "distractions", label: "What distracted me?", placeholder: "Be honest..." },
    { key: "whatILearned", label: "What did I learn?", placeholder: "Deen, skill, or self-knowledge..." },
    { key: "closerToAllah", label: "What brought me closer to Allah today?", placeholder: "Prayer, Quran, dhikr, good deed..." },
    { key: "energyDrainers", label: "What drained my energy?", placeholder: "Identify energy leaks..." },
    { key: "energyGivers", label: "What gave me energy?", placeholder: "Exercise, conversation, rest..." },
    { key: "smallWin", label: "What was today's small win?", placeholder: "Celebrate every step..." },
    { key: "tomorrowAction", label: "What is tomorrow's most important action?", placeholder: "Single highest-impact next step..." },
  ];

  async function handleSave() {
    setSaving(true);
    await saveJournalEntry({ date: selectedDate, type: activeType, ...form });
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteJournalEntry(id);
  }

  const pastEntries = initialEntries.filter((e) => e.type === activeType).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(["DAILY", "WEEKLY", "MONTHLY"] as JournalType[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === t
                  ? "bg-[#047857] text-white shadow-lg shadow-[#047857]/30"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {t} Reflection
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#047857]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-400" />
                {activeType} Entry — {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              {existingEntry && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-mono">
                  Saved
                </span>
              )}
            </div>

            {/* Mood Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Mood Score</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{MOOD_EMOJIS[form.moodScore - 1]}</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{form.moodScore}/10</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form.moodScore}
                onChange={(e) => setForm({ ...form, moodScore: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Reflection Prompts */}
            <div className="space-y-4">
              {DAILY_PROMPTS.map((prompt) => (
                <div key={prompt.key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {prompt.label}
                  </label>
                  <textarea
                    value={(form as any)[prompt.key]}
                    onChange={(e) => setForm({ ...form, [prompt.key]: e.target.value })}
                    placeholder={prompt.placeholder}
                    className="w-full h-20 bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#047857] transition-colors resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Local — your reflections stay on your device only.
              </span>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#047857] hover:bg-[#059669] text-xs font-bold text-white shadow-lg transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {loading ? "Saving..." : "Save Reflection"}
              </button>
            </div>
          </div>
        </div>

        {/* Past Entries Sidebar */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Past {activeType} Entries</h4>
            {pastEntries.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No {activeType.toLowerCase()} entries yet.</p>
            ) : (
              pastEntries.map((entry) => {
                const isExpanded = expandedEntryId === entry.id;
                return (
                  <div key={entry.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                        className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1"
                      >
                        {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        <span className="text-lg">{MOOD_EMOJIS[(entry.moodScore || 7) - 1]}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="text-xs text-slate-400 space-y-1.5 pt-1 border-t border-slate-800/60">
                        {entry.whatWentWell && <p><strong className="text-slate-300">Win:</strong> {entry.whatWentWell}</p>}
                        {entry.closerToAllah && <p><strong className="text-slate-300">Deen:</strong> {entry.closerToAllah}</p>}
                        {entry.tomorrowAction && <p><strong className="text-slate-300">Tomorrow:</strong> {entry.tomorrowAction}</p>}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
