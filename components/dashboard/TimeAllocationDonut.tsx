"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon, Clock } from "lucide-react";

const timeData = [
  { name: "Sleep", value: 7.5, color: "#3b82f6" },
  { name: "Deep Work", value: 4.5, color: "#0891b2" },
  { name: "Study / Certs", value: 2.0, color: "#0d9488" },
  { name: "Quran & Prayer", value: 2.0, color: "#047857" },
  { name: "Exercise", value: 1.0, color: "#059669" },
  { name: "Family & Home", value: 2.5, color: "#4f46e5" },
  { name: "Wasted / Scrolling", value: 1.5, color: "#ef4444" },
  { name: "Other / Routine", value: 3.0, color: "#475569" },
];

export default function TimeAllocationDonut() {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <PieIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">24-Hour Time Allocation</h4>
              <p className="text-xs text-slate-400">Where your day actually went</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60">
            24.0 Hours
          </span>
        </div>

        {/* Chart Container */}
        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={timeData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {timeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#090d16",
                  borderColor: "#1e293b",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(value: any) => [`${value} hrs`, "Duration"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t border-slate-800/60">
        {timeData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate max-w-[90px]">{item.name}</span>
            </div>
            <span className="font-mono text-slate-400 text-[11px] font-semibold">{item.value}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}
