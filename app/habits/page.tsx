import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import HabitsTracker from "@/components/habits/HabitsTracker";
import { getHabitsData } from "@/lib/actions/habits";

export default async function HabitsPage() {
  const { habits, territories } = await getHabitsData();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Habits Hub"
          subtitle="Central habit tracking space. Supports Binary, Numeric, Time-based, and Percentage habit types."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <HabitsTracker initialHabits={habits as any} territories={territories} />
        </main>
      </div>
    </div>
  );
}
