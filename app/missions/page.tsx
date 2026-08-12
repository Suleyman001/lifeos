import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import MissionsManager from "@/components/missions/MissionsManager";
import { getMissions } from "@/lib/actions/missions";

export default async function MissionsPage() {
  const { missions, territories } = await getMissions();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Missions"
          subtitle="High-impact macro objectives. Set one as your current mission to feature it on the Dashboard."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <MissionsManager missions={missions as any} territories={territories} />
        </main>
      </div>
    </div>
  );
}
