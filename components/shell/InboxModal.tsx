"use client";

import { useState } from "react";
import { X, Sparkles, Send } from "lucide-react";
import { addInboxItem } from "@/lib/actions/inbox";

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InboxModal({ isOpen, onClose }: InboxModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    await addInboxItem(content);
    setContent("");
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#047857]/30 border border-[#047857]/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Brain Dump / Quick Capture</h3>
            <p className="text-xs text-slate-400">
              Capture any thought, idea, or task instantly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. Learn Docker, Buy miswak, Research master's degree, Apply to AWS job..."
            className="w-full h-32 bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#047857] transition-colors resize-none"
            autoFocus
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Items can be converted into tasks or habits later.
            </span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-xs font-semibold text-white transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Thought</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
