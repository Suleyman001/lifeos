import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { Compass, Calendar } from "lucide-react";

export default async function FuturePlansPage() {
  const categories = ["Marriage", "Relocation", "Career", "Education", "Business", "Financial Independence"];

  return (
    <PlaceholderModule
      title="Future Plans Roadmap"
      subtitle="Long-term life direction, milestones, target dates, and high-level goals."
      icon={Compass}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Roadmap Pillar</span>
            <h4 className="text-sm font-bold text-white">{cat}</h4>
            <p className="text-xs text-slate-400">Target milestones and high-level preparation notes.</p>
          </div>
        ))}
      </div>
    </PlaceholderModule>
  );
}
