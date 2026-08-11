import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { BarChart3, TrendingUp, Zap } from "lucide-react";

export default async function StatisticsPage() {
  return (
    <PlaceholderModule
      title="Statistics & Heatmaps"
      subtitle="Deep work, habit consistency, territory growth & GitHub-style contribution heatmap."
      icon={BarChart3}
    >
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white">GitHub-Style Contribution Heatmap</h4>
        <p className="text-xs text-slate-400">
          Visualizing your daily momentum and habit consistency over 365 days.
        </p>

        <div className="grid grid-cols-26 gap-1 pt-4 overflow-x-auto">
          {Array.from({ length: 154 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${
                i % 7 === 0
                  ? "bg-[#047857]"
                  : i % 5 === 0
                  ? "bg-[#059669]"
                  : i % 3 === 0
                  ? "bg-[#10b981]"
                  : "bg-slate-900 border border-slate-800"
              }`}
            />
          ))}
        </div>
      </div>
    </PlaceholderModule>
  );
}
