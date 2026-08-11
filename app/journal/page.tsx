import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { BookMarked, Heart, Smile } from "lucide-react";

export default async function JournalPage() {
  return (
    <PlaceholderModule
      title="Daily & Weekly Journal"
      subtitle="Zero-friction reflection engine: What went well? What brought me closer to Allah? What drained my energy?"
      icon={BookMarked}
    >
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white">Daily Reflection Questions</h4>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <strong>1. What went well today?</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <strong>2. What brought me closer to Allah today?</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <strong>3. What can improve tomorrow?</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <strong>4. What am I grateful for?</strong>
          </div>
        </div>
      </div>
    </PlaceholderModule>
  );
}
