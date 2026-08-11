import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { Briefcase, Globe2, Building, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function CareerPage() {
  const applications = await prisma.careerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const countries = ["Austria", "Germany", "Italy", "Spain", "Poland", "Netherlands", "Ireland"];

  return (
    <PlaceholderModule
      title="Career Module"
      subtitle="Job applications & relocation tracking across EU target countries."
      icon={Briefcase}
    >
      <div className="space-y-6">
        {/* Target Country Badges */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center gap-3 overflow-x-auto">
          <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-300">Target Countries:</span>
          {countries.map((c) => (
            <span
              key={c}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono font-medium flex-shrink-0"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl glass-panel text-center text-slate-400 text-xs">
              No active applications logged yet. Click Brain Dump or Add Application to track your career moves.
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{app.company}</h4>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{app.status}</span>
                </div>
                <p className="text-xs text-slate-300">{app.position} &bull; {app.country}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </PlaceholderModule>
  );
}
