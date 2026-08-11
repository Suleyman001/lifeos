import { getDashboardData } from "@/lib/actions/dashboard";
import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import BetterThanYesterdayCard from "@/components/dashboard/BetterThanYesterdayCard";
import CurrentMissionCard from "@/components/dashboard/CurrentMissionCard";
import TimeAllocationDonut from "@/components/dashboard/TimeAllocationDonut";
import DailyEfficiencyCard from "@/components/dashboard/DailyEfficiencyCard";
import TerritoryOverviewGrid from "@/components/dashboard/TerritoryOverviewGrid";
import ActiveStreaksPanel from "@/components/dashboard/ActiveStreaksPanel";

export default async function DashboardPage() {
  const {
    user,
    territories,
    currentMission,
    dailySummary,
    habits,
    activityLogs,
  } = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Dashboard"
          subtitle="Compare yourself to yesterday, not to other people."
        />

        <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Hero Row: Better Than Yesterday */}
          <BetterThanYesterdayCard score={dailySummary?.betterThanYesterdayScore || 5.2} />

          {/* Grid Row 1: Current Mission & Time Allocation & Daily Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CurrentMissionCard mission={currentMission} />
            <TimeAllocationDonut />
            <DailyEfficiencyCard
              focusedMinutes={dailySummary?.focusedTimeMinutes || 185}
              deepWorkMinutes={dailySummary?.deepWorkMinutes || 120}
              wastedMinutes={dailySummary?.wastedTimeMinutes || 35}
              productivePercent={dailySummary?.productivePercent || 84.0}
            />
          </div>

          {/* Grid Row 2: Territory Overview */}
          <TerritoryOverviewGrid territories={territories} />

          {/* Grid Row 3: Active Streaks */}
          <ActiveStreaksPanel habits={habits} />
        </main>
      </div>
    </div>
  );
}
