import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { Bot, Sparkles } from "lucide-react";

export default async function AICoachPage() {
  return (
    <PlaceholderModule
      title="AI Coach & Predictive Scheduling"
      subtitle="Planned for LifeOS V2. Will analyze energy, tasks, prayer schedules, and habits to optimize daily momentum."
      icon={Bot}
      badge="V2 Planned"
    >
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
        <Bot className="w-12 h-12 text-[#34d399] mx-auto animate-pulse" />
        <h4 className="text-lg font-bold text-white">AI Coach Module (V2 Upgrade)</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The database schema for AI Coach is pre-configured. In V2, the AI Coach will serve as your personal Islamic mentor, health coach, career coach, and productivity companion.
        </p>
      </div>
    </PlaceholderModule>
  );
}
