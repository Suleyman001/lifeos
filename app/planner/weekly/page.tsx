import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import { CalendarDays, CheckCircle2, Flame, Target } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function WeeklyPlannerPage() {
  const territories = await prisma.territory.findMany({ orderBy: { weight: "desc" } });
  const tasks = await prisma.task.findMany({
    where: { isArchived: false },
    include: { territory: true },
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Weekly Planner"
          subtitle="7-day life domain allocation, habits, and weekly territory focus targets."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Weekly Summary Row */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Weekly Target Focus
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Current Week Overview</h3>
              <p className="text-xs text-slate-400">
                Balance deep work with family, Deen consistency, and physical recovery.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-2xl font-extrabold text-white font-mono">28.5 hrs</span>
                <p className="text-[11px] text-emerald-400 font-semibold">Planned Focus Time</p>
              </div>
            </div>
          </div>

          {/* 7-Day Columns */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3 min-h-[350px] flex flex-col justify-between"
              >
                <div>
                  <div className="border-b border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-white block">{day}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Day {idx + 1}</span>
                  </div>

                  <div className="space-y-2">
                    {tasks.slice(idx * 2, idx * 2 + 2).map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                      >
                        <span className="font-semibold text-slate-200 block truncate">{t.title}</span>
                        {t.territory && (
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded font-semibold text-white inline-block"
                            style={{ backgroundColor: t.territory.color }}
                          >
                            {t.territory.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                  Target: 4h Deep Work
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
