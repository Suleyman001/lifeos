"use client";

import {
  Moon,
  Activity,
  BookOpen,
  Briefcase,
  Heart,
  Users,
  Brain,
  DollarSign,
  Compass,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Territory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  xp: number;
  level: number;
  weeklyScore: number;
}

const iconMap: Record<string, any> = {
  Moon,
  Activity,
  BookOpen,
  Briefcase,
  Heart,
  Users,
  Brain,
  DollarSign,
  Compass,
  Home,
};

interface TerritoryOverviewGridProps {
  territories: Territory[];
}

export default function TerritoryOverviewGrid({ territories }: TerritoryOverviewGridProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800/80">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white">Territory Overview</h3>
          <p className="text-xs text-slate-400">
            Every activity belongs to a territory. Growth across all 10 life domains.
          </p>
        </div>
        <Link
          href="/territories"
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {territories.map((t) => {
          const IconComponent = (t.icon && iconMap[t.icon]) || Moon;
          const progressPercent = Math.min(100, Math.max(15, (t.xp % 1000) / 10));

          return (
            <div
              key={t.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:translate-y-[-2px] group"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: `${t.color}30`, borderColor: t.color, borderWidth: 1 }}
                >
                  <IconComponent className="w-3.5 h-3.5" style={{ color: t.color }} />
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  Lvl {t.level}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                {t.name}
              </h4>

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Progress</span>
                  <span className="font-mono font-bold text-slate-300">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: t.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
