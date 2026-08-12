import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import StatisticsDashboard from "@/components/statistics/StatisticsDashboard";
import { getStatisticsData } from "@/lib/actions/statistics";

export default async function StatisticsPage() {
  const { dailySummaries, habitLogs, territories, habits } = await getStatisticsData();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Statistics & Analytics"
          subtitle="52-week contribution heatmap, territory XP, habit consistency, and daily trend charts."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <StatisticsDashboard
            dailySummaries={dailySummaries as any}
            habitLogs={habitLogs as any}
            territories={territories}
            habits={habits as any}
          />
        </main>
      </div>
    </div>
  );
}
