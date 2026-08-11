import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { Target, Award, Play } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function MissionsPage() {
  const missions = await prisma.mission.findMany({
    include: { territory: true, tasks: true },
    orderBy: { priority: "desc" },
  });

  return (
    <PlaceholderModule
      title="Missions"
      subtitle="High-impact macro objectives containing smaller tasks, habits, and challenges."
      icon={Target}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m) => (
          <div key={m.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                {m.territory?.name || "Career"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                {m.priority} Priority
              </span>
            </div>

            <h4 className="text-base font-bold text-white">{m.title}</h4>
            <p className="text-xs text-slate-400">{m.description}</p>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Progress</span>
                <span className="text-cyan-400 font-bold">{m.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-600 to-emerald-500 h-full rounded-full"
                  style={{ width: `${m.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PlaceholderModule>
  );
}
