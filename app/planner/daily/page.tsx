import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import DailyPlannerGrid from "./DailyPlannerGrid";
import { getPlannerTasks } from "@/lib/actions/planner";

interface DailyPlannerPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DailyPlannerPage({ searchParams }: DailyPlannerPageProps) {
  const resolvedParams = await searchParams;
  const dateStr = resolvedParams?.date;
  const { occurrences, territories, dateStr: currentDateStr } = await getPlannerTasks(dateStr);

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Daily Planner"
          subtitle="Time management engine. Make your time visible and protect high-impact blocks."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <DailyPlannerGrid
            initialOccurrences={occurrences}
            territories={territories}
            dateStr={currentDateStr}
          />
        </main>
      </div>
    </div>
  );
}
