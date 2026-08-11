import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import { CalendarRange, Target, Award, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function MonthlyPlannerPage() {
  const territories = await prisma.territory.findMany({ orderBy: { weight: "desc" } });
  const activeChallenges = await prisma.activeChallenge.findMany({
    include: { challenge: true },
  });

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Monthly Planner"
          subtitle="Long-term macro growth objectives, territory milestones, and challenge targets."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase text-indigo-400">
                Macro Horizon
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Monthly Objectives & Growth</h3>
              <p className="text-xs text-slate-400">
                Track long-term trajectory across Career, Knowledge, Deen, and Health.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
              Month Progress: 38%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {territories.map((t) => (
              <div
                key={t.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{t.name} Domain Goal</h4>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-semibold text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    Lvl {t.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {t.description || "Maintain high daily consistency and complete territory milestones."}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs text-slate-300">
                  <span>Monthly XP Target</span>
                  <span className="font-mono text-emerald-400 font-bold">1,200 XP</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
