"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3, Flame, Zap, TrendingUp, Activity } from "lucide-react";

interface DailySummary {
  date: Date;
  betterThanYesterdayScore: number;
  totalXpEarned: number;
  habitsCompleted: number;
  totalHabits: number;
  deepWorkMinutes: number;
}

interface HabitLog {
  date: Date;
  completed: boolean;
  xpEarned: number;
}

interface Territory {
  name: string;
  xp: number;
  color: string;
  level: number;
}

interface Habit {
  id: string;
  title: string;
  currentStreak: number;
  longestStreak: number;
  logs: { completed: boolean }[];
}

interface StatisticsDashboardProps {
  dailySummaries: DailySummary[];
  habitLogs: HabitLog[];
  territories: Territory[];
  habits: Habit[];
}

function buildHeatmapData(habitLogs: HabitLog[]) {
  const map: Record<string, { xp: number; count: number }> = {};
  for (const log of habitLogs) {
    const key = new Date(log.date).toISOString().split("T")[0];
    if (!map[key]) map[key] = { xp: 0, count: 0 };
    map[key].xp += log.xpEarned;
    if (log.completed) map[key].count += 1;
  }
  return map;
}

function getHeatColor(count: number) {
  if (count === 0) return "bg-slate-900 border border-slate-800";
  if (count <= 1) return "bg-emerald-950";
  if (count <= 3) return "bg-emerald-900";
  if (count <= 5) return "bg-emerald-700";
  return "bg-emerald-500";
}

export default function StatisticsDashboard({
  dailySummaries,
  habitLogs,
  territories,
  habits,
}: StatisticsDashboardProps) {
  const heatmap = buildHeatmapData(habitLogs);

  // Build 52-week grid (364 days)
  const today = new Date();
  const days: { key: string; label: string }[] = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days.push({ key, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  }

  // Trend chart data
  const trendData = dailySummaries.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.betterThanYesterdayScore,
    xp: s.totalXpEarned,
    deepWork: Math.round(s.deepWorkMinutes / 60),
  }));

  // Territory XP bar data
  const terrData = territories.slice(0, 8).map((t) => ({
    name: t.name.slice(0, 8),
    xp: t.xp,
    fill: t.color,
  }));

  // Habit consistency table
  const habitStats = habits.slice(0, 8).map((h) => {
    const completedLogs = h.logs.filter((l) => l.completed).length;
    const rate = h.logs.length > 0 ? Math.round((completedLogs / h.logs.length) * 100) : 0;
    return { ...h, consistencyRate: rate };
  });

  const tooltipStyle = {
    backgroundColor: "#090d16",
    borderColor: "#1e293b",
    borderRadius: "8px",
    fontSize: "11px",
    color: "#f1f5f9",
  };

  return (
    <div className="space-y-6">
      {/* GitHub Heatmap */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              52-Week Contribution Heatmap
            </h3>
            <p className="text-xs text-slate-400">Color-coded daily habit completion and XP intensity.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Less</span>
            {["bg-slate-900 border border-slate-800", "bg-emerald-950", "bg-emerald-900", "bg-emerald-700", "bg-emerald-500"].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dayI = weekIdx * 7 + dayIdx;
                  if (dayI >= days.length) return <div key={dayIdx} className="w-3 h-3" />;
                  const { key, label } = days[dayI];
                  const data = heatmap[key] || { xp: 0, count: 0 };
                  return (
                    <div
                      key={dayIdx}
                      title={`${label}: ${data.count} habits completed, ${data.xp} XP`}
                      className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-emerald-400 transition-all ${getHeatColor(data.count)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Better Than Yesterday Trend */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Better Than Yesterday — 30 Day Trend
          </h4>
          {trendData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-slate-500">
              Log daily summaries to see your trend.
            </div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Territory XP Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Territory XP Breakdown
          </h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terrData} barSize={22}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} XP`, "Total XP"]} />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {terrData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Habit Consistency Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Habit Consistency & Streak History (Last 30 Days)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left py-2 pr-4 font-semibold">Habit</th>
                <th className="text-center py-2 px-3 font-semibold">Current Streak</th>
                <th className="text-center py-2 px-3 font-semibold">Longest Streak</th>
                <th className="text-center py-2 px-3 font-semibold">30-Day Consistency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {habitStats.map((h) => (
                <tr key={h.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-slate-200">{h.title}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-amber-400 font-bold">{h.currentStreak}d</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-emerald-400 font-bold">{h.longestStreak}d</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${h.consistencyRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-300 font-bold w-8">{h.consistencyRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {habitStats.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Start logging habits to see consistency data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
