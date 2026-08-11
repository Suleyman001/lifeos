import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import TerritoriesManager from "@/components/territories/TerritoriesManager";
import prisma from "@/lib/prisma";

export default async function TerritoriesPage() {
  const territories = await prisma.territory.findMany({ orderBy: { weight: "desc" } });

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Territories"
          subtitle="10 core domains of life management. All XP, levels, and momentum mapped here."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <TerritoriesManager territories={territories} />
        </main>
      </div>
    </div>
  );
}
