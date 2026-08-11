import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import { LucideIcon, Sparkles } from "lucide-react";

interface PlaceholderModuleProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  children?: React.ReactNode;
}

export default function PlaceholderModule({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
}: PlaceholderModuleProps) {
  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center text-white shadow-lg shadow-[#047857]/30">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {title}
                  {badge && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#047857]/30 text-[#34d399] border border-[#047857]/50 font-mono">
                      {badge}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5" />
              Active System Module
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
