import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import FuturePlansBoard from "@/components/future-plans/FuturePlansBoard";
import { getFuturePlans } from "@/lib/actions/future-plans";

export default async function FuturePlansPage() {
  const plans = await getFuturePlans();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Future Plans Roadmap"
          subtitle="Long-term life direction: Marriage, Relocation, Career, Education, Business & Financial Independence."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <FuturePlansBoard plans={plans as any} />
        </main>
      </div>
    </div>
  );
}
