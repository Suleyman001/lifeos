import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import ChallengesManager from "@/components/challenges/ChallengesManager";
import { getChallengesData } from "@/lib/actions/challenges";

export default async function ChallengesPage() {
  const { masterChallenges, activeInstances } = await getChallengesData();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Challenges & Side Quests"
          subtitle="Master side quest library broken into manageable steps."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <ChallengesManager
            masterChallenges={masterChallenges as any}
            activeInstances={activeInstances as any}
          />
        </main>
      </div>
    </div>
  );
}
