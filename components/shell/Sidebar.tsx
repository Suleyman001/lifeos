"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CalendarRange,
  Target,
  Globe,
  Swords,
  CheckSquare,
  BookOpen,
  Briefcase,
  BarChart3,
  BookMarked,
  Compass,
  Bot,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

interface SidebarProps {
  userLevel?: number;
  userXp?: number;
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Daily Planner", href: "/planner/daily", icon: Calendar },
  { name: "Weekly Planner", href: "/planner/weekly", icon: CalendarDays },
  { name: "Monthly Planner", href: "/planner/monthly", icon: CalendarRange },
  { name: "Missions", href: "/missions", icon: Target },
  { name: "Territories", href: "/territories", icon: Globe },
  { name: "Challenges", href: "/challenges", icon: Swords },
  { name: "Habits", href: "/habits", icon: CheckSquare },
  { name: "Learning", href: "/learning", icon: BookOpen },
  { name: "Career", href: "/career", icon: Briefcase },
  { name: "Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Journal", href: "/journal", icon: BookMarked },
  { name: "Future Plans", href: "/future-plans", icon: Compass },
  { name: "AI Coach", href: "/ai-coach", icon: Bot, badge: "V2" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ userLevel = 5, userXp = 1420 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#090d16]/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-md">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/60">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center shadow-lg shadow-[#047857]/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
                Life<span className="text-[#10b981]">OS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#047857]/30 text-[#34d399] border border-[#047857]/40 font-mono">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Break the Cycle. Start Now.</p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-[#047857]/20 text-emerald-300 border border-[#047857]/40 shadow-sm shadow-[#047857]/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#10b981]"
                        : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Progress Footer Card */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#047857]/40 border border-[#047857] flex items-center justify-center text-xs font-bold text-emerald-300">
              ME
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Administrator</p>
              <p className="text-[10px] text-slate-400">Level {userLevel} Architect</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" />
            {userXp} XP
          </span>
        </div>

        {/* Level XP Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#047857] to-[#10b981] h-full rounded-full transition-all duration-500"
            style={{ width: "68%" }}
          />
        </div>
      </div>
    </aside>
  );
}
