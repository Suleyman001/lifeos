import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { Settings as SettingsIcon, Palette, Sliders } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst({
    where: { userId: "default-user-id" },
  });

  return (
    <PlaceholderModule
      title="Settings & System Configuration"
      subtitle="Customize accent colors, territory weights, theme options, and local database backup."
      icon={SettingsIcon}
    >
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 max-w-2xl">
        <div>
          <h4 className="text-sm font-bold text-white mb-2">Theme & Primary Accent</h4>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-white/20"
              style={{ backgroundColor: settings?.accentColor || "#047857" }}
            />
            <span className="text-xs font-mono text-slate-300">
              Primary Accent: <strong>{settings?.accentColor || "#047857"}</strong> (Dark Emerald)
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white mb-2">Database Engine</h4>
          <p className="text-xs text-slate-400">
            Local SQLite Database active at <code>prisma/dev.db</code>. Single User local execution.
          </p>
        </div>
      </div>
    </PlaceholderModule>
  );
}
