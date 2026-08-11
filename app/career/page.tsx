import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import CareerPipeline from "@/components/career/CareerPipeline";
import { getCareerApplications } from "@/lib/actions/career";

export default async function CareerPage() {
  const applications = await getCareerApplications();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Career Module"
          subtitle="Job applications & relocation tracking across EU target countries."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <CareerPipeline initialApplications={applications as any} />
        </main>
      </div>
    </div>
  );
}
